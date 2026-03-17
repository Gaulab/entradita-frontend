// entraditaFront/src/App.jsx

// React imports
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
// Notifications
import { Toaster } from 'sonner';
// Context imports
import { AuthProvider } from './context/AuthContext';
import { EventDetailsProvider } from './context/EventDetailsContext'; // Importa el contexto de EventDetails
// Utils imports
import PrivateRoute from './utils/PrivateRoute';
// Public pages
import Home from './pages/Main/Home';
import Login from './pages/Main/Login';
import Contact from './pages/Main/Contact';
import TermsAndConditions from './pages/Main/TermsAndConditions';
import TicketPage from './pages/TicketPage';
import TicketShare from './pages/TicketShare';
import SellerView from './pages/Employee/SellerView';
import ScannerView from './pages/Employee/ScannerView';
import CreateTicketBySeller from './pages/Employee/CreateTicektBySeller';
import Pricing from './pages/Main/Pricing';
import PrivacyPolicy from './pages/Main/PrivacyPolicy';
import EventPageGuide from './pages/EventPage/EventPageGuide';
import BuyPage from './pages/EventPage/BuyPage';
// Private pages
import Dashboard from './pages/User/Dashboard.jsx';
import EventDetail from './pages/EventDetail/EventDetail';
import CreateEvent from './pages/User/CreateEvent';
import EditEvent from './pages/User/EditEvent.jsx';
import EventPage from './pages/EventPage/EventPage';
import PurchaseForm from './pages/EventPage/PurchaseForm.jsx';
import Economy from './pages/User/Economy.jsx';
// Trial pages
import LinkGenerator from './pages/Trial/LinkGenerator';
// Guides pages
import SellerGuide from './pages/Employee/SellerGuide';
// Invite pages
import NewClient from './pages/Trial/NewClient';
import Documentacion from './pages/Trial/Documentacion';
import PaymentSuccess from './pages/EventPage/PaymentSuccess.jsx';
import PaymentFailure from './pages/EventPage/PaymentFailure.jsx';
import AdminPanel from './pages/Admin/AdminPanel.jsx';
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
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthProvider>
                <Login />
              </AuthProvider>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route path="/ticket/:ticket_uuid" element={<TicketPage />} />
          <Route path="/ticket-share/:uuid" element={<TicketShare />} />
          <Route path="/seller/:uuid" element={<SellerWrapper />} />
          <Route path="/scanner/:uuid" element={<ScannerWrapper />} />
          <Route path="/seller/:uuid/create-ticket" element={<CreateTicketBySeller />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/buy-page" element={<BuyPage />} />
          <Route path="/event-page-guide" element={<EventPageGuide />} />
          <Route path="/event-page/:id" element={<EventPage />} />
          <Route path="/event-page/:id/purchase" element={<PurchaseForm />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/seller-guide" element={<SellerGuide />} />
          <Route path="/new-client/*" element={<NewClient />} />
          <Route path="/link-generator" element={<LinkGenerator />} />
          <Route path="/documentacion" element={<Documentacion />} />

          {/* Rutas protegidas */}
          <Route
            path="/admin"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/event/:id/details"
            element={
              <AuthProvider>
                <EventDetailsProvider>
                  <PrivateRoute>
                    <EventDetail />
                  </PrivateRoute>
                </EventDetailsProvider>
              </AuthProvider>
            }
          />
          <Route
            path="/create-event"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <EditEvent />
                </PrivateRoute>
              </AuthProvider>
            }
          />
          <Route
            path="event/:id/economy"
            element={
              <AuthProvider>
                <PrivateRoute>
                  <Economy />
                </PrivateRoute>
              </AuthProvider>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
export default App;
