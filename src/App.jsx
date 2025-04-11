// entraditaFront/src/App.jsx

// React imports
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// Context imports
import { AuthProvider } from './context/AuthContext';
import { EventDetailsProvider } from './context/EventDetailsContext';  // Importa el contexto de EventDetails
import { PurchaseProvider } from './context/PurchaseContext'; // Importa el contexto de Purchase
import { HelmetProvider, Helmet } from "react-helmet-async";
// Utils imports
import PrivateRoute from './utils/PrivateRoute';
// Public pages
import Home from './pages/Main/Home';
import Login from './pages/Login';
import Contact from './pages/Main/Contact';
import TermsAndConditions from './pages/Main/TermsAndConditions';
import TicketPage from './pages/TicketPage';
import TicketShare from './pages/TicketShare';
import SellerView from './pages/Employee/SellerView';
import ScannerView from './pages/Employee/ScannerView';
import CreateTicketBySeller from './pages/Employee/CreateTicektBySeller';
import Pricing from './pages/Main/Pricing';
import PrivacyPolicy from './pages/Main/PrivacyPolicy';
import TicketPurchasePage from './pages/EventPage/TicketPurchasePage';
import EventPageGuide from './pages/EventPage/EventPageGuide';
import BuyPage from './pages/EventPage/BuyPage';
// Private pages
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventPage from './pages/EventPage/EventPage';
import Economy from './pages/Economy';
import TicketPurchaseConfig from './pages/EventPage/TicketPurchaseConfig';
import PurchaseSummaryPage from './pages/EventPage/PurchaseSummaryPage';
// Trial pages
import DashboardTrial from './pages/Trial/DashboardTrial';
import ScannerPageTrial from './pages/Trial/ScannerPageTrial';
import TicketPageTrial from './pages/Trial/TicketPageTrial';
import LinkGenerator from './pages/Trial/LinkGenerator';
// Guides pages
import SellerGuide from './pages/Employee/SellerGuide';
// Invite pages
import Zoe from './pages/TarjetasInvitación/Zoe';
import Zoe2 from './pages/TarjetasInvitación/Zoe15';
import NewClient from './pages/Trial/NewClient';
import Documentacion from './pages/Trial/Documentacion';
// SellerWrapper is a functional component that extracts the UUID from the URL using the useParams hook and passes it as a prop to the VendorView component.
const SellerWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <SellerView uuid={uuid} />; // Pasa el UUID al componente VendorView
};
// ScannerWrapper is a functional component that extracts the UUID from the URL using the useParams hook and passes it as a prop to the ScannerView component.
const ScannerWrapper = () => {
  const { uuid } = useParams(); // Obtén el UUID de la URL
  return <ScannerView uuid={uuid} />; // Pasa el UUID al componente VendorView
};
function App() {
  return (

    <Router>
      <Routes> 
        {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
          <Route path="/ticket/:ticket_uuid" element={<TicketPage />} />
          <Route path="/ticket-share/:uuid" element={<TicketShare />} />
          <Route path="/seller/:uuid" element={<SellerWrapper />} />
          <Route path="/scanner/:uuid" element={<ScannerWrapper />} />
          <Route path="/seller/:uuid/create-ticket" element={<CreateTicketBySeller />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard-trial" element={<DashboardTrial />} />
          <Route path="/ticket-page-trial" element={<TicketPageTrial />} />
          <Route path="/scanner-page-trial" element={<ScannerPageTrial />} />
          <Route path="/buy-page" element={<BuyPage />} />
          <Route path="/ticket-purchase/:event_id" element={<PurchaseProvider><TicketPurchasePage /></PurchaseProvider>} />
          <Route path="/purchase-summary" element={<PurchaseProvider><PurchaseSummaryPage /></PurchaseProvider>} />
          <Route path="/event-page-guide" element={<EventPageGuide />} />
          <Route path="/event-page/:id" element={<EventPage />} />
          <Route path="/seller-guide" element={<SellerGuide />} />
          <Route path="/zoe" element={<Zoe />} />
        <Route path="/zoe15" element={<Zoe2 />} />
        <Route path="/new-client/*" element={<NewClient />} />
        <Route path="/documentacion" element={<Documentacion />} />
        <Route path="/link-generator" element={<LinkGenerator />} />
          
        {/* Rutas protegidas */}
          <Route path="/event/:event_id/purchase-config" element={<AuthProvider><PrivateRoute><TicketPurchaseConfig /></PrivateRoute></AuthProvider>} />
          <Route path="/dashboard" element={<AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>} />
          <Route path="/event/:id/details" element={<AuthProvider><EventDetailsProvider><PrivateRoute><EventDetail /></PrivateRoute></EventDetailsProvider></AuthProvider>} />
          <Route path="/create-event" element={<AuthProvider><PrivateRoute><CreateEvent /></PrivateRoute></AuthProvider>} />
          <Route path="/edit-event/:id" element={<AuthProvider><PrivateRoute><EditEvent /></PrivateRoute></AuthProvider>} />
          <Route path="event/:id/economy" element={<AuthProvider><PrivateRoute><Economy /></PrivateRoute></AuthProvider>} />
        </Routes>
      </Router>
  );
  
}
export default App;

