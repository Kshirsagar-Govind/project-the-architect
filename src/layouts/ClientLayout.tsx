import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <aside className="w-64 bg-primary-dark text-white p-5">
                <h3 className="text-xl font-semibold mb-6">
                    The Architect
                </h3>
                <nav className="space-y-3">
                    <ul>
                        <li>

                        </li>
                        <li>
                            <NavLink
                                to={'/dashboard/projects'}>
                                Projects
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/dashboard/Users'} >
                                Users
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/dashboard/Reports'} >
                                Reports
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/dashboard/tickets'} >
                                Ticket 
                            </NavLink>
                        </li>

                    </ul>

                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>

        </div>
    );
}
