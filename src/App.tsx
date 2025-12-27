import { Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Auth/Login'
import LoginClient from './pages/Auth/LoginClient'
import ForgetPassword from './pages/Auth/ForgetPassword'
import ResetPassword from './pages/Auth/ResetPassword'
// import Registration from './pages/Auth/Registration'
import RegisterUser from './pages/Auth/RegisterUser'
import RegisterClient from './pages/Auth/RegisterClient'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminDashboard from './pages/Admin/dashboard'
import ManagerDashboard from './pages/PM/dashboard'
import Unauthorized from './pages/Auth/Unauth'
import Clients from './pages/Admin/clients'
import Employees from './pages/Admin/employeeList'
import ProjectManagers from './pages/Admin/projectManagerList'
import AllProjects from './pages/Admin/pojects'
import AdminLayout from './layouts/AdminLayout'
import PMLayout from './layouts/ProjectManagerLayout'
import Reports from './pages/PM/reports'
import TicketSupport from './pages/PM/TicketSupport'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/login-client" element={<LoginClient />} />
      <Route path="/auth/forget-password" element={<ForgetPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/register-user" element={<RegisterUser />} />
      <Route path="/auth/register-client" element={<RegisterClient />} />

      <Route path="/dashboard/admin"
        element={<ProtectedRoute allowedRoles={['ADMIN']} >
          <AdminLayout />
        </ProtectedRoute>} >
        <Route index element={<AdminDashboard />} />
        <Route path='pm' element={<ProjectManagers />} />
        <Route path='clients' element={<Clients />} />
        <Route path='projects' element={<AllProjects />} />
        <Route path='employees' element={<Employees />} />
      </Route>

      <Route path='/dashboard/manager'
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <PMLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path='reports' element={<Reports />} />
        <Route path='ticket-support' element={<TicketSupport />} />
      </Route>
    </Routes>
  )
}
