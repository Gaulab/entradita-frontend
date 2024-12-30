// entradaFront/src/pages/EventDetail/Tabs/Sellers.jsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon, TicketCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { EyeIcon } from 'lucide-react';
export default function Sellers({
  vendedores,
  handleGenerarEmpleado,
  handleEditEmpleado,
  handleEliminarEmpleado,
  handleChangeEmpleadoStatus,
  copyToClipboard,
  ticketTags,
  setNewTicketTags,
  newTicketTags,
}) {
  const navigate = useNavigate();
  const [selectedSeller, setSelectedSeller] = useState(null);

  const MobileActionDialog = ({ seller, onClose }) => (
    <Dialog className="" open={!!seller} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el vendedor</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0">Selecciona una accion para realizar sobre el vendedor:</DialogDescription>
        <div className="text-gray-300">
          <p>
            <strong>Nombre:</strong> {seller?.assigned_name}
          </p>
          <p>
            <strong>Capacidad:</strong> {seller?.seller_capacity !== null ? seller?.seller_capacity : 'sin límite'}
          </p>
          <p>
            <strong>Ventas:</strong> {seller?.ticket_counter}
          </p>
          <p>
            <strong>Estado:</strong> {seller?.status === true ? 'Habilitado' : 'Deshabilitado'}
          </p>
          <p>
            <strong>Ticket tags:</strong> {seller?.ticket_tags.map((tag) => tag.name).join(', ')}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              copyToClipboard(`${window.location.origin}/seller/${seller?.uuid}`);
              onClose();
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace de vendedor
          </Button>

          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              window.open(`/seller/${seller?.uuid}`, '_blank');
              onClose();
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Ver página de vendedor
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleEditEmpleado(seller);
              onClose();
            }
            }
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar vendedor
          </Button>

          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleChangeEmpleadoStatus(seller);
              onClose();
            }}
          >
            {seller?.status === true ? <TicketX className="h-4 w-4 mr-2" /> : <TicketCheck className="h-4 w-4 mr-2" />}
            <span className="">{seller?.status === true ? 'Deshabilitar vendedor' : 'Habilitar vendedor'}</span>
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleEliminarEmpleado(seller);
              onClose();
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Eliminar vendedor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Vendedores</CardTitle>
        <CardDescription className="text-gray-400">Gestiona los enlaces para vendedores <br/> {window.innerWidth < 640 && "Haz click en una fila para ver más acciones"}</CardDescription>
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
                <TableHead className="text-gray-300">Capacidad</TableHead>
                <TableHead className="text-gray-300">Ventas</TableHead>
                <TableHead className="text-gray-300 hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendedores.map((vendedor) => (
                <TableRow
                  key={vendedor.id}
                  className="border-gray-700 cursor-pointer sm:cursor-default h-16"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      console.log('MobileActionDialog' + vendedor);
                      setSelectedSeller(vendedor);
                    }
                  }}
                >
                  <TableCell className="text-gray-300">{vendedor.assigned_name}</TableCell>
                  <TableCell className="text-gray-300">{vendedor.seller_capacity !== null ? vendedor.seller_capacity : 'sin límite'}</TableCell>
                  <TableCell className="text-gray-300">{vendedor.ticket_counter}</TableCell>
                  <TableCell className="hidden sm:table-cell  text-right sm:space-x-1 space-y-1">
                    <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/seller/${vendedor.uuid}`)} size="sm" title="Copiar enlace de vendedor">
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
                      title={vendedor.status === false ? 'Deshabilitar vendedor' : 'Habilitar vendedor'}
                      className={vendedor.status === false ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
                    >
                      {vendedor.status === true ? <TicketX className="h-4 w-4" /> : <TicketCheck className="h-4 w-4" />}
                      <span className="sr-only">{vendedor.status === true ? 'Deshabilitar vendedor' : 'Habilitar vendedor'}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <MobileActionDialog seller={selectedSeller} onClose={() => setSelectedSeller(null)} />
    </Card>
  );
}
