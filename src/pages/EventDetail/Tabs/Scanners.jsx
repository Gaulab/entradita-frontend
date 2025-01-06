// entradaFront/src/pages/EventDetail/Tabs/Scanners.jsx
// react imports
import { useState, useContext, useCallback } from 'react';
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
// icons
import { PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon, EyeIcon, TicketCheck } from 'lucide-react';
// context
import EventDetailsContext from '@/context/EventDetailsContext';

// api

export default function Scanners({}) {
  const [selectedScanner, setSelectedScanner] = useState(null);
  const {
    event,
    sellers,
    setSellers,
    scanners,
    setScanners,
    editingEmployee,
    setEditingEmployee,
    newEmployeeName,
    setNewEmployeeName,
    newEmployeeCapacity,
    setNewEmployeeCapacity,
    newEmployeeTicketTags,
    setNewEmployeeTicketTags,
    setIsEditEmployeeDialogOpen,
    setItemToDelete,
    setIsDeleteConfirmDialogOpen,
    setIsSellerEmployee,
    setIsCreateEmployeeDialogOpen,
    copyToClipboard,
  } = useContext(EventDetailsContext);

  const handleEditEmployee = useCallback((employee) => {
    // console.log("Editing empleado:", empleado);
    setEditingEmployee(employee);
    setNewEmployeeName(employee.assigned_name);
    const capacity = employee.seller_capacity !== null ? employee.seller_capacity.toString() : '';
    setNewEmployeeCapacity(capacity);
    setNewEmployeeTicketTags([]);
    setIsEditEmployeeDialogOpen(true);
  }, []);

  const handleDeleteEmployee = useCallback((empleado) => {
    setItemToDelete({
      type: empleado.is_seller ? 'vendedor' : 'escaner',
      id: empleado.id,
      status: empleado.status,
    });
    setIsDeleteConfirmDialogOpen(true);
  }, []);

  const handleCreateEmployee = useCallback((isSeller) => {
    setIsSellerEmployee(isSeller);
    setIsCreateEmployeeDialogOpen(true);
  }, []);

  const MobileActionDialog = ({ scanner, onClose }) => (
    <Dialog className="" open={!!scanner} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 ">
        <DialogHeader>
          <DialogTitle>Acciones para el scanner</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0">Selecciona una accion para realizar sobre el scanner:</DialogDescription>
        <div className="text-gray-300">
          <p>
            <strong>Nombre:</strong> {scanner?.assigned_name}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              copyToClipboard(`${window.location.origin}/scanner/${scanner?.uuid}`);
              onClose();
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace de scanner
          </Button>

          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              window.open(`/scanner/${scanner?.uuid}`, '_blank');
              onClose();
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            Ver página de scanner
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleEditEmployee(scanner);
              onClose();
            }}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar scanner
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleDeleteEmployee(scanner);
              onClose();
            }}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Eliminar scanner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Scanners</CardTitle>
        <CardDescription className="text-gray-400">
          Gestiona los enlaces para escáneres <br /> {window.innerWidth < 640 && 'Haz click en una fila para ver más acciones'}{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => handleCreateEmployee(false)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" /> Nuevo Scanner
        </Button>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 text-left">
                <TableHead className="text-gray-300">Nombre</TableHead>
                <TableHead className="text-gray-300 hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanners.map((scanner) => (
                <TableRow
                  key={scanner.id}
                  className="border-gray-700 cursor-pointer sm:cursor-default h-16"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setSelectedScanner(scanner);
                    }
                  }}
                >
                  <TableCell className="text-gray-300">{scanner.assigned_name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-right space-x-1 space-y-1">
                    <Button variant="outline" onClick={() => copyToClipboard(`${window.location.origin}/scanner/${scanner.uuid}`)} size="sm" title="Copiar enlace de scanner">
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Copiar enlace de scanner</span>
                    </Button>
                    <Button variant="outline" onClick={() => handleEditEmployee(scanner)} size="sm" title="Editar escáner">
                      <PencilIcon className="h-4 w-4" />
                      <span className="sr-only">Editar escáner</span>
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteEmployee(scanner)} size="sm" title={'Eliminar escáner'}>
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
      <MobileActionDialog scanner={selectedScanner} onClose={() => setSelectedScanner(null)} />
    </Card>
  );
}
