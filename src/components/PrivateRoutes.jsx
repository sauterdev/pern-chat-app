import { useContext } from 'react';
import { AccountContext } from './AccountContext';

const { Outlet, Navigate } = require('react-router-dom');

//creates private route so users cant access home page without logging in
const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  //if authenticated, direct to outlet. If not, return to home page
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
