// entraditaFront/srs/pages/EventDetail/EventDetails.jsx
import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Custom components
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ArrowLeftIcon, EditIcon, Ticket, Users, ScanIcon } from "lucide-react";
import AuthContext from "../../context/AuthContext";
import Event from "./Event";
import Tickets from "./Tabs/Tickets";
import Vendedores from "./Tabs/Vendedores";
import Escaners from "./Tabs/Escaners";
import DialogCreateEmployee from "./Dialogs/DialogCreateEmployee";
import DialogEditEmployee from "./Dialogs/DialogEditEmployee";
import DialogDeleteItem from "./Dialogs/DialogDeleteItem";
// API
import { getEventDetails } from "../../api/eventApi";
import { getEmpleados } from "../../api/empleadoApi";
import { createEmpleado } from "../../api/empleadoApi";
import { updateEmpleado } from "../../api/empleadoApi";
import { deleteEmpleado } from "../../api/empleadoApi";
import { changeEmpleadoStatus } from "../../api/empleadoApi";
import { deleteTicket } from "../../api/ticketApi";
import { updateTicketSales } from "../../api/eventApi";

export default function OldEventDetails() {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [escaners, setEscaners] = useState([]);
  const [reload, setReload] = useState(false);

  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ticketSalesEnabled, setTicketSalesEnabled] = useState(false);

  const [newEmpleadoName, setNewEmpleadoName] = useState("");
  const [newEmpleadoCapacity, setNewEmpleadoCapacity] = useState("");
  const [newTicketTags, setNewTicketTags] = useState([]);
  const [isSellerEmpleado, setIsSellerEmpleado] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  const itemsPerPage = 10;
  const [copyMessage, setCopyMessage] = useState("");


  useEffect(() => {
    const getEventData = async () => {
      try {
        const data = await getEventDetails(id, authToken.access);
        // console.log("Event data:", data);
        setEvent(data.event);
        setTicketSalesEnabled(data.event.ticket_sales_enabled);
        setTickets(data.tickets);
        setVendedores(data.vendedores);
        setEscaners(data.escaners);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
        alert(error.message);
      }
    };
    getEventData();
  }, []);

  useEffect(() => {
    const getEventEmpleados = async () => {
      try {
        const data = await getEmpleados(id, authToken.access);
        setVendedores(data.vendedores);
        setEscaners(data.escaners);
      } catch (error) {
        console.error("Error fetching empleados data:", error.message);
        alert(error.message);
      }
    };
    getEventEmpleados();
  }, [reload]);

  const handleConfirmGenerarEmpleado = useCallback(async () => {
    try {
      // console.log("newTicketTags en handleConfirmGenerarEmpleado: ", newTicketTags);
      // console.log("Creating empleado...");
      // console.log("isSellerEmpleado:", isSellerEmpleado);
      // console.log("newEmpleadoName:", newEmpleadoName);
      // console.log("newEmpleadoCapacity:", newEmpleadoCapacity);
      // console.log("newTicketTags:", newTicketTags);
      
      const data = await createEmpleado(authToken.access, isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, newTicketTags, id);
      if (isSellerEmpleado) {
        setVendedores([...vendedores, data]);
      } else {
        setEscaners([...escaners, data]);
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error creating empleado:", error.message);
      alert(error.message);
    }
    setIsDialogOpen(false);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
    setNewTicketTags([]);
  }, [id, isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, vendedores, escaners, reload, newTicketTags]);

  const handleConfirmEditEmpleado = useCallback(async () => {
    try {
      const updatedEmpleado = await updateEmpleado(authToken.access, editingEmpleado, newEmpleadoName, newEmpleadoCapacity);
      if (editingEmpleado.is_seller) {
        setVendedores(vendedores.map((v) => (v.id === updatedEmpleado.id ? updatedEmpleado : v)));
      } else {
        setEscaners(escaners.map((e) => (e.id === updatedEmpleado.id ? updatedEmpleado : e)));
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error updating empleado:", error.message);
      alert(error.message);
    }
    setIsEditDialogOpen(false);
    setEditingEmpleado(null);
    setNewEmpleadoName("");
    setNewEmpleadoCapacity("");
  }, [editingEmpleado, newEmpleadoName, newEmpleadoCapacity, vendedores, escaners, reload]);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      let response;
      if (itemToDelete.type === "ticket") {
        response = await deleteTicket(authToken.access, itemToDelete);
      } else {
        response = await deleteEmpleado(authToken.access, itemToDelete);
      }
      if (itemToDelete.type === "ticket") {
        setTickets(tickets.filter((ticket) => ticket.id !== itemToDelete.id));
      } else if (itemToDelete.status === 1) {
        // Update the employee's status in the state
        const updateEmpleado = (empleados) => empleados.map((e) => (e.id === itemToDelete.id ? { ...e, status: 0 } : e));
        if (itemToDelete.type === "vendedor") {
          setVendedores(updateEmpleado);
        } else {
          setEscaners(updateEmpleado);
        }
      } else {
        // Remove the employee from the state
        if (itemToDelete.type === "vendedor") {
          setVendedores(vendedores.filter((v) => v.id !== itemToDelete.id));
        } else {
          setEscaners(escaners.filter((e) => e.id !== itemToDelete.id));
        }
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error in delete operation:", error.message);
      alert(error.message);
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
    setIsChecked(false);
  }, [itemToDelete, tickets, vendedores, escaners, reload]);

  const handleUpdateTicketSales = useCallback(async () => {
    try {
        const data = await updateTicketSales(id, authToken.access);
        setTicketSalesEnabled(data.ticket_sales_enabled);
    } catch (error) {
        console.error(error.message);
    }
  }, [event]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage("Copiado");
        setTimeout(() => setCopyMessage(""), 2000); // El mensaje desaparece después de 2 segundos
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
        setCopyMessage("Error al copiar");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  }, []);

  const handleEliminarTicket = useCallback((id_ticket) => {
    setItemToDelete({ type: "ticket", id: id_ticket });
    setDeleteConfirmOpen(true);
  }, []);

  const handleGenerarEmpleado = useCallback((isSeller) => {
    setIsSellerEmpleado(isSeller);
    setIsDialogOpen(true);
  }, []);

  const handleEditEmpleado = useCallback((empleado) => {
    setEditingEmpleado(empleado);
    setNewEmpleadoName(empleado.assigned_name);
    const capacity = empleado.seller_capacity !== null ? empleado.seller_capacity.toString() : "";
    setNewEmpleadoCapacity(capacity);
    setIsEditDialogOpen(true);
  }, []);

  const handleEliminarEmpleado = useCallback((empleado) => {
    setItemToDelete({
      type: empleado.is_seller ? "vendedor" : "escaner",
      id: empleado.id,
      status: empleado.status,
    });
    setDeleteConfirmOpen(true);
  }, []);

  const handleChangeEmpleadoStatus = useCallback(async (empleado) => {
    console.log("Changing status of empleado:", empleado.id);
    try {
      const updatedEmpleado = await changeEmpleadoStatus(authToken.access, empleado);
      if (empleado.is_seller) {
        setVendedores(vendedores.map((v) => (v.id === updatedEmpleado.id ? updatedEmpleado : v)));
      } else {
        setEscaners(escaners.map((e) => (e.id === updatedEmpleado.id ? updatedEmpleado : e)));
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error updating empleado status:", error.message);
      alert(error.message);
    }
  }, [authToken.access, vendedores, escaners, reload]);

  const filteredTickets = tickets.filter((ticket) => ticket.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.owner_dni.includes(searchTerm));

  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);

  };

  return (
    <div className="flex justify-center space-y-6 pb-8 bg-gray-900 text-white p-4 min-h-screen w-screen ">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Dashboard
          </Button>
          <Button onClick={() => navigate(`/edit-event/${id}`)} variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700">
            <EditIcon className="mr-2 h-4 w-4" /> Editar Evento
          </Button>
        </div>

        <Event event={event} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-5">
            <TabsTrigger value="tickets" className="text-lg bg-blue-600 text-gray-900"><Ticket className="mr-2 h-6 w-6" /> Tickets</TabsTrigger>
            <TabsTrigger value="vendedores" className="text-lg bg-green-600 text-gray-900"><Users className="mr-2 h-6 w-6" /> Vendedores</TabsTrigger>
            <TabsTrigger value="escaners" className="text-lg bg-purple-600 text-gray-900"><ScanIcon className="mr-2 h-6 w-6" /> Scanners</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <Tickets id={id} paginatedTickets={paginatedTickets} pageCount={pageCount} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleEliminarTicket={handleEliminarTicket} copyToClipboard={copyToClipboard} ticketSalesEnabled={ticketSalesEnabled} handleUpdateTicketSales={handleUpdateTicketSales} dniRequired={event.dni_required} ticketTags={event.ticket_tags} />
          </TabsContent>

          <TabsContent value="vendedores">
            <Vendedores vendedores={vendedores} handleGenerarEmpleado={handleGenerarEmpleado} handleEditEmpleado={handleEditEmpleado} handleEliminarEmpleado={handleEliminarEmpleado} handleChangeEmpleadoStatus={handleChangeEmpleadoStatus} copyToClipboard={copyToClipboard} ticketTags={event.ticket_tags}  setNewTicketTags={setNewTicketTags} newTicketTags={newTicketTags}/>
          </TabsContent>

          <TabsContent value="escaners">
            <Escaners escaners={escaners} handleGenerarEmpleado={handleGenerarEmpleado} handleEditEmpleado={handleEditEmpleado} handleEliminarEmpleado={handleEliminarEmpleado} copyToClipboard={copyToClipboard} />
          </TabsContent> 
        </Tabs>

        {copyMessage && <div className="fixed bottom-4 right-4 bg-green-400 text-black px-4 py-2 rounded-md shadow-lg">{copyMessage}</div>}

        <DialogCreateEmployee isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} isSellerEmpleado={isSellerEmpleado}
          newEmpleadoName={newEmpleadoName} setNewEmpleadoName={setNewEmpleadoName} newEmpleadoCapacity={newEmpleadoCapacity}
          setNewEmpleadoCapacity={setNewEmpleadoCapacity} handleConfirmGenerarEmpleado={handleConfirmGenerarEmpleado}
          setNewTicketTags={setNewTicketTags} newTicketTags={newTicketTags} ticket_tags={event.ticket_tags} />

        <DialogEditEmployee isEditDialogOpen={isEditDialogOpen} setIsEditDialogOpen={setIsEditDialogOpen} editingEmpleado={editingEmpleado} newEmpleadoName={newEmpleadoName} setNewEmpleadoName={setNewEmpleadoName} newEmpleadoCapacity={newEmpleadoCapacity} setNewEmpleadoCapacity={setNewEmpleadoCapacity} handleConfirmEditEmpleado={handleConfirmEditEmpleado} />

        <DialogDeleteItem deleteConfirmOpen={deleteConfirmOpen} setDeleteConfirmOpen={setDeleteConfirmOpen}
          handleConfirmDelete={handleConfirmDelete} itemToDelete={itemToDelete} isChecked={isChecked} setIsChecked={setIsChecked} handleCheckboxChange={handleCheckboxChange} />

      </div>
    </div>
  );
}
