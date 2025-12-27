import {Navigate} from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}


function ProtectedRoute({children, allowedRoles}:ProtectedRouteProps){
    if(!isLoggedIn()){
        return <Navigate to={'/auth/login'} replace/>
    }

    if(allowedRoles && !allowedRoles.includes(getUserRole())){
        return <Navigate to={'/unauthorised'} replace/>
    }

    return children;
}

export default ProtectedRoute;
