# The Architect - Project Documentation

## Table of Contents
1. [Project Summary](#project-summary)
2. [Features](#features)
3. [Use Cases](#use-cases)
4. [Technology Stack](#technology-stack)
5. [Architecture Overview](#architecture-overview)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Role-Based Access Control](#role-based-access-control)
9. [API Integration](#api-integration)
10. [Key Components](#key-components)

---

## Project Summary

**The Architect** is a comprehensive security vulnerability management platform designed to help organizations manage security assessments, track vulnerabilities, and coordinate security testing projects. The platform provides a centralized system for managing clients, projects, team members, and security vulnerabilities with role-based access control.

### Core Purpose
The platform enables security teams to:
- Manage multiple client projects and their security assessments
- Track and manage security vulnerabilities throughout their lifecycle
- Coordinate team members (admins, managers, testers) across projects
- Monitor project progress and vulnerability status
- Manage client subscriptions and billing

---

## Features

### 1. **Authentication & Authorization**
- **User Authentication**: Login/Logout functionality for all user types
- **Client Authentication**: Separate login portal for clients
- **Password Management**: Forgot password and reset password functionality
- **Registration**: Separate registration flows for users and clients
- **Role-Based Access Control**: Four distinct user roles with different permissions

### 2. **Dashboard System**
- **Role-Specific Dashboards**: Customized dashboards for each user role
  - Admin Dashboard: Overview of all projects, clients, users, and system metrics
  - Manager Dashboard: Projects assigned to the manager with team overview
  - Tester/Member Dashboard: Assigned projects and personal task overview
  - Client Dashboard: Client's own projects and vulnerability status

### 3. **Client Management** (Admin Only)
- **Client CRUD Operations**: Create, read, update, and delete clients
- **Client Details View**: Comprehensive client information and project history
- **Client Subscription Management**: 
  - View client subscriptions
  - Add new subscriptions
  - Edit existing subscriptions
  - Track subscription status and billing

### 4. **User Management** (Admin Only)
- **User CRUD Operations**: Create, read, update, and delete users
- **Role Assignment**: Assign roles (admin, manager, member) to users
- **User Profile Management**: Manage user details and permissions

### 5. **Project Management**
- **Project CRUD Operations**: Full lifecycle management of security projects
- **Project Types**: Support for different project types (web, mobile, product)
- **Project Assignment**: 
  - Assign managers to projects
  - Assign team members to projects
- **Project Views**:
  - Project Overview: High-level project information
  - Project Tasks: Task management within projects
  - Project Members: Team member management
  - Project Vulnerabilities: Security findings associated with the project

### 6. **Vulnerability Management**
- **Vulnerability Tracking**: Comprehensive vulnerability lifecycle management
- **Vulnerability CRUD**: Create, read, update, and delete vulnerabilities
- **Vulnerability Attributes**:
  - Title and description
  - Vulnerability type classification
  - Severity levels: Low, Medium, High, Critical
  - Status tracking: Open, In-Progress, Resolved, Closed
  - Steps to reproduce
- **Status Updates**: Update vulnerability status (Admin & Manager)
- **Severity Updates**: Modify vulnerability severity (Admin & Manager)
- **Project Association**: Link vulnerabilities to specific projects

### 7. **Settings & Preferences**
- **User Profile Settings**: Update personal information
- **Preferences**: Customize application preferences
- **Account Management**: Manage account settings

### 8. **Navigation & UI**
- **Responsive Design**: Modern, responsive UI built with Tailwind CSS
- **Role-Based Navigation**: Dynamic navigation menus based on user role
- **Left Sidebar Navigation**: Persistent navigation with role-specific menu items
- **Visual Indicators**: Color-coded badges for roles, project types, and vulnerability severity

---

## Use Cases

### Use Case 1: Security Consulting Company
**Scenario**: A security consulting company needs to manage multiple client security assessments.

**How The Architect Helps**:
- Admins can onboard new clients and create projects for each security assessment
- Managers are assigned to projects and coordinate testing teams
- Testers report vulnerabilities through the platform
- Clients can log in to view their project status and vulnerabilities
- Subscription management tracks billing for each client

### Use Case 2: In-House Security Team
**Scenario**: A large organization's internal security team manages security testing for various products.

**How The Architect Helps**:
- Admin creates projects for different products (web apps, mobile apps, etc.)
- Security managers oversee multiple projects simultaneously
- Security testers document vulnerabilities found during assessments
- Vulnerability status tracking ensures all issues are addressed
- Project overview provides visibility into security posture

### Use Case 3: Bug Bounty Program Management
**Scenario**: An organization runs a bug bounty program and needs to track reported vulnerabilities.

**How The Architect Helps**:
- External researchers (members/testers) can report vulnerabilities
- Managers review and validate reported vulnerabilities
- Severity classification helps prioritize fixes
- Status tracking shows vulnerability resolution progress
- Clients can monitor their security improvement over time

### Use Case 4: Compliance & Audit Tracking
**Scenario**: An organization needs to demonstrate security testing activities for compliance audits.

**How The Architect Helps**:
- Complete audit trail of all security assessments
- Vulnerability history with status changes
- Project documentation and team assignments
- Reports can be generated for compliance documentation
- Client subscription records for billing and contract management

### Use Case 5: Multi-Tenant Security Platform
**Scenario**: A security service provider offers vulnerability management as a service to multiple clients.

**How The Architect Helps**:
- Each client has isolated access to their projects
- Admins manage all clients and users from a central dashboard
- Subscription management tracks service plans per client
- Role-based access ensures data isolation and proper permissions
- Scalable architecture supports multiple concurrent clients

---

## Technology Stack

### Frontend Framework
- **React 19.2.0**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Vite 7.2.2**: Fast build tool and development server

### Routing & Navigation
- **React Router DOM 7.9.5**: Client-side routing with protected routes

### Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **PostCSS**: CSS processing
- **Autoprefixer**: Automatic vendor prefixing

### HTTP Client
- **Axios 1.13.2**: Promise-based HTTP client for API calls
- **Interceptors**: Automatic token injection for authenticated requests

### Icons & UI Components
- **Lucide React 0.554.0**: Modern icon library

### Development Tools
- **ESLint**: Code linting and quality checks
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **React Compiler**: Optimized React rendering

### Environment Management
- **Cross-env**: Cross-platform environment variable management
- **Environment Variables**: Separate configs for development and production

---

## Architecture Overview

### Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │  Contexts    │  │  Components  │  │
│  │              │  │              │  │              │  │
│  │ - AuthRoutes │  │ - Auth       │  │ - Navigation │  │
│  │ - Dashboard  │  │ - Navigation │  │ - Forms      │  │
│  │ - Protected  │  │              │  │ - Common     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Pages (Feature Modules)                 │ │
│  │  - Auth  - Dashboard  - Projects  - Vulnerabilities│ │
│  │  - Client - User  - Subscription  - Settings        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              API Layer (Axios)                       │ │
│  │  - Base URL Configuration                           │ │
│  │  - Request Interceptors (Token Injection)           │ │
│  │  - Response Handling                                │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (RESTful)                       │
│         http://localhost:8080/api (Dev)                  │
│         http://api.gkdev.online/api (Prod)               │
└─────────────────────────────────────────────────────────┘
```

### Routing Architecture

```
/ (Root)
├── /auth/* (Public Routes)
│   ├── /login
│   ├── /login/client
│   ├── /register
│   ├── /register-client
│   ├── /register-user
│   ├── /forget-password
│   └── /reset-password
│
└── /dashboard/* (Protected Routes)
    ├── /admin (Admin Dashboard)
    ├── /manager (Manager Dashboard)
    ├── /tester (Tester Dashboard)
    ├── / (Client Dashboard)
    │
    ├── /clients/* (Admin Only)
    │   ├── /clients (List)
    │   ├── /clients/add
    │   ├── /clients/:id
    │   ├── /clients/:id/edit
    │   └── /clients/:clientId/subscription/*
    │
    ├── /users/* (Admin Only)
    │   ├── /users (List)
    │   ├── /users/add
    │   └── /users/:id/edit
    │
    ├── /projects/* (Admin, Manager, Member)
    │   ├── /projects (List)
    │   ├── /projects/add (Admin Only)
    │   ├── /projects/:id
    │   ├── /projects/:id/edit (Admin, Manager)
    │   ├── /projects/:id/assign-manager (Admin Only)
    │   └── /projects/:projectId/vulnerabilities/*
    │
    └── /settings/*
        ├── /profile
        └── /preferences
```

---

## Project Structure

```
project-the-architect/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration
│   │   └── axios.ts       # Axios instance with interceptors
│   │
│   ├── assets/            # Images, icons, etc.
│   │   ├── icons/
│   │   └── images/
│   │
│   ├── components/         # Reusable components
│   │   ├── common/        # Common/shared components
│   │   ├── dashboard/     # Dashboard-specific components
│   │   ├── forms/         # Form components
│   │   ├── navigations/   # Navigation components
│   │   │   ├── leftNav.tsx
│   │   │   └── topNav.tsx
│   │   └── projects/      # Project-related components
│   │
│   ├── contexts/           # React Context providers
│   │   ├── authContext.tsx
│   │   └── navigation/
│   │       ├── navigationContext.tsx
│   │       └── navigationProvider.tsx
│   │
│   ├── layouts/            # Layout components
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Auth/           # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   ├── LoginClient.tsx
│   │   │   ├── Registration.tsx
│   │   │   ├── RegisterClient.tsx
│   │   │   ├── RegisterUser.tsx
│   │   │   ├── ForgetPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   │
│   │   ├── Dashboard/      # Dashboard pages
│   │   │   ├── admin/
│   │   │   ├── client/
│   │   │   ├── manager/
│   │   │   └── tester/
│   │   │
│   │   ├── Client/         # Client management
│   │   │   ├── list.client.tsx
│   │   │   ├── add.client.tsx
│   │   │   ├── edit.client.tsx
│   │   │   └── view.client.tsx
│   │   │
│   │   ├── User/           # User management
│   │   │   ├── list.user.tsx
│   │   │   ├── add.user.tsx
│   │   │   └── edit.user.tsx
│   │   │
│   │   ├── Project/        # Project management
│   │   │   ├── list.project.tsx
│   │   │   ├── add.project.tsx
│   │   │   ├── edit.project.tsx
│   │   │   ├── view.project.tsx
│   │   │   ├── assign-manager.project.tsx
│   │   │   ├── members.project.tsx
│   │   │   ├── overview.project.tsx
│   │   │   └── tasks.project.tsx
│   │   │
│   │   ├── Vulnerability/  # Vulnerability management
│   │   │   ├── list.vulnerability.tsx
│   │   │   ├── add.vulnerability.tsx
│   │   │   ├── edit.vulnerability.tsx
│   │   │   ├── update-status.vulnerability.tsx
│   │   │   └── update-severity.vulnerability.tsx
│   │   │
│   │   ├── Subscription/   # Subscription management
│   │   │   ├── view.subscription.tsx
│   │   │   ├── add.subscription.tsx
│   │   │   └── edit.subscription.tsx
│   │   │
│   │   └── setting/        # Settings pages
│   │       ├── profile.setting.tsx
│   │       └── preferences.setting.tsx
│   │
│   ├── routes/             # Route configuration
│   │   ├── index.tsx       # Main router
│   │   ├── AuthRoutes.tsx  # Authentication routes
│   │   ├── DashboardRoutes.tsx  # Dashboard routes
│   │   ├── ProtectedRoutes.tsx  # Route protection logic
│   │   └── RoleRoutes.tsx  # Role-based routing
│   │
│   ├── theme/              # Theme configuration
│   │   └── index.ts
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
│
├── dist/                   # Build output
├── node_modules/           # Dependencies
├── .env.development        # Development environment variables
├── .env.production         # Production environment variables
├── eslint.config.js        # ESLint configuration
├── jest.config.js          # Jest configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Project readme
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend API server running (default: http://localhost:8080/api)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-the-architect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.development` file:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
   
   Create `.env.production` file:
   ```env
   VITE_API_URL=http://api.gkdev.online/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173` (default Vite port)

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server (uses development API URL)
- `npm run prod` - Start development server (uses production API URL)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

---

## Role-Based Access Control

The platform implements a comprehensive role-based access control (RBAC) system with four distinct roles:

### 1. **Admin**
**Permissions:**
- Full system access
- Manage all clients (CRUD)
- Manage all users (CRUD)
- Create and manage all projects
- Assign managers to projects
- Update vulnerability status and severity
- Manage client subscriptions
- View all dashboards and reports

**Dashboard Access:**
- `/dashboard/admin`

**Menu Items:**
- Dashboard
- Projects
- Clients
- Users
- Reports
- Settings

### 2. **Manager**
**Permissions:**
- View assigned projects
- Edit assigned projects
- View and manage vulnerabilities in assigned projects
- Update vulnerability status and severity
- View team members
- Cannot create projects
- Cannot manage clients or users

**Dashboard Access:**
- `/dashboard/manager`

**Menu Items:**
- Dashboard
- My Projects
- Reports
- Settings

### 3. **Member/Tester**
**Permissions:**
- View assigned projects
- View and create vulnerabilities
- Edit own vulnerabilities
- Cannot update vulnerability status or severity
- Cannot edit projects
- Cannot manage clients or users

**Dashboard Access:**
- `/dashboard/tester`

**Menu Items:**
- Dashboard
- My Projects
- My Reports
- Settings

### 4. **Client**
**Permissions:**
- View own projects only
- View vulnerabilities in own projects
- Cannot create or edit projects
- Cannot manage vulnerabilities
- View subscription information

**Dashboard Access:**
- `/dashboard`

**Menu Items:**
- Dashboard
- My Projects
- Reports
- Settings

### Route Protection

Routes are protected using the `ProtectedRoute` component which:
- Checks for authentication token
- Validates user role against `allowedRoles` prop
- Redirects unauthorized users to appropriate dashboard
- Redirects unauthenticated users to login

**Example:**
```tsx
<Route 
  path='/projects' 
  element={
    <ProtectedRoute allowedRoles={['admin', 'manager', 'member']}>
      <ProjectList />
    </ProtectedRoute>
  } 
/>
```

---

## API Integration

### API Configuration

The application uses Axios for HTTP requests with the following configuration:

**Base URL:**
- Development: `http://localhost:8080/api`
- Production: `http://api.gkdev.online/api`

**Authentication:**
- Token-based authentication using Bearer tokens
- Token stored in `localStorage` as `"token"`
- Automatic token injection via Axios request interceptor

**API Instance** (`src/api/axios.ts`):
```typescript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor for token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### API Endpoints Used

Based on the codebase, the following endpoints are expected:

**Authentication:**
- `POST /auth/login` - User login
- `POST /auth/login/client` - Client login
- `POST /auth/register` - User registration
- `POST /auth/register/client` - Client registration
- `POST /auth/forget-password` - Request password reset
- `POST /auth/reset-password` - Reset password

**Projects:**
- `GET /project` - Get all projects
- `GET /project/:id` - Get project details
- `POST /project` - Create project
- `PUT /project/:id` - Update project
- `DELETE /project/:id` - Delete project

**Vulnerabilities:**
- `GET /vulnerability/:projectId` - Get vulnerabilities for a project
- `GET /vulnerability/:id` - Get vulnerability details
- `POST /vulnerability` - Create vulnerability
- `PUT /vulnerability/:id` - Update vulnerability
- `DELETE /vulnerability/:id` - Delete vulnerability

**Clients:**
- `GET /client` - Get all clients
- `GET /client/:id` - Get client details
- `POST /client` - Create client
- `PUT /client/:id` - Update client
- `DELETE /client/:id` - Delete client

**Users:**
- `GET /user` - Get all users
- `GET /user/:id` - Get user details
- `POST /user` - Create user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

**Subscriptions:**
- `GET /subscription/:clientId` - Get client subscriptions
- `POST /subscription` - Create subscription
- `PUT /subscription/:id` - Update subscription

---

## Key Components

### 1. **Navigation Components**

#### LeftNav (`src/components/navigations/leftNav.tsx`)
- Persistent sidebar navigation
- Role-based menu rendering
- Active route highlighting
- Logout functionality
- Role badge display

#### TopNav (`src/components/navigations/topNav.tsx`)
- Top navigation bar (if implemented)
- User profile access
- Quick actions

### 2. **Route Components**

#### ProtectedRoute (`src/routes/ProtectedRoutes.tsx`)
- Authentication guard
- Role-based access control
- Automatic redirects based on user role

#### AuthRoutes (`src/routes/AuthRoutes.tsx`)
- Public authentication routes
- Login, registration, password reset flows

#### DashboardRoutes (`src/routes/DashboardRoutes.tsx`)
- Protected dashboard routes
- Role-based route access
- Feature module routing

### 3. **Context Providers**

#### NavigationProvider (`src/contexts/navigation/navigationProvider.tsx`)
- Global navigation state management
- Navigation context for components

#### AuthContext (`src/contexts/authContext.tsx`)
- User authentication state
- User information management

### 4. **Page Components**

All page components follow a consistent structure:
- Data fetching with `useState` and `useEffect`
- API integration via Axios instance
- Loading and error states
- CRUD operations
- Form handling
- Navigation integration

---

## Security Considerations

### Authentication
- JWT token-based authentication
- Tokens stored in `localStorage`
- Automatic token injection in API requests
- Token validation on protected routes

### Authorization
- Role-based access control at route level
- Component-level permission checks
- API-level authorization (handled by backend)

### Data Protection
- HTTPS recommended for production
- Credentials sent with requests (`withCredentials: true`)
- Secure token storage

---

## Future Enhancements

Potential features for future development:

1. **Reporting & Analytics**
   - Vulnerability trend analysis
   - Project progress reports
   - Client activity reports
   - Export functionality (PDF, CSV)

2. **Notifications**
   - Real-time notifications for vulnerability updates
   - Email notifications
   - In-app notification system

3. **File Management**
   - Upload/download project files
   - Vulnerability proof-of-concept attachments
   - Screenshot management

4. **Advanced Features**
   - Vulnerability templates
   - Automated severity calculation
   - Integration with security tools
   - API documentation viewer
   - Activity logs and audit trails

5. **UI/UX Improvements**
   - Dark mode support
   - Advanced filtering and search
   - Bulk operations
   - Drag-and-drop interfaces
   - Real-time collaboration features

---

## Contributing

This is a private project. For contributions, please follow:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## License

[Specify license if applicable]

---

## Support

For issues, questions, or support:
- Check the project repository
- Contact the development team
- Review API documentation

---

**Last Updated**: 2024
**Version**: 0.0.0
**Project Name**: The Architect - Security Platform

