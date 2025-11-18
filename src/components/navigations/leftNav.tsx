import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart2,
  Users,
  Folder,
  Settings,
  Building,
  Shield,
  LogOut,
} from "lucide-react";
import { getUserRole } from "../../utils/getCurrentUser";

const adminMenus = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard/admin" },
  { id: "projects", label: "Projects", icon: Folder, path: "/dashboard/projects" },
  { id: "clients", label: "Clients", icon: Building, path: "/dashboard/clients" },
  { id: "users", label: "Users", icon: Users, path: "/dashboard/users" },
  { id: "reports", label: "Reports", icon: BarChart2, path: "/dashboard/reports" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const managerMenus = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard/manager" },
  { id: "projects", label: "My Projects", icon: Folder, path: "/dashboard/projects" },
  { id: "reports", label: "Reports", icon: BarChart2, path: "/dashboard/reports" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const memberMenus = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard/tester" },
  { id: "projects", label: "My Projects", icon: Folder, path: "/dashboard/projects" },
  { id: "reports", label: "My Reports", icon: BarChart2, path: "/dashboard/reports" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const clientMenus = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
  { id: "projects", label: "My Projects", icon: Folder, path: "/dashboard/projects" },
  { id: "reports", label: "Reports", icon: BarChart2, path: "/dashboard/reports" },
  { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function LeftNav() {
  const location = useLocation();
  const role = getUserRole();

  const getMenus = () => {
    switch (role) {
      case "admin":
        return adminMenus;
      case "manager":
        return managerMenus;
      case "member":
        return memberMenus;
      default:
        return clientMenus;
    }
  };

  const menus = getMenus();
  const activeMenu = menus.find((m) => location.pathname.startsWith(m.path))?.id || "dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 text-gray-900 py-6 shadow-sm flex flex-col fixed left-0 top-0 z-40">
      {/* Logo / Title */}
      <Link to="/dashboard" className="pl-8 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              The Architect
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Security Platform</p>
          </div>
        </div>
      </Link>

      {/* Role Badge */}
      {role && (
        <div className="px-8 mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
            role === "admin" ? "bg-red-100 text-red-700 border-red-200" :
            role === "manager" ? "bg-blue-100 text-blue-700 border-blue-200" :
            role === "member" ? "bg-green-100 text-green-700 border-green-200" :
            "bg-purple-100 text-purple-700 border-purple-200"
          }`}>
            {role.toUpperCase()}
          </span>
        </div>
      )}

      {/* Menu List */}
      <ul className="m-0 p-0 flex-1 overflow-y-auto">
        {menus.map((m) => {
          const IconComponent = m.icon;
          const isActive = activeMenu === m.id;

          return (
            <li key={m.id}>
              <Link
                to={m.path}
                className={`
                  flex items-center gap-3
                  pl-8 py-3 mx-3 mb-1 rounded-lg
                  transition-all duration-200
                  font-medium text-sm
                  ${isActive 
                    ? "bg-teal-50 text-teal-700 border-l-4 border-teal-500" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-gray-500"}`} />
                <span>{m.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout Button */}
      <div className="px-8 pt-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full pl-2 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-gray-500 mt-4">© 2024 The Architect</p>
      </div>
    </aside>
  );
}
