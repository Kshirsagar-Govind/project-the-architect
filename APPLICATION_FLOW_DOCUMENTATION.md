# The Architect - Application Flow Documentation

## Overview
The Architect is a comprehensive security vulnerability management platform designed for managing clients, projects, vulnerabilities, and subscriptions. The application follows a role-based access control (RBAC) system with four distinct roles: Admin, Manager, Member (Tester), and Client.

---

## Table of Contents
1. [Role-Based Access Control](#role-based-access-control)
2. [Authentication Flow](#authentication-flow)
3. [Admin Flow](#admin-flow)
4. [Manager Flow](#manager-flow)
5. [Member (Tester) Flow](#member-tester-flow)
6. [Client Flow](#client-flow)
7. [Combined Workflow](#combined-workflow)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Frontend Routes](#frontend-routes)

---

## Role-Based Access Control

### Roles and Permissions

#### **Admin** 👑
- **Full System Access**: Complete control over all resources
- **Can Manage**: Clients, Users, Projects, Subscriptions
- **Special Privileges**: 
  - Create/Edit/Delete all entities
  - Assign managers to projects
  - View all platform statistics
  - Manage subscriptions

#### **Manager** 👔
- **Project Management**: Manage assigned projects
- **Can Manage**: Projects (assigned), Vulnerabilities, Team Members
- **Special Privileges**:
  - View and edit assigned projects
  - Create/edit vulnerabilities
  - Update vulnerability status and severity
  - View team members

#### **Member (Tester)** 🔍
- **Vulnerability Testing**: Report and track vulnerabilities
- **Can Manage**: Own vulnerability reports
- **Special Privileges**:
  - View assigned projects
  - Create/edit own vulnerability reports
  - View all vulnerabilities in assigned projects

#### **Client** 🏢
- **Read-Only Access**: View their projects and vulnerabilities
- **Can View**: Own projects and associated vulnerabilities
- **Special Privileges**:
  - View project details
  - View vulnerability reports
  - View subscription status

---

## Authentication Flow

```
┌─────────────────┐
│   User Opens    │
│   Application   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Check Token   │
│   in Storage    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌──────────┐
│ Token │ │ No Token │
│ Found │ │  Found   │
└───┬───┘ └────┬─────┘
    │          │
    │          ▼
    │    ┌─────────────────┐
    │    │  Redirect to    │
    │    │  Login Page     │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │  Enter Email &  │
    │    │    Password     │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ POST /api/auth/ │
    │    │     login       │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ Receive Token & │
    │    │   User Info     │
    │    └────────┬────────┘
    │             │
    └─────────────┘
         │
         ▼
┌─────────────────┐
│ Store Token &   │
│  User Info in   │
│  localStorage   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fetch User     │
│  Details from   │
│  /api/user      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Determine User │
│      Role       │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    │         │          │            │
    ▼         ▼          ▼            ▼
┌────────┐ ┌──────┐ ┌─────────┐ ┌────────┐
│ Admin  │ │Manager│ │ Member  │ │ Client │
│Dashboard│ │Dashboard│ │Dashboard│ │Dashboard│
└────────┘ └──────┘ └─────────┘ └────────┘
```

### Registration Flow

#### Client Registration
```
┌─────────────────┐
│  Visit /auth/   │
│ register-client │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fill Form:     │
│  - Name         │
│  - Email        │
│  - Company      │
│  - Phone        │
│  - Country      │
│  - Website      │
│  - Address      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/client│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Success Message│
│  → Login Page   │
└─────────────────┘
```

#### Manager/Member Registration
```
┌─────────────────┐
│  Visit /auth/   │
│  register-user  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fill Form:     │
│  - Name         │
│  - Email        │
│  - Role         │
│    (Manager/    │
│    Member)      │
│  - Password     │
│  - Confirm Pwd  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/user  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auto Login &   │
│  Redirect to    │
│  Dashboard      │
└─────────────────┘
```

---

## Admin Flow

```
┌─────────────────┐
│  Admin          │
│  Dashboard      │
│  (/dashboard/   │
│    admin)       │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────────┬─────────────┐
    │         │          │              │             │
    ▼         ▼          ▼              ▼             ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────────┐ ┌──────────────┐
│ Manage │ │ Manage │ │  Manage  │ │  Manage    │ │   View       │
│Clients │ │ Users  │ │ Projects │ │Subscriptions│ │  Statistics  │
└───┬────┘ └───┬────┘ └────┬─────┘ └─────┬──────┘ └──────────────┘
    │          │           │              │
    │          │           │              │
    ▼          ▼           ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                     Actions Available                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  CLIENTS:                                                 │
│  • View All Clients          GET  /api/client            │
│  • Add Client                POST /api/client            │
│  • View Client Details       GET  /api/client/:id        │
│  • Edit Client               PUT  /api/client/:id        │
│  • Delete Client             DELETE /api/client/:id      │
│                                                           │
│  USERS:                                                    │
│  • View All Users            GET  /api/user              │
│  • Create User               POST /api/user              │
│  • Edit User                 PUT  /api/user/:id          │
│  • Delete User               DELETE /api/user/:id        │
│                                                           │
│  PROJECTS:                                                 │
│  • View All Projects         GET  /api/project           │
│  • Create Project            POST /api/project           │
│  • View Project              GET  /api/project/:id       │
│  • Edit Project              PUT  /api/project/:id       │
│  • Delete Project            DELETE /api/project/:id     │
│  • Assign Manager            PUT  /api/project/:id/      │
│                              assign-manager               │
│                                                           │
│  SUBSCRIPTIONS:                                            │
│  • View Subscription         GET  /api/plan/             │
│                              subscription/:clientId       │
│  • Add Subscription          POST /api/plan/             │
│                              subscription/:clientId       │
│  • Update Subscription       PATCH /api/plan/            │
│                              subscription/:id             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Admin Workflow Example: Creating a New Project

```
┌─────────────────┐
│  Admin Clicks   │
│  "Add Project"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fill Project   │
│  Details:       │
│  - Title        │
│  - Description  │
│  - Type         │
│  - Client       │
│  - Manager      │
│  - Members      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/      │
│  project        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Project        │
│  Created        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirect to    │
│  Projects List  │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Manager        │
│  Notified       │
│  (if assigned)  │
└─────────────────┘
```

---

## Manager Flow

```
┌─────────────────┐
│  Manager        │
│  Dashboard      │
│  (/dashboard/   │
│    manager)     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    │         │          │            │
    ▼         ▼          ▼            ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────────┐
│  View  │ │ Manage │ │  Manage  │ │   View     │
│ Assigned│ │ Projects│ │Vulnerabilities│ │Team Members│
│Projects │ │        │ │          │ │            │
└───┬────┘ └───┬────┘ └────┬─────┘ └────────────┘
    │          │           │
    │          │           │
    ▼          ▼           ▼
┌──────────────────────────────────────────────────────────┐
│                  Actions Available                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  PROJECTS (Assigned Only):                               │
│  • View Assigned Projects  GET  /api/project            │
│    (filtered by manager)                                 │
│  • View Project Details    GET  /api/project/:id        │
│  • Edit Project            PUT  /api/project/:id        │
│                                                           │
│  VULNERABILITIES:                                        │
│  • View All (in projects)  GET  /api/vulnerability/     │
│                              :projectId                  │
│  • Create Vulnerability    POST /api/vulnerability/     │
│                              :projectId                  │
│  • Edit Vulnerability      PUT  /api/vulnerability/:id  │
│  • Update Status           PATCH /api/vulnerability/:id/│
│                              update-status               │
│  • Update Severity         PATCH /api/vulnerability/:id/│
│                              update-severity             │
│  • Delete Vulnerability    DELETE /api/vulnerability/:id│
│                                                           │
│  TEAM MEMBERS:                                           │
│  • View Team Members       (from project.members)       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Manager Workflow Example: Managing Vulnerabilities

```
┌─────────────────┐
│  Manager Views  │
│  Assigned       │
│  Project        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Navigate to    │
│  Vulnerabilities│
│  Tab/Page       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│  View  │ │ Create │
│Existing│ │   New  │
└───┬────┘ └───┬────┘
    │          │
    │          ▼
    │    ┌─────────────────┐
    │    │  Fill Form:     │
    │    │  - Title        │
    │    │  - Type         │
    │    │  - Description  │
    │    │  - Steps        │
    │    │  - Severity     │
    │    │  - Status       │
    │    │  - PoC URLs     │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ POST /api/      │
    │    │ vulnerability/  │
    │    │ :projectId      │
    │    └────────┬────────┘
    │             │
    │             ▼
    │    ┌─────────────────┐
    │    │ Vulnerability   │
    │    │   Created       │
    │    └─────────────────┘
    │
    ▼
┌─────────────────┐
│  Update Status  │
│  or Severity    │
│  if needed      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PATCH /api/    │
│  vulnerability/ │
│  :id/update-    │
│  status         │
└─────────────────┘
```

---

## Member (Tester) Flow

```
┌─────────────────┐
│  Member         │
│  Dashboard      │
│  (/dashboard/   │
│    tester)      │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────────┐
│  View  │ │  View  │ │   Create   │
│ Assigned│ │Vulnerability│ │Vulnerability│
│Projects │ │ Reports│ │   Report   │
└───┬────┘ └───┬────┘ └─────┬──────┘
    │          │            │
    │          │            │
    ▼          ▼            ▼
┌──────────────────────────────────────────────────────────┐
│                  Actions Available                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  PROJECTS (Assigned as Member):                          │
│  • View Assigned Projects  GET  /api/project            │
│    (filtered by members)                                 │
│  • View Project Details    GET  /api/project/:id        │
│                                                           │
│  VULNERABILITIES:                                        │
│  • View All (in projects)  GET  /api/vulnerability/     │
│                              :projectId                  │
│  • Create Vulnerability    POST /api/vulnerability/     │
│                              :projectId                  │
│  • Edit Own Reports        PUT  /api/vulnerability/:id  │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Member Workflow Example: Reporting a Vulnerability

```
┌─────────────────┐
│  Member Views   │
│  Assigned       │
│  Project        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click "Report  │
│  Vulnerability" │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fill Form:     │
│  - Title        │
│  - Type         │
│  - Description  │
│  - Steps to     │
│    Reproduce    │
│  - Severity     │
│  - Status       │
│  - PoC URLs     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ POST /api/      │
│ vulnerability/  │
│ :projectId      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vulnerability  │
│  Reported       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Manager &      │
│  Admin Notified │
│  (if critical)  │
└─────────────────┘
```

---

## Client Flow

```
┌─────────────────┐
│  Client         │
│  Dashboard      │
│  (/dashboard)   │
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    │         │          │
    ▼         ▼          ▼
┌────────┐ ┌────────┐ ┌────────────┐
│  View  │ │  View  │ │   View     │
│  Own   │ │Vulnerabilities│ │  Statistics  │
│Projects │ │        │ │            │
└───┬────┘ └───┬────┘ └────────────┘
    │          │
    │          │
    ▼          ▼
┌──────────────────────────────────────────────────────────┐
│                  Actions Available                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  PROJECTS (Own Only):                                    │
│  • View Own Projects      GET  /api/project             │
│    (filtered by client)                                  │
│  • View Project Details   GET  /api/project/:id         │
│                                                           │
│  VULNERABILITIES (Read-Only):                            │
│  • View All (in projects) GET  /api/vulnerability/      │
│                              :projectId                  │
│                                                           │
│  STATISTICS:                                             │
│  • Total Projects                                        │
│  • Total Vulnerabilities                                 │
│  • Resolved Issues                                       │
│  • Open Issues                                           │
│  • Severity Breakdown                                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Client Workflow Example: Viewing Project Status

```
┌─────────────────┐
│  Client Logs In │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Dashboard │
│  with Projects  │
│  Summary        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click on       │
│  Project        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View Project   │
│  Details:       │
│  - Title        │
│  - Description  │
│  - Manager      │
│  - Members      │
│  - Created Date │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  View           │
│  Vulnerabilities│
│  Associated     │
│  with Project   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  See Status:    │
│  - Open         │
│  - In Progress  │
│  - Resolved     │
│  - Closed       │
│  - Severity     │
│    Levels       │
└─────────────────┘
```

---

## Combined Workflow

This diagram shows how all roles work together in a typical project lifecycle:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      PROJECT LIFECYCLE                                │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   CLIENT     │
│  Registers   │
│   Account    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    ADMIN     │
│  Creates     │
│  Client      │
│  Record      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    ADMIN     │
│  Creates     │
│  Project &   │
│  Assigns     │
│  Manager     │
└──────┬───────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐  ┌──────────────┐
│   MANAGER    │  │    ADMIN     │
│  Assigned    │  │  Adds Team   │
│  to Project  │  │  Members     │
└──────┬───────┘  └──────┬───────┘
       │                  │
       │                  ▼
       │          ┌──────────────┐
       │          │   MEMBER     │
       │          │  Assigned    │
       │          │  to Project  │
       │          └──────┬───────┘
       │                 │
       │                 │
       ▼                 ▼
┌─────────────────────────────────┐
│     PROJECT IN PROGRESS         │
│                                 │
│  ┌──────────────────────────┐  │
│  │   MEMBER (Tester)        │  │
│  │  • Tests Application     │  │
│  │  • Reports Vulnerabilities│  │
│  └───────────┬──────────────┘  │
│              │                  │
│              ▼                  │
│  ┌──────────────────────────┐  │
│  │   MANAGER                │  │
│  │  • Reviews Reports       │  │
│  │  • Updates Status        │  │
│  │  • Updates Severity      │  │
│  │  • Assigns Fixes         │  │
│  └───────────┬──────────────┘  │
│              │                  │
│              ▼                  │
│  ┌──────────────────────────┐  │
│  │   MEMBER/DEVELOPER       │  │
│  │  • Fixes Vulnerabilities │  │
│  │  • Updates Status        │  │
│  └───────────┬──────────────┘  │
│              │                  │
│              ▼                  │
│  ┌──────────────────────────┐  │
│  │   MANAGER                │  │
│  │  • Verifies Fixes        │  │
│  │  • Marks as Resolved     │  │
│  └───────────┬──────────────┘  │
│              │                  │
│              ▼                  │
│  ┌──────────────────────────┐  │
│  │   CLIENT                 │  │
│  │  • Views Progress        │  │
│  │  • Reviews Reports       │  │
│  │  • Sees Statistics       │  │
│  └──────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
       │
       ▼
┌──────────────┐
│    ADMIN     │
│  • Monitors  │
│  • Manages   │
│  • Reports   │
└──────────────┘
```

### Detailed Combined Flow Example

```
1. CLIENT REGISTRATION
   Client → Registers → Admin receives notification

2. PROJECT CREATION
   Admin → Creates Project → Assigns Manager → Adds Members

3. VULNERABILITY DISCOVERY
   Member → Tests Application → Discovers Vulnerability → Creates Report
   
4. VULNERABILITY REVIEW
   Manager → Reviews Report → Updates Severity → Assigns Priority
   
5. VULNERABILITY RESOLUTION
   Member/Developer → Fixes Issue → Updates Status → Manager Verifies
   
6. CLIENT VISIBILITY
   Client → Views Dashboard → Sees Project Status → Reviews Vulnerabilities

7. PROJECT COMPLETION
   Manager → Marks All Issues Resolved → Client Reviews → Project Closed
```

---

## API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | All | User login |
| POST | `/api/auth/logout` | All | User logout |
| POST | `/api/auth/forget-password` | All | Request password reset |
| POST | `/api/auth/reset-password` | All | Reset password with token |
| POST | `/api/auth/refresh-token` | All | Refresh authentication token |

### Client Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/client` | Admin | Get all clients |
| POST | `/api/client` | Admin | Create new client |
| GET | `/api/client/:id` | Admin | Get client by ID |
| PUT | `/api/client/:id` | Admin | Update client |
| DELETE | `/api/client/:id` | Admin | Delete client |

### User Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/user` | Admin | Get all users |
| POST | `/api/user` | Admin | Create new user |
| PUT | `/api/user/:id` | Admin | Update user |
| DELETE | `/api/user/:id` | Admin | Delete user |

### Project Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/project` | Admin, Manager, Member | Get all projects (filtered by role) |
| POST | `/api/project` | Admin | Create new project |
| GET | `/api/project/:id` | Admin, Manager, Member | Get project by ID |
| PUT | `/api/project/:id` | Admin, Manager | Update project |
| DELETE | `/api/project/:id` | Admin | Delete project |
| PUT | `/api/project/:id/assign-manager` | Admin | Assign manager to project |

### Vulnerability Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/vulnerability/:projectId` | Admin, Manager, Member | Get all vulnerabilities for a project |
| POST | `/api/vulnerability/:projectId` | Admin, Manager, Member | Create new vulnerability |
| PUT | `/api/vulnerability/:id` | Admin, Manager, Member | Update vulnerability |
| DELETE | `/api/vulnerability/:id` | Admin, Manager | Delete vulnerability |
| PATCH | `/api/vulnerability/:id/update-status` | Admin, Manager | Update vulnerability status |
| PATCH | `/api/vulnerability/:id/update-severity` | Admin, Manager | Update vulnerability severity |

### Subscription Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/plan/subscription/:clientId` | Admin | Get client subscription |
| POST | `/api/plan/subscription/:clientId` | Admin | Create subscription for client |
| PATCH | `/api/plan/subscription/:id` | Admin | Update subscription |

---

## Frontend Routes

### Authentication Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/auth/login` | Login | User login page |
| `/auth/register-client` | RegisterClient | Client registration |
| `/auth/register-user` | RegisterUser | Manager/Member registration |
| `/auth/forget-password` | ForgetPassword | Password reset request |
| `/auth/reset-password` | ResetPassword | Password reset form |

### Dashboard Routes (Protected)

| Route | Role | Component | Description |
|-------|------|-----------|-------------|
| `/dashboard/admin` | Admin | AdminDashboard | Admin dashboard |
| `/dashboard/manager` | Manager | ManagerDashboard | Manager dashboard |
| `/dashboard/tester` | Member | MemberDashboard | Member dashboard |
| `/dashboard` | Client | ClientDashboard | Client dashboard |

### Client Management Routes (Admin Only)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/clients` | ClientList | List all clients |
| `/dashboard/clients/add` | AddClient | Add new client |
| `/dashboard/clients/:id` | ViewClient | View client details |
| `/dashboard/clients/:id/edit` | EditClient | Edit client |

### User Management Routes (Admin Only)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/users` | UserList | List all users |
| `/dashboard/users/add` | AddUser | Add new user |
| `/dashboard/users/:id/edit` | EditUser | Edit user |

### Project Management Routes

| Route | Role | Component | Description |
|-------|------|-----------|-------------|
| `/dashboard/projects` | Admin, Manager, Member | ProjectList | List projects |
| `/dashboard/projects/add` | Admin | AddProject | Add new project |
| `/dashboard/projects/:id` | Admin, Manager, Member | ViewProject | View project details |
| `/dashboard/projects/:id/edit` | Admin, Manager | EditProject | Edit project |
| `/dashboard/projects/:id/assign-manager` | Admin | AssignManager | Assign manager to project |

### Vulnerability Management Routes

| Route | Role | Component | Description |
|-------|------|-----------|-------------|
| `/dashboard/projects/:projectId/vulnerabilities` | Admin, Manager, Member | VulnerabilityList | List vulnerabilities |
| `/dashboard/projects/:projectId/vulnerabilities/add` | Admin, Manager, Member | AddVulnerability | Add vulnerability |
| `/dashboard/projects/:projectId/vulnerabilities/:id/edit` | Admin, Manager, Member | EditVulnerability | Edit vulnerability |
| `/dashboard/projects/:projectId/vulnerabilities/:id/update-status` | Admin, Manager | UpdateStatus | Update vulnerability status |
| `/dashboard/projects/:projectId/vulnerabilities/:id/update-severity` | Admin, Manager | UpdateSeverity | Update vulnerability severity |

### Subscription Management Routes (Admin Only)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard/clients/:clientId/subscription` | ViewSubscription | View client subscription |
| `/dashboard/clients/:clientId/subscription/add` | AddSubscription | Add subscription |
| `/dashboard/clients/:clientId/subscription/:subscriptionId/edit` | EditSubscription | Edit subscription |

---

## Security & Access Control

### Route Protection
- All dashboard routes are protected and require authentication
- Role-based access control is enforced at the route level
- Users are redirected to their role-appropriate dashboard if they try to access unauthorized routes

### Token Management
- JWT tokens are stored in localStorage
- Tokens are refreshed automatically when expired
- Tokens are cleared on logout

### Role Hierarchy
```
Admin (Full Access)
  ↓
Manager (Project Management)
  ↓
Member (Vulnerability Testing)
  ↓
Client (Read-Only)
```

---

## Design System

### Color Theme
- **Primary**: Teal (#14b8a6)
- **Secondary**: Gray (#6b7280)
- **Background**: Light Gray (#f9fafb)
- **Text**: Dark Gray (#1f2937)

### Component Classes
- `.btn-primary`: Primary button (teal background)
- `.btn-secondary`: Secondary button (gray background)
- `.input-field`: Form input field
- `.card`: Card container with shadow and border

---

## Future Enhancements

1. **Notifications System**: Real-time notifications for vulnerability updates
2. **Report Generation**: Export vulnerability reports as PDF
3. **Analytics Dashboard**: Advanced analytics and insights
4. **Multi-factor Authentication**: Enhanced security for admin accounts
5. **Activity Logs**: Detailed activity tracking for all actions
6. **Email Notifications**: Automated email notifications for important events

---

## Conclusion

This documentation provides a comprehensive overview of The Architect application's flow and architecture. The role-based access control ensures proper separation of concerns while allowing seamless collaboration between different user types. The application follows RESTful API principles and provides a clean, intuitive user interface for managing security vulnerabilities.

For any questions or clarifications, please refer to the source code or contact the development team.

---

**Last Updated**: 2024
**Version**: 1.0.0

