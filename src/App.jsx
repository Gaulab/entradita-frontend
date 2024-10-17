// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
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
        <Route path="/dashboard" element={<AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>} />
        <Route path="/create-event" element={<AuthProvider><PrivateRoute><CreateEvent /></PrivateRoute></AuthProvider>} />
        <Route path="/event-details/:id" element={<AuthProvider><PrivateRoute><EventDetails /></PrivateRoute></AuthProvider>} />
        <Route path="/create-ticket/:id" element={<AuthProvider><PrivateRoute><CreateTicket /></PrivateRoute></AuthProvider>} />
        <Route path="/scan-ticket/:id" element={<AuthProvider><PrivateRoute><ScanTicket /></PrivateRoute></AuthProvider>} />
      </Routes>
    </Router>
  );
}

export default App;
