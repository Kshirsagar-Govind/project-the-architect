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
import EmployeeLayout from './layouts/EmployeeLayout';
import Reports from './pages/PM/reports'
import TesterReports from './pages/Tester/reports'
import TicketSupport from './pages/PM/TicketSupport'
import Dashboard from './pages/Tester/dashbaord'
import ReportForm from './pages/Tester/reportForm'
import Overview from './pages/Tester/overview'
import ClientLayout from './layouts/ClientLayout'
import ClientDashboard from './pages/Client/dashboard'
import ClientOverview from './pages/Client/overview'
import ClientProjectReports from './pages/Client/reports'
import ClientTicketSupport from './pages/Client/ticketSupport'
import Layout from './layouts';
import AddProject from './pages/Client/addProject'
import CommonReports from './pages/common/reports';
import CommonDashboard from './pages/common/dashboard';
export default function App() {
  return (
    <Routes>
      <Route path='/'
        element={
          <ProtectedRoute allowedRoles={['CLIENT', "MANAGER", "TESTER", "ADMIN"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CommonDashboard />} />
        <Route path='/reports/:p_id' element={<CommonReports />} />
        <Route path='overview/:p_id' element={<ClientOverview />} />
        <Route path='ticket-support/:p_id' element={<TicketSupport />} />
        <Route path='credit-system' element={<TicketSupport />} />
        <Route path='add-project' element={<AddProject />} />
        <Route path='submit-report/:p_id' element={<ReportForm />} />

      </Route>
      <Route path='/'
        element={
          <ProtectedRoute allowedRoles={['CLIENT']}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
      </Route>
      {/* <Route path="/" element={<Navigate to="/auth/login" replace />} /> */}
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

      <Route path='/manager'
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']}>
            <PMLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path='overview/:p_id' element={<Overview />} />
        <Route path='reports/:p_id' element={<Reports />} />
        <Route path='ticket-support/:p_id' element={<TicketSupport />} />
      </Route>

      <Route path='/tester'
        element={
          <ProtectedRoute allowedRoles={['MANAGER', 'TESTER']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>


    </Routes>


  )
}
