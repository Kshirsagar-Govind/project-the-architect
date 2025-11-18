import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import Admin from '../pages/Dashboard/admin';
import Client from '../pages/Dashboard/client';
import Manager from '../pages/Dashboard/manager';
import Tester from '../pages/Dashboard/tester';

// Client Management
import ClientList from '../pages/Client/list.client';
import AddClient from '../pages/Client/add.client';
import EditClient from '../pages/Client/edit.client';
import ViewClient from '../pages/Client/view.client';

// User Management
import UserList from '../pages/User/list.user';
import AddUser from '../pages/User/add.user';
import EditUser from '../pages/User/edit.user';

// Project Management
import ProjectList from '../pages/Project/list.project';
import AddProject from '../pages/Project/add.project';
import EditProject from '../pages/Project/edit.project';
import ViewProject from '../pages/Project/view.project';
import AssignManager from '../pages/Project/assign-manager.project';

// Vulnerability Management
import VulnerabilityList from '../pages/Vulnerability/list.vulnerability';
import AddVulnerability from '../pages/Vulnerability/add.vulnerability';
import EditVulnerability from '../pages/Vulnerability/edit.vulnerability';
import UpdateStatus from '../pages/Vulnerability/update-status.vulnerability';
import UpdateSeverity from '../pages/Vulnerability/update-severity.vulnerability';

// Subscription Management
import ViewSubscription from '../pages/Subscription/view.subscription';
import AddSubscription from '../pages/Subscription/add.subscription';
import EditSubscription from '../pages/Subscription/edit.subscription';

const DashboardRoutes = () => {
    return (
        <Routes>
            {/* Dashboard Routes - Role-based */}
            <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />
            <Route path='/' element={<ProtectedRoute allowedRoles={['client']}><Client /></ProtectedRoute>} />
            <Route path='/manager' element={<ProtectedRoute allowedRoles={['manager']}><Manager /></ProtectedRoute>} />
            <Route path='/tester' element={<ProtectedRoute allowedRoles={['member']}><Tester /></ProtectedRoute>} />

            {/* Client Routes - Admin only */}
            <Route path='/clients' element={<ProtectedRoute allowedRoles={['admin']}><ClientList /></ProtectedRoute>} />
            <Route path='/clients/add' element={<ProtectedRoute allowedRoles={['admin']}><AddClient /></ProtectedRoute>} />
            <Route path='/clients/:id' element={<ProtectedRoute allowedRoles={['admin']}><ViewClient /></ProtectedRoute>} />
            <Route path='/clients/:id/edit' element={<ProtectedRoute allowedRoles={['admin']}><EditClient /></ProtectedRoute>} />
            <Route path='/clients/:clientId/subscription' element={<ProtectedRoute allowedRoles={['admin']}><ViewSubscription /></ProtectedRoute>} />
            <Route path='/clients/:clientId/subscription/add' element={<ProtectedRoute allowedRoles={['admin']}><AddSubscription /></ProtectedRoute>} />
            <Route path='/clients/:clientId/subscription/:subscriptionId/edit' element={<ProtectedRoute allowedRoles={['admin']}><EditSubscription /></ProtectedRoute>} />

            {/* User Routes - Admin only */}
            <Route path='/users' element={<ProtectedRoute allowedRoles={['admin']}><UserList /></ProtectedRoute>} />
            <Route path='/users/add' element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />
            <Route path='/users/:id/edit' element={<ProtectedRoute allowedRoles={['admin']}><EditUser /></ProtectedRoute>} />

            {/* Project Routes - Admin, Manager, Member */}
            <Route path='/projects' element={<ProtectedRoute allowedRoles={['admin', 'manager', 'member']}><ProjectList /></ProtectedRoute>} />
            <Route path='/projects/add' element={<ProtectedRoute allowedRoles={['admin']}><AddProject /></ProtectedRoute>} />
            <Route path='/projects/:id' element={<ProtectedRoute allowedRoles={['admin', 'manager', 'member']}><ViewProject /></ProtectedRoute>} />
            <Route path='/projects/:id/edit' element={<ProtectedRoute allowedRoles={['admin', 'manager']}><EditProject /></ProtectedRoute>} />
            <Route path='/projects/:id/assign-manager' element={<ProtectedRoute allowedRoles={['admin']}><AssignManager /></ProtectedRoute>} />
            <Route path='/projects/:projectId/vulnerabilities' element={<ProtectedRoute allowedRoles={['admin', 'manager', 'member']}><VulnerabilityList /></ProtectedRoute>} />
            <Route path='/projects/:projectId/vulnerabilities/add' element={<ProtectedRoute allowedRoles={['admin', 'manager', 'member']}><AddVulnerability /></ProtectedRoute>} />
            <Route path='/projects/:projectId/vulnerabilities/:id/edit' element={<ProtectedRoute allowedRoles={['admin', 'manager', 'member']}><EditVulnerability /></ProtectedRoute>} />
            <Route path='/projects/:projectId/vulnerabilities/:id/update-status' element={<ProtectedRoute allowedRoles={['admin', 'manager']}><UpdateStatus /></ProtectedRoute>} />
            <Route path='/projects/:projectId/vulnerabilities/:id/update-severity' element={<ProtectedRoute allowedRoles={['admin', 'manager']}><UpdateSeverity /></ProtectedRoute>} />
        </Routes>
    )
}

export default DashboardRoutes;
