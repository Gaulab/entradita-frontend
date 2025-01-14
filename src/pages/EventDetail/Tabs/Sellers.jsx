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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../components/ui/dialog';
// Icons
import { EyeIcon, PlusIcon, Trash2Icon, PencilIcon, TicketX, LinkIcon, TicketCheck, Share2 } from 'lucide-react';
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
        alert(error.message);
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
    const shareText = `¡Quiero que vendas para mi evento: ${event.name}! 📅🎟️\n\n🕵️ Puedes unirte en el siguiente enlace, es único para ti (no lo compartas):\n${window.location.origin}/ticket/${seller.uuid}\n\n🔑 Te pedirá una contraseña para acceder, cuando estés listo pídemela!\n\n📚 Te dejo también un link para que aprendas rápido y fácil cómo vender:\n${window.location.origin}/seller-guide`;

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
      alert(`Comparte este enlace: ${window.location.origin}/ticket/${seller.uuid}`);
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
            <strong>Ticket tags:</strong>  
            {seller?.ticket_tags.map((tag) => (
              <span key={tag.id} className="inline-block font-bold bg-gray-700 text-white m-1 px-1 rounded-full">
                {tag.name}
              </span>
            ))}
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
      <CardHeader>
        <CardTitle className="text-white">Vendedores</CardTitle>
        <CardDescription className="text-gray-400">
          Gestiona los enlaces para vendedores <br /> {window.innerWidth < 640 && 'Haz click en una fila para ver más acciones'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => handleCreateEmployee(true)} className="mb-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
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
              {sellers?.map((vendedor) => (
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
                    <Button variant="destructive" onClick={() => handleDeleteEmployee(vendedor)} size="sm" title="Eliminar vendedor">
                      <Trash2Icon className="h-4 w-4" />
                      <span className="sr-only">Eliminar vendedor</span>
                    </Button>
                    <Button
                      onClick={() => handleChangeEmpleadoStatus(vendedor)}
                      size="sm"
                      title={vendedor.status === false ? 'Deshabilitar vendedor' : 'Habilitar vendedor'}
                      className={vendedor.status === false ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}
                    >
                      {vendedor.status === true ? <TicketCheck className="h-4 w-4" /> : <TicketX className="h-4 w-4" />}
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
