import {
  FiGrid,
  FiFolder,
  FiUsers,
  FiUserCheck,
  FiUser
} from "react-icons/fi";
import { MdError } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { MdAnalytics } from "react-icons/md";


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
    linkPath: "/manager/overview/:p_id ",
    linkLabel: "Overview",
    icon: MdAnalytics,
  },
  {
    linkPath: "/manager/reports/:p_id ",
    linkLabel: "Reports",
    icon: FiGrid,
  },
  {
    linkPath: "/manager/ticket-support/:p_id",
    linkLabel: "Ticket Support",
    icon: FiGrid,
  },
]

export const testerLinks= [
  {
    linkPath: "/tester/overview/:p_id",
    linkLabel: "Overview",
    icon: MdAnalytics,
  },
  {
    linkPath: "/tester/my-reports/:p_id",
    linkLabel: "My Reports",
    icon: MdError,
  },
  {
    linkPath: "/tester/submit-report/:p_id",
    linkLabel: "Submit Report",
    icon: FaFileLines,
  },
]

export const clientLinks= [
  {
    linkPath: "/overview/:p_id",
    linkLabel: "Overview",
    icon: MdAnalytics,
  },
  {
    linkPath: "/reports/:p_id",
    linkLabel: "Reports",
    icon: MdError,
  }
]
