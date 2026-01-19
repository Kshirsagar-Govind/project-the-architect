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
    role: "ADMIN"
  },
  {
    linkPath: "/dashboard/admin/projects",
    linkLabel: "Projects",
    icon: FiFolder,
    role: "ADMIN"
  },
  {
    linkPath: "/dashboard/admin/clients",
    linkLabel: "Clients",
    icon: FiUsers,
    role: "ADMIN"
  },
  {
    linkPath: "/dashboard/admin/pm",
    linkLabel: "Managers",
    icon: FiUserCheck,
    role: "ADMIN"
  },
  {
    linkPath: "/dashboard/admin/employees",
    linkLabel: "Testers",
    icon: FiUser,
    role: "ADMIN"
  },
];

export const managerLinks = [
  // {
  //   linkPath: "/overview/:p_id ",
  //   linkLabel: "Overview",
  //   icon: MdAnalytics,
  //   role: "MANAGER"
  // },
  {
    linkPath: "/reports/:p_id ",
    linkLabel: "Reports",
    icon: FiGrid,
    role: "MANAGER"
  },
  {
    linkPath: "/ticket-support/:p_id",
    linkLabel: "Ticket Support",
    icon: FiGrid,
    role: "MANAGER"
  },
]

export const testerLinks = [
  // {
  //   linkPath: "/overview/:p_id",
  //   linkLabel: "Overview",
  //   icon: MdAnalytics,
  //   role: "TESTER"
  // },
  {
    linkPath: "/reports/:p_id",
    linkLabel: "My Reports",
    icon: MdError,
    role: "TESTER"
  },
  {
    linkPath: "/submit-report/:p_id",
    linkLabel: "Submit Report",
    icon: FaFileLines,
    role: "TESTER"
  },
]

export const clientLinks = [
  {
    linkPath: "/overview/:p_id",
    linkLabel: "Overview",
    icon: MdAnalytics,
    role: "CLIENT"
  },
  {
    linkPath: "/reports/:p_id",
    linkLabel: "Reports",
    icon: MdError,
    role: "CLIENT"
  },
    {
    linkPath: "/ticket-support/:p_id",
    linkLabel: "Ticket Support",
    icon: FiGrid,
    role: "CLIENT"
  },
]

export const Links = [...adminLinks,
...managerLinks,
...testerLinks,
...clientLinks
] 