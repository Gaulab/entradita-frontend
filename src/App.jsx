// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Bienvenido a la aplicación Ticket QR</h1>} />
        <Route path="/login" element={<AuthProvider><Login /></AuthProvider>} />
      </Routes>
    </Router>
  );
}

export default App;
