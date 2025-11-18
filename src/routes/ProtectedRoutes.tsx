import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === "admin") {
          return <Navigate to="/dashboard/admin" replace />;
        } else if (user.role === "manager") {
          return <Navigate to="/dashboard/manager" replace />;
        } else if (user.role === "member") {
          return <Navigate to="/dashboard/tester" replace />;
        }
        return <Navigate to="/dashboard" replace />;
      }
    } catch (e) {
      // Invalid user data, redirect to login
      return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
}

