// entraditaFront/src/context/EventDetailsContext.jsx

// react imports
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
// react-router imports
import { useNavigate, useParams } from "react-router-dom";
// context imports
import AuthContext from "./AuthContext";
// API functions
import { getEventDetails, updateTicketSales } from "../api/eventApi";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, changeEmployeeStatus } from "../api/employeeApi";
import { loadMoreTicketsApi } from "../api/eventApi";

import { use } from "react";

const EventDetailsContext = createContext();

export const EventDetailsProvider = ({ children }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  // Loading status
  const [isLoading, setIsLoading] = useState(true);
  // Main status
  const [event, setEvent] = useState({});
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
  // Pagination and filtering states
  const [activeTab, setActiveTab] = useState("tickets");
  const [totalTickets, setTotalTickets] = useState();
  const [allTickets, setAllTickets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreTickets, setHasMoreTickets] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Fetch inicial de datos
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventDetails(id, authToken.access);
        setEvent(data.event);
        setSellers(data.sellers);
        setScanners(data.scanners);
        setTotalTickets(data.total_tickets);
        setTickets(data.tickets.sort((a, b) => b.id - a.id));
        setTicketSalesEnabled(data.event.ticket_sales_enabled);
        setAllTickets(data.tickets.sort((a, b) => b.id - a.id));
        setTicketTags(data.event.ticket_tags);
      } catch (error) {
        console.error("Error fetching event data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [id, authToken]);


  useEffect(() => {
    console.log("-----------------------------")
    console.log("Tickets:", tickets);
    console.log("All Tickets:", allTickets);
    console.log("currentPage:", currentPage);
    console.log("Has More Tickets:", hasMoreTickets);
    console.log("Total Tickets:", totalTickets);

  }, [tickets, allTickets, currentPage]);


  
  const loadTickets = useCallback(async (page = 1) => {
    try {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage ;
  
      // Si ya tenemos suficientes tickets, usa allTickets
      if (allTickets.length >= end) {
        setTickets(allTickets.slice(start, end));
      } else {
        // Carga desde el backend solo si hay más tickets
        if (!hasMoreTickets && page !== 1){
          setTickets([]);
          return;
        }
        const data = await loadMoreTicketsApi({
          eventId: id,
          page,
          limit: itemsPerPage,
          search: searchTerm,
          token: authToken.access,
        });
  
        setAllTickets((prev) => [...prev, ...data.results]);
        setTickets(data.results);
        setHasMoreTickets(data.has_more);
      }
    } catch (error) {
      console.error("Error loading tickets:", error.message);
    }
  }, [id, authToken, searchTerm, allTickets, itemsPerPage, hasMoreTickets]);


  useEffect(() => {
    if(currentPage > 1)
      loadTickets(currentPage);
    else
      setTickets(allTickets.slice(0, itemsPerPage));

    if (!hasMoreTickets) {
      setHasMoreTickets(true);
    }
  }, [currentPage]);


  useEffect(() => {
    const fetchFilteredTickets = async () => {
      if (searchTerm.trim() === "" && currentPage <= 1) {
        setTickets(allTickets.slice(0, itemsPerPage));
        setCurrentPage(1);
        setHasMoreTickets(totalTickets > itemsPerPage);
        return;
      }

      if (searchTerm.trim() !== "") {
        try {
          const data = await loadMoreTicketsApi({
            eventId: id,
            page: 1,
            limit: totalTickets,
            search: searchTerm,
            token: authToken.access,
          });

          setTickets(data.results);
          setCurrentPage(1);
          setHasMoreTickets(false);
        } catch (error) {
          console.error("Error fetching filtered tickets:", error.message);
        }
      }
    };

    fetchFilteredTickets();
  }, [searchTerm, totalTickets, id, authToken, allTickets, itemsPerPage]);

  
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
  }, [reloadEmployees, id, authToken]);

  useEffect(() => {
    const fetchTickets = async () => {
      const data = await getEventDetails(id, authToken.access);
      setTickets(data.tickets.sort((a, b) => b.id - a.id));
    }
    fetchTickets().catch(error => {
      console.error("Error fetching tickets:", error.message);
    }
    );
  }, [reloadTickets, id, authToken]);

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
        // Loading status
        isLoading,
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
        // interfaces
        // loadMoreTickets,
        hasMoreTickets,

        // filteredTickets,
        // paginatedTickets,
        // pageCount,
        itemsPerPage,
        isChecked, setIsChecked,
        activeTab, setActiveTab,
        currentPage, setCurrentPage,
        searchTerm, setSearchTerm,
        itemToDelete, setItemToDelete,
      }}
    >
      {children}
    </EventDetailsContext.Provider>
  );
};

export default EventDetailsContext;
