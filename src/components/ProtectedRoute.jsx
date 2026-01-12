import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/index';

const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem('currentUser');
  

  if (!currentUser || currentUser === 'undefined') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  try {
   
    JSON.parse(currentUser);
    return children;
  } catch (error) {
  
    localStorage.removeItem('currentUser');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

export default ProtectedRoute;