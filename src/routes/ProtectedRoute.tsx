import {Navigate} from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}


function ProtectedRoute({children, allowedRoles}:ProtectedRouteProps){
    const role=getUserRole();
    const logged = isLoggedIn()
    console.log({role, logged});
    
    if(!logged){
        if(role=='CLIENT')  return <Navigate to={'/auth/login-client'} replace/>
        return <Navigate to={'/auth/login'} replace/>
    }

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to={'/unauthorised'} replace/>
    }

    return children;
}

export default ProtectedRoute;
