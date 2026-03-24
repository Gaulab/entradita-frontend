import { useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useEnvironment } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/entradita-logo.glb')
useEnvironment.preload({ preset: 'night' })

const SPIN_START = 6
const SPIN_CRUISE = 0.5
const SPIN_DECAY = 1.2

function LogoMesh({ dragging, onReady }) {
  const groupRef = useRef()
  const speedRef = useRef(SPIN_START)
  const materialsRef = useRef([])
  const { scene } = useGLTF('/entradita-logo.glb')
  const envMap = useEnvironment({ preset: 'night' })

  useEffect(() => {
    const mats = []
    scene.traverse((child) => {
      if (child.isMesh) {
        const prevName = child.material?.name ?? ''
        // Primera carga: materiales del GLB (p. ej. BlackMaterial). Vuelta atrás: ya son los
        // nuestros; si solo miráramos includes('Black'), fallaría porque el nombre no lo tiene.
        const isBlack =
          prevName === 'EntraditaBlack' ||
          (prevName !== 'EntraditaWhite' && prevName.includes('Black'))
        const mat = new THREE.MeshPhysicalMaterial({
          name: isBlack ? 'EntraditaBlack' : 'EntraditaWhite',
          color: isBlack ? '#0a0a12' : '#c0d0e8',
          roughness: isBlack ? 0.08 : 0.05,
          metalness: 1.0,
          reflectivity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          emissive: isBlack ? '#000000' : '#3b82f6',
          emissiveIntensity: isBlack ? 0 : 0.12,
          side: THREE.DoubleSide,
          envMap,
          envMapIntensity: isBlack ? 1.2 : 1.5,
        })
        child.material = mat
        mats.push(mat)
      }
    })
    materialsRef.current = mats
    onReady()
  }, [scene, envMap])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (!dragging) {
      speedRef.current += (SPIN_CRUISE - speedRef.current) * SPIN_DECAY * delta
      groupRef.current.rotation.y += delta * speedRef.current
    }
    const yRot = groupRef.current.rotation.y
    materialsRef.current.forEach((mat) => {
      if (mat.envMapRotation) {
        mat.envMapRotation.y = yRot
        mat.needsUpdate = true
      }
    })
  })

  return (
    <group ref={groupRef} scale={1.8}>
      <primitive object={scene} />
    </group>
  )
}

export default function Logo3D() {
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, -2.5, 6], fov: 40 }}
      style={{ touchAction: 'pan-y', opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 4]} intensity={2} />
      <directionalLight position={[-2, -1, -3]} intensity={0.6} />
      <LogoMesh dragging={dragging} onReady={handleReady} />
      <pointLight color="#3b82f6" intensity={4} distance={8} position={[0, 0, -2]} />
      <pointLight color="#7c3aed" intensity={2} distance={6} position={[1.5, 1, -1]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        onStart={() => setDragging(true)}
        onEnd={() => setDragging(false)}
      />
    </Canvas>
  )
}
