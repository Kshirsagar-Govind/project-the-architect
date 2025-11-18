import {Route, Routes, Navigate} from 'react-router-dom';
import DashboardRoutes from './DashboardRoutes';
import AuthRoutes from './AuthRoutes';

export default function RoutesMain(){
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // Determine redirect path based on user role
    const getDashboardPath = () => {
        if (!token) return "/auth/login";
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === "admin") return "/dashboard/admin";
                if (user.role === "manager") return "/dashboard/manager";
                if (user.role === "member") return "/dashboard/tester";
            } catch (e) {
                // Invalid user data
            }
        }
        
        return token ? "/dashboard" : "/auth/login";
    };

    return(
        <Routes>
            <Route path='/' element={<Navigate to={getDashboardPath()} replace />} />
            <Route path='/auth/*' element={<AuthRoutes/>} />
            <Route path='/dashboard/*' element={<DashboardRoutes/>} />
        </Routes>
    )
}
