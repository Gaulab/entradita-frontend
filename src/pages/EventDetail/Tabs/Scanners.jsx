// entradaFront/src/pages/EventDetail/Tabs/Scanners.jsx
// react imports
import { useState, useContext, useCallback } from 'react';
// custom components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
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
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Acciones para el scanner</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0 text-gray-300">Selecciona una acción para realizar sobre el scanner:</DialogDescription>
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
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Scanners</CardTitle>
          <Button onClick={() => handleCreateEmployee(false)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
            <PlusIcon className="h-4 w-4 mr-1.5" /> Nuevo
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
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
                  className="border-gray-700 cursor-pointer sm:cursor-default hover:bg-gray-700/30 transition-colors"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setSelectedScanner(scanner);
                    }
                  }}
                >
                  <TableCell className="text-white">{scanner.assigned_name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(`${window.location.origin}/scanner/${scanner.uuid}`)}
                        title="Copiar enlace"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => handleEditEmployee(scanner)}
                        title="Editar"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                        onClick={() => handleDeleteEmployee(scanner)}
                        title="Eliminar"
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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
