import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiUserCheck,
  FiUser
} from "react-icons/fi";

export const adminLinks = [
  {
    linkPath: "/dashboard/admin",
    linkLabel: "Dashboard",
    icon: FiGrid,
  },
  {
    linkPath: "/dashboard/admin/projects",
    linkLabel: "Projects",
    icon: FiFolder,
  },
  {
    linkPath: "/dashboard/admin/clients",
    linkLabel: "Clients",
    icon: FiUsers,
  },
  {
    linkPath: "/dashboard/admin/pm",
    linkLabel: "Managers",
    icon: FiUserCheck,
  },
  {
    linkPath: "/dashboard/admin/employees",
    linkLabel: "Testers",
    icon: FiUser,
  },
];

export const managerLinks= [
  {
    linkPath: "/dashboard/manager",
    linkLabel: "Dashboard",
    icon: FiGrid,
  },
  {
    linkPath: "/dashboard/manager/reports",
    linkLabel: "Reports",
    icon: FiGrid,
  },
  {
    linkPath: "/dashboard/manager/ticket-support",
    linkLabel: "Ticket Support",
    icon: FiGrid,
  },
]
