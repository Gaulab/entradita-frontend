import { Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from 'prop-types';
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({children}) => {
    const { user } = useContext(AuthContext)
    return user ? children : <Navigate to='/login'/>
}
PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute