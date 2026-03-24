import bpy
import os
import sys
import math
import mathutils

SVG_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'entradita.svg')
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '..', 'public', 'entradita-logo.glb')

EXTRUDE_DEPTH = 0.006
BEVEL_DEPTH = 0.0015
BEVEL_RESOLUTION = 2

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
for col in bpy.data.collections:
    bpy.data.collections.remove(col)

bpy.ops.import_curve.svg(filepath=SVG_PATH)

svg_collection = [c for c in bpy.data.collections if c.objects][0]
curve_objects = [obj for obj in svg_collection.objects if obj.type == 'CURVE']
logo_curve = curve_objects[0]
spline_count = len(logo_curve.data.splines)
print(f"Imported curve with {spline_count} splines")

# Structure:
#   0: ticket exterior (WHITE, depth 0)
#   1: ventana marco (BLACK, depth 1) — contains 2
#   2: cuadrado interior (WHITE, depth 2) — inside 1
#   3: ventana marco (BLACK, depth 1) — contains 4
#   4: cuadrado interior (WHITE, depth 2) — inside 3
#   5: ventana marco (BLACK, depth 1) — contains 6
#   6: cuadrado interior (WHITE, depth 2) — inside 5
#   7: QR pieza (BLACK, depth 1) — no children
#   8: QR pieza (BLACK, depth 1) — no children
nesting_depth = [0, 1, 2, 1, 2, 1, 2, 1, 1]

# Which depth-2 solid is inside which depth-1 hole
hole_contains = {1: 2, 3: 4, 5: 6}

# Materials
white_mat = bpy.data.materials.new(name="WhiteMaterial")
white_mat.use_nodes = True
bsdf_w = white_mat.node_tree.nodes.get("Principled BSDF")
if bsdf_w:
    bsdf_w.inputs["Base Color"].default_value = (0.92, 0.94, 0.97, 1.0)
    bsdf_w.inputs["Metallic"].default_value = 0.85
    bsdf_w.inputs["Roughness"].default_value = 0.15

black_mat = bpy.data.materials.new(name="BlackMaterial")
black_mat.use_nodes = True
bsdf_b = black_mat.node_tree.nodes.get("Principled BSDF")
if bsdf_b:
    bsdf_b.inputs["Base Color"].default_value = (0.02, 0.02, 0.03, 1.0)
    bsdf_b.inputs["Metallic"].default_value = 0.3
    bsdf_b.inputs["Roughness"].default_value = 0.5

# Separate each spline into its own object
spline_objects = []
for i in range(spline_count):
    bpy.ops.object.select_all(action='DESELECT')
    logo_curve.select_set(True)
    bpy.context.view_layer.objects.active = logo_curve
    bpy.ops.object.duplicate()
    dup = bpy.context.active_object
    for j in reversed(range(len(dup.data.splines))):
        if j != i:
            dup.data.splines.remove(dup.data.splines[j])

    depth = nesting_depth[i]

    if depth >= 2:
        dup.data.extrude = EXTRUDE_DEPTH * 3
        dup.data.bevel_depth = 0
    elif depth == 1:
        dup.data.extrude = EXTRUDE_DEPTH * 1.3
        dup.data.bevel_depth = 0
    else:
        dup.data.extrude = EXTRUDE_DEPTH
        dup.data.bevel_depth = BEVEL_DEPTH
    dup.data.bevel_resolution = BEVEL_RESOLUTION

    bpy.ops.object.select_all(action='DESELECT')
    dup.select_set(True)
    bpy.context.view_layer.objects.active = dup
    bpy.ops.object.convert(target='MESH')

    # QR pieces: add mesh Bevel modifier to round edges like the ventanas
    if i in (7, 8):
        bev = dup.modifiers.new(name="Bevel", type='BEVEL')
        bev.width = 0.001
        bev.segments = 3
        bev.limit_method = 'ANGLE'
        bev.angle_limit = math.radians(30)
        bpy.ops.object.modifier_apply(modifier=bev.name)

    is_hole = depth % 2 == 1
    dup.data.materials.clear()
    dup.data.materials.append(black_mat if is_hole else white_mat)

    spline_objects.append(dup)
    role = 'CUTTER' if depth >= 2 else ('BLACK' if is_hole else 'WHITE')
    print(f"  Spline {i}: {role} depth={depth}, verts={len(dup.data.vertices)}")

# Boolean: cut the depth-2 shapes out of their parent depth-1 shapes
# This makes the black ventanas have real holes where the white squares go
for hole_idx, solid_idx in hole_contains.items():
    hole_obj = spline_objects[hole_idx]
    cutter_obj = spline_objects[solid_idx]

    # Make a taller copy of the cutter for clean boolean
    bpy.ops.object.select_all(action='DESELECT')
    cutter_obj.select_set(True)
    bpy.context.view_layer.objects.active = cutter_obj
    bpy.ops.object.duplicate()
    tall_cutter = bpy.context.active_object
    tall_cutter.scale.z = 5.0
    bpy.ops.object.transform_apply(scale=True)

    # Boolean difference on the hole
    bpy.ops.object.select_all(action='DESELECT')
    hole_obj.select_set(True)
    bpy.context.view_layer.objects.active = hole_obj

    bool_mod = hole_obj.modifiers.new(name=f"Cut_{solid_idx}", type='BOOLEAN')
    bool_mod.operation = 'DIFFERENCE'
    bool_mod.object = tall_cutter
    bool_mod.solver = 'EXACT'
    bpy.ops.object.modifier_apply(modifier=bool_mod.name)

    # Delete the tall cutter
    bpy.ops.object.select_all(action='DESELECT')
    tall_cutter.select_set(True)
    bpy.ops.object.delete()
    print(f"  Cut spline {solid_idx} from spline {hole_idx}")

# Delete cutter objects (depth 2) — they already did their job in the boolean
cutter_indices = [i for i in range(spline_count) if nesting_depth[i] >= 2]
for i in cutter_indices:
    obj = spline_objects[i]
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.delete()
print(f"  Deleted {len(cutter_indices)} cutter objects")

# Only ticket (depth 0) and black pieces (depth 1) remain
white_objs = [spline_objects[i] for i in range(spline_count) if nesting_depth[i] == 0]
black_objs = [spline_objects[i] for i in range(spline_count) if nesting_depth[i] == 1]

# Join whites (just the ticket)
bpy.ops.object.select_all(action='DESELECT')
for obj in white_objs:
    obj.select_set(True)
bpy.context.view_layer.objects.active = white_objs[0]
if len(white_objs) > 1:
    bpy.ops.object.join()
white_obj = bpy.context.active_object
white_obj.name = "TicketWhite"

# Join blacks
bpy.ops.object.select_all(action='DESELECT')
for obj in black_objs:
    obj.select_set(True)
bpy.context.view_layer.objects.active = black_objs[0]
if len(black_objs) > 1:
    bpy.ops.object.join()
black_obj = bpy.context.active_object
black_obj.name = "TicketBlack"

# Delete original curve
bpy.ops.object.select_all(action='DESELECT')
logo_curve.select_set(True)
bpy.ops.object.delete()

# Join ALL into one single object first, then split by material after transforms
# This ensures everything stays aligned
final_objects = [white_obj, black_obj]

bpy.ops.object.select_all(action='DESELECT')
for obj in final_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = white_obj
bpy.ops.object.join()
result_obj = bpy.context.active_object
result_obj.name = "EntraditaLogo"

# Center, rotate, scale as one object
bpy.ops.object.select_all(action='DESELECT')
result_obj.select_set(True)
bpy.context.view_layer.objects.active = result_obj

bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
result_obj.location = (0, 0, 0)
result_obj.rotation_euler = (math.pi / 2, 0, 0)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

dims = result_obj.dimensions
max_dim = max(dims.x, dims.y, dims.z)
if max_dim > 0:
    scale_factor = 2.0 / max_dim
    result_obj.scale = (scale_factor, scale_factor, scale_factor)
    bpy.ops.object.transform_apply(scale=True)

# Recalculate normals
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')

# Separate by material so GLB has two meshes
bpy.ops.mesh.separate(type='MATERIAL')

# Shade each appropriately
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        mat_name = obj.data.materials[0].name if obj.data.materials else ''
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        if 'Black' in mat_name:
            obj.name = 'TicketBlack'
            bpy.ops.object.shade_flat()
        else:
            obj.name = 'TicketWhite'
            bpy.ops.object.shade_smooth()

# Cleanup - keep only mesh objects
keep = [obj for obj in bpy.data.objects if obj.type == 'MESH']
for obj in list(bpy.data.objects):
    if obj not in keep:
        bpy.data.objects.remove(obj, do_unlink=True)

# Export
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_PATH,
    export_format='GLB',
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_apply=True,
)

file_size = os.path.getsize(OUTPUT_PATH)
print(f"GLB exported: {OUTPUT_PATH}")
print(f"File size: {file_size / 1024:.1f} KB")
print("Done!")
