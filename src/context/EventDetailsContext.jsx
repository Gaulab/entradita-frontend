// entraditaFront/src/context/EventDetailsContext.jsx

// react imports
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
// react-router imports
import { useNavigate, useParams } from "react-router-dom";
// context imports
import AuthContext from "./AuthContext";
// API functions
import { getEventDetails, updateTicketSales } from "../api/eventApi";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, changeEmployeeStatus} from "../api/employeeApi";

const EventDetailsContext = createContext();

export const EventDetailsProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  // Main status
  const [event, setEvent] = useState({});
  const [tickets, setTickets] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [scanners, setScanners] = useState([]);
  const [ticketTags, setTicketTags] = useState([]);
  const [ticketSalesEnabled, setTicketSalesEnabled] = useState(false);
  // Dialogs 
  const [isCreateEmployeeDialogOpen, setIsCreateEmployeeDialogOpen] = useState(false);
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  // Reloads
  const [reloadEmployees, setReloadEmployees] = useState(false);
  const [reloadTickets, setReloadTickets] = useState(false);
  // function to copy text to clipboard
  const [copyMessage, setCopyMessage] = useState("");
  // Employee
  const [isSellerEmployee, setIsSellerEmployee] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeCapacity, setNewEmployeeCapacity] = useState("");
  const [newEmployeeTicketTags, setNewEmployeeTicketTags] = useState([]);

  const [activeTab, setActiveTab] = useState("tickets");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(filteredTickets.length / itemsPerPage);
  const filteredTickets = tickets.filter((ticket) => ticket.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.owner_dni?.includes(searchTerm));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isChecked, setIsChecked] = useState(false);

  // Fetch inicial de datos
  useEffect(() => {
    const fetchEventData = async () => {
      const data = await getEventDetails(id, authToken.access);
      console.log("Event data:", data);
      setEvent(data.event);
      setTicketSalesEnabled(data.event.ticket_sales_enabled);
      setTickets(data.tickets.sort((a, b) => b.id - a.id));
      setSellers(data.sellers);
      setScanners(data.scanners);
      setTicketTags(data.event.ticket_tags);
    };
    fetchEventData().catch(error => {
      console.error("Error fetching event data:", error.message);
    });
  }, [id]);


  useEffect(() => {
    const getEventEmployees = async () => {
      const data = await getEmployees(id, authToken.access);
      setSellers(data.sellers);
      setScanners(data.scanners);
    };
    getEventEmployees().catch(error => {
      console.error("Error fetching empleados data:", error.message);
      alert(error.message);
    });
  }, [reloadEmployees]);

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getEventDetails(id, authToken.access);
      setTickets(data.tickets.sort((a, b) => b.id - a.id));
    }
    fetchTickets().catch(error => {
      console.error("Error fetching tickets:", error.message);
    }
    );
  }, [reloadTickets]);

  // function to copy text to clipboard
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

  return (
    <EventDetailsContext.Provider
      value={{
        // main states
        event, setEvent,
        tickets, setTickets,
        sellers, setSellers,
        scanners, setScanners,
        ticketTags, setTicketTags,
        ticketSalesEnabled, setTicketSalesEnabled,
        // Dialogs
        isCreateEmployeeDialogOpen, setIsCreateEmployeeDialogOpen,
        isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen,
        isCreateTicketDialogOpen, setIsCreateTicketDialogOpen,
        isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen,
        // Reloads
        reloadTickets, setReloadTickets,
        reloadEmployees, setReloadEmployees,
        // functions
        copyToClipboard,
        copyMessage, setCopyMessage,
        // seller/employee        
        isSellerEmployee, setIsSellerEmployee,
        editingEmployee, setEditingEmployee,
        newEmployeeName, setNewEmployeeName,
        newEmployeeCapacity, setNewEmployeeCapacity,
        newEmployeeTicketTags, setNewEmployeeTicketTags,
        
        filteredTickets,
        paginatedTickets,
        pageCount,
        isChecked,
        setIsChecked,
        

        activeTab,
        setActiveTab,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        itemToDelete, setItemToDelete,
        itemsPerPage,
      }}
    >
      {children}
    </EventDetailsContext.Provider>
  );
};

export default EventDetailsContext;
