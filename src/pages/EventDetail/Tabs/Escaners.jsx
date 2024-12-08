import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon } from "lucide-react";

export default function Escaners({ escaners, handleGenerarEmpleado, handleEditEmpleado, handleEliminarEmpleado, copyToClipboard }) {
    return (
        <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Escáneres</CardTitle>
                <CardDescription className="text-gray-400">Gestiona los enlaces para escáneres</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleGenerarEmpleado(false)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Escáner
                </Button>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 text-left">
                        <TableHead className="text-gray-300">Nombre</TableHead>
                        <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {escaners.map((escaner) => (
                        <TableRow key={escaner.id} className={`border-gray-700 ${escaner.status === false ? "opacity-50" : ""}`}>
                          <TableCell className="text-gray-300">{escaner.assigned_name}</TableCell>
                          <TableCell className="text-right space-x-1 space-y-1">
                            <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/escaner/${escaner.uuid}`)} size="sm" title="Copiar enlace de escaner">
                              <LinkIcon className="h-4 w-4" />
                              <span className="sr-only">Copiar enlace de escaner</span>
                            </Button>
                            <Button variant="outline" onClick={() => handleEditEmpleado(escaner)} size="sm" title="Editar escáner">
                              <PencilIcon className="h-4 w-4" />
                              <span className="sr-only">Editar escáner</span>
                            </Button>
                            <Button variant="destructive" onClick={() => handleEliminarEmpleado(escaner)} size="sm" title={"Eliminar escáner"}>
                              <Trash2Icon className="h-4 w-4" />
                              <span className="sr-only">Eliminar escáner</span>
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