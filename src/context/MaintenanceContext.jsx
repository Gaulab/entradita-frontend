import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { MAINTENANCE_EVENT } from '../utils/apiUtils';

const MaintenanceContext = createContext({ isMaintenance: false });

export const useMaintenance = () => useContext(MaintenanceContext);

export const MaintenanceProvider = ({ children }) => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  const hasBypass = Boolean(localStorage.getItem('maintenance_token'));

  useEffect(() => {
    if (hasBypass) return;

    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/api/health/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.maintenance) setIsMaintenance(true);
      })
      .catch(() => {});
  }, [hasBypass]);

  // Always listen for 503 maintenance responses, even with a bypass token.
  // If the token is invalid, nginx still returns 503 and we need to catch it.
  useEffect(() => {
    const handler = () => setIsMaintenance(true);
    window.addEventListener(MAINTENANCE_EVENT, handler);
    return () => window.removeEventListener(MAINTENANCE_EVENT, handler);
  }, []);

  return (
    <MaintenanceContext.Provider value={{ isMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

MaintenanceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MaintenanceContext;
