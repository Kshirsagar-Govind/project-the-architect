import { Outlet, NavLink, useParams } from "react-router-dom";
import { testerLinks } from "../pages/Admin/routes";
import { FiBell, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { getUser } from "../utils/auth";
import { logout } from "../services/auth.service";
import { useEffect } from "react";
import { RiDashboardHorizontalFill } from "react-icons/ri";

export default function PMLayout() {
    const user = getUser()
    const { p_id } = useParams()
    useEffect(() => {
    }, [p_id])
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-primary-dark text-white py-5">
                <h3 className="text-xl font-semibold mb-6 px-5">
                    The Architect
                </h3>
                <nav className="space-y-3">
                    <ul>
                        <NavLink className={'pl-5 inline-flex items-center py-2 w-full h-full'} to={'/tester'}>
                            <span className="pr-3"><RiDashboardHorizontalFill /></span>
                            Dashboard
                        </NavLink>
                        {p_id != undefined &&
                            testerLinks.map((link, index) => {
                                return (
                                    <li key={index} className="flex align-middle items-center my-3 hover:bg-primary-darker">
                                        <NavLink className={'pl-5 inline-flex items-center py-2 w-full h-full'} to={link.linkPath.replace(':p_id', p_id)}>
                                            <span className="pr-3">{<link.icon />}</span>
                                            {link.linkLabel}
                                        </NavLink>
                                    </li>
                                )
                            })

                        }
                    </ul>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col">


                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="font-medium text-gray-700">
                        Tester
                    </div>

                    <div className="flex items-center gap-6">

                        <button className="relative text-gray-600 hover:text-gray-800">
                            <FiBell size={20} />
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="relative group cursor-pointer">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiUser />
                                <span className="text-sm font-medium">
                                    {user.name}
                                </span>
                                <FiChevronDown size={16} />
                            </div>

                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-md opacity-0 group-hover:opacity-100 transition">
                                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                    <FiUser /> Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600">
                                    <FiLogOut /> Logout
                                </button>
                            </div>
                        </div>

                    </div>
                </header>
                {/* Main content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>

        </div>
    );
}
