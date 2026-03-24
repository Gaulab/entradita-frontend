// entradaFront/src/pages/EventDetail/Tabs/Sellers.jsx
// react imports
import { useState, useContext, useCallback } from 'react';
// react-router imports
import { useNavigate } from 'react-router-dom';
// context imports
import EventDetailsContext from '@/context/EventDetailsContext';
import AuthContext from '@/context/AuthContext';
// Custom components
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
// Icons
import { EyeIcon, PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon, TicketCheck, Share2 } from 'lucide-react';
import { notifyError, notifyInfo } from '../../../utils/notify';
// api
import { changeEmployeeStatus } from '@/api/employeeApi';

export default function Sellers({}) {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const {
    event,
    sellers,
    setSellers,
    scanners,
    setScanners,
    reloadEmployees,
    setReloadEmployees,
    setIsSellerEmployee,
    setItemToDelete,
    isDeleteConfirmDialogOpen,
    setIsDeleteConfirmDialogOpen,
    editingEmployee,
    setEditingEmployee,
    newEmployeeName,
    setNewEmployeeName,
    newEmployeeCapacity,
    setNewEmployeeCapacity,
    newEmployeeTicketTags,
    setNewEmployeeTicketTags,
    setIsCreateEmployeeDialogOpen,
    copyToClipboard,
    setIsEditEmployeeDialogOpen,
  } = useContext(EventDetailsContext);

  const handleChangeEmpleadoStatus = useCallback(
    async (empleado) => {
      try {
        const updatedEmpleado = await changeEmployeeStatus(authToken.access, empleado);

        setReloadEmployees(!reloadEmployees);
      } catch (error) {
        console.error('Error updating empleado status:', error.message);
        notifyError(error.message);
      }
    },
    [authToken.access, sellers, scanners, reloadEmployees]
  );

  const handleEditEmpleado = useCallback((empleado) => {
    // console.log("Editing empleado:", empleado);
    setEditingEmployee(empleado);
    setNewEmployeeName(empleado.assigned_name);
    const capacity = empleado.seller_capacity !== null ? empleado.seller_capacity.toString() : '';
    setNewEmployeeCapacity(capacity);
    setNewEmployeeTicketTags(empleado.ticket_tags);
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

  const handleShare = (seller) => {
    const shareText = `¡Quiero que vendas para mi evento: ${event.name}! 📅🎟️\n\n🕵️ Puedes unirte en el siguiente enlace, es único para ti (no lo compartas):\n${window.location.origin}/seller/${seller.uuid}\n\n🔑 Te pedirá una contraseña para acceder, cuando estés listo pídemela!\n\n📚 Te dejo también un link para que aprendas rápido y fácil cómo vender:\n${window.location.origin}/seller-guide`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Te invito a mi evento!',
          text: shareText,
        })
        .then(() => {
          console.log('Ticket compartido exitosamente');
        })
        .catch((error) => {
          console.log('Error sharing', error);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      notifyInfo(`Comparte este enlace: ${window.location.origin}/ticket/${seller.uuid}`);
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          console.log('Texto de invitación copiado al portapapeles');
        })
        .catch((error) => {
          console.log('Error al copiar el texto', error);
        });
    }
  };

  const MobileActionDialog = ({ seller, onClose }) => (
    <Dialog className="" open={!!seller} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Acciones para el vendedor</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-0 m-0 text-gray-300">Selecciona una acción para realizar sobre el vendedor:</DialogDescription>
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
            <strong>Estado:</strong> {seller?.status === true ? ( <span className="text-green-500"> Habilitado</span> ) : ( <span className="text-red-500"> Deshabilitado</span> )}
          </p>
          <p>
            <strong>Ticket tags:</strong>  
            {seller?.ticket_tags.map((tag) => (
              <span key={tag.id} className="inline-block font-bold bg-gray-700 text-white m-1 px-1 rounded-full">
                {tag.name}
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-col space-y-2 m-0">
          {/* <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              copyToClipboard(`${window.location.origin}/seller/${seller?.uuid}`);
              onClose();
            }}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copiar enlace de vendedor
          </Button> */}


          <Button className="justify-start" variant="entraditaSecondary" onClick={() => handleShare(seller)}>
            <Share2 className="mr-2 h-4 w-4" />
            Invitar al vendedor
          </Button>


          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleEditEmpleado(seller);
              onClose();
            }}
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar vendedor
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
              handleChangeEmpleadoStatus(seller);
              onClose();
            }}
          >
            {seller?.status === true ? <TicketX className="h-4 w-4 mr-2" /> : <TicketCheck className="h-4 w-4 mr-2" />}
            <span className="">{seller?.status === true ? 'Deshabilitar  vendedor' : 'Habilitar vendedor'}</span>
          </Button>
          <Button
            className="justify-start"
            variant="entraditaSecondary"
            onClick={() => {
              handleDeleteEmployee(seller);
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
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Vendedores</CardTitle>
          <Button onClick={() => handleCreateEmployee(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
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
                <TableHead className="text-gray-300 text-center">Capacidad</TableHead>
                <TableHead className="text-gray-300 text-center">Ventas</TableHead>
                <TableHead className="text-gray-300 hidden sm:table-cell text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers?.map((vendedor) => (
                <TableRow
                  key={vendedor.id}
                  className="border-gray-700 cursor-pointer sm:cursor-default hover:bg-gray-700/30 transition-colors"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setSelectedSeller(vendedor);
                    }
                  }}
                >
                  <TableCell>
                    <span className="text-white">{vendedor.assigned_name}</span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {vendedor.status ? <span className="text-green-400">Habilitado</span> : <span className="text-red-400">Deshabilitado</span>}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300 text-center">{vendedor.seller_capacity ?? '∞'}</TableCell>
                  <TableCell className="text-gray-300 text-center">{vendedor.ticket_counter}</TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(`¡Quiero que vendas para mi evento: ${event.name}! 📅🎟️\n\n🕵️ Puedes unirte en el siguiente enlace, es único para ti (no lo compartas):\n${window.location.origin}/seller/${vendedor.uuid}\n\n🔑 Te pedirá una contraseña para acceder, cuando estés listo pídemela!\n\n📚 Te dejo también un link para que aprendas rápido y fácil cómo vender:\n${window.location.origin}/seller-guide`)}
                        title="Invitar vendedor"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => copyToClipboard(`${window.location.origin}/seller/${vendedor.uuid}`)}
                        title="Copiar enlace"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => handleEditEmpleado(vendedor)}
                        title="Editar"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                        onClick={() => handleDeleteEmployee(vendedor)}
                        title="Eliminar"
                      >
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${vendedor.status ? 'text-green-400 hover:text-red-400' : 'text-red-400 hover:text-green-400'}`}
                        onClick={() => handleChangeEmpleadoStatus(vendedor)}
                        title={vendedor.status ? 'Deshabilitar' : 'Habilitar'}
                      >
                        {vendedor.status ? <TicketCheck className="h-3.5 w-3.5" /> : <TicketX className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
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
