// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventsDetail';
import CreateTicket from './pages/CreateTicket';
import ScanTicket from './pages/ScanTicket';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event-details/:id" element={<EventDetails />} />
        <Route path="/create-ticket/:id" element={<CreateTicket />} />
        <Route path="/scan-ticket/:id" element={<ScanTicket />} />
      </Routes>
    </Router>
  );
}

export default App;
