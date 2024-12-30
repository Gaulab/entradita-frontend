import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// API functions
import { getEventDetails, updateTicketSales } from "../../api/eventApi";
import { getEmpleados } from "../../api/empleadoApi";
import { createEmpleado } from "../../api/empleadoApi";
import { updateEmpleado } from "../../api/empleadoApi";
import { deleteEmpleado } from "../../api/empleadoApi";
import { changeEmpleadoStatus } from "../../api/empleadoApi";
import { deleteTicket } from "../../api/ticketApi";

const EventDetailsContext = createContext();

export const EventDetailsProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados principales
  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [scanners, setScanners] = useState([]);
  const [reload, setReload] = useState(false);

  // Otros estados
  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [copyMessage, setCopyMessage] = useState("");

  // Dialogs 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const [ticketSalesEnabled, setTicketSalesEnabled] = useState(false);
  const [newEmpleadoName, setNewEmpleadoName] = useState("");
  const [newEmpleadoCapacity, setNewEmpleadoCapacity] = useState("");
  const [newTicketTags, setNewTicketTags] = useState([]);
  const [isSellerEmpleado, setIsSellerEmpleado] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch inicial de datos
  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getEventDetails(id, authToken.access);
      setEvent(data.event);
      setTicketSalesEnabled(data.event.ticket_sales_enabled);
      setTickets(data.tickets.sort((a, b) => b.id - a.id));
      setSellers(data.sellers);
      setEscaners(data.scanners);
    };
    fetchEventData().catch(error => {
      console.error("Error fetching event data:", error.message);
    });
  }, [id]);


  // Funciones para manejar la lógica
  
  const handleConfirmGenerarEmpleado = useCallback(async () => {
    try {
      const data = await createEmpleado(isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, newTicketTags, id);
      const updateList = isSellerEmpleado ? setVendedores : setEscaners;
      updateList(prev => [...prev, data]);
      setReload(!reload);
    } catch (error) {
      console.error("Error creating empleado:", error.message);
    }
    setIsDialogOpen(false);
  }, [isSellerEmpleado, newEmpleadoName, newEmpleadoCapacity, newTicketTags, id, reload]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (itemToDelete.type === "ticket") {
        await deleteTicket(itemToDelete.id);
        setTickets(tickets.filter(ticket => ticket.id !== itemToDelete.id));
      } else {
        await deleteEmpleado(itemToDelete.id);
        const updateList = itemToDelete.type === "vendedor" ? setVendedores : setEscaners;
        updateList(prev => prev.filter(item => item.id !== itemToDelete.id));
      }
      setReload(!reload);
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
    setDeleteConfirmOpen(false);
  }, [itemToDelete, tickets, vendedores, escaners, reload]);

  // Otros manejadores (editar, actualizar estado, copiar, etc.)
  const handleUpdateTicketSales = useCallback(async () => {
    try {
      const data = await updateTicketSales(id);
      setTicketSalesEnabled(data.ticket_sales_enabled);
    } catch (error) {
      console.error("Error updating ticket sales:", error.message);
    }
  }, [id]);

  return (
    <EventDetailsContext.Provider
      value={{
        event,
        tickets,
        vendedores,
        escaners,
        activeTab,
        setActiveTab,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        isDialogOpen,
        setIsDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        ticketSalesEnabled,
        handleConfirmGenerarEmpleado,
        handleConfirmDelete,
        handleUpdateTicketSales,
        newEmpleadoName,
        setNewEmpleadoName,
        newEmpleadoCapacity,
        setNewEmpleadoCapacity,
        newTicketTags,
        setNewTicketTags,
        isSellerEmpleado,
        setIsSellerEmpleado,
        deleteConfirmOpen,
        setDeleteConfirmOpen,
        itemToDelete,
        setItemToDelete,
        itemsPerPage,
        copyMessage,
      }}
    >
      {children}
    </EventDetailsContext.Provider>
  );
};

export default EventDetailsContext;
