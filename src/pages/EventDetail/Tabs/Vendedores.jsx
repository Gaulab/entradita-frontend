// Custom components
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon, TicketCheck } from "lucide-react";

export default function Vendedores({ vendedores, handleGenerarEmpleado, handleEditEmpleado, handleEliminarEmpleado, handleChangeEmpleadoStatus, copyToClipboard, ticketTags, setNewTicketTags, newTicketTags }) {

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-white">Vendedores</CardTitle>
                <CardDescription className="text-gray-400">Gestiona los enlaces para vendedores</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => handleGenerarEmpleado(true)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Vendedor
                </Button>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700 text-left">
                                <TableHead className="text-gray-300">Nombre</TableHead>
                                <TableHead className="text-gray-300 hidden sm:table-cell">Capacidad</TableHead>
                                <TableHead className="text-gray-300 hidden sm:table-cell">Tickets Vendidos</TableHead>
                                <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vendedores.map((vendedor) => (
                                <TableRow key={vendedor.id} className={`border-gray-700 `}>
                                    <TableCell className="text-gray-300">{vendedor.assigned_name}</TableCell>
                                    <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.seller_capacity !== null ? vendedor.seller_capacity : "sin límite"}</TableCell>
                                    <TableCell className="text-gray-300 hidden sm:table-cell">{vendedor.ticket_counter}</TableCell>
                                    <TableCell className="text-right space-x-1 space-y-1">
                                        <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/vendedor/${vendedor.uuid}`)} size="sm" title="Copiar enlace de vendedor">
                                            <LinkIcon className="h-4 w-4" />
                                            <span className="sr-only">Copiar enlace de vendedor</span>
                                        </Button>
                                        <Button variant="outline" onClick={() => handleEditEmpleado(vendedor)} size="sm" title="Editar vendedor">
                                            <PencilIcon className="h-4 w-4" />
                                            <span className="sr-only">Editar vendedor</span>
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleEliminarEmpleado(vendedor)} size="sm" title="Eliminar vendedor">
                                            <Trash2Icon className="h-4 w-4" />
                                            <span className="sr-only">Eliminar vendedor</span>
                                        </Button>
                                        <Button
                                            onClick={() => handleChangeEmpleadoStatus(vendedor)}
                                            size="sm"
                                            title={vendedor.status === false ? "Deshabilitar vendedor" : "Habilitar vendedor"}
                                            className={vendedor.status === false ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                                        >
                                            {vendedor.status === true ? <TicketX className="h-4 w-4" /> : <TicketCheck className="h-4 w-4" />}
                                            <span className="sr-only">{vendedor.status === true ? "Deshabilitar vendedor" : "Habilitar vendedor"}</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}