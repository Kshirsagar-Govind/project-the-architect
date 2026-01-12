import { FiUsers, FiBriefcase, FiUserCheck, FiPlus } from "react-icons/fi";
import AddClient from "./Forms/addClient";
import { useEffect, useMemo, useState } from "react";
import PopupBackground from "../../components/common/popupBackground";
import AddManager from "./Forms/addManager";
import { fetchUsers } from "../../services/users.services";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../services/project.services";

type StatCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  link: string,
  onAdd?: () => void;
};

function StatCard({ title, count, icon, onAdd }: StatCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center">

      {/* Left content */}
      <div>
        <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
        <p className="text-3xl font-semibold text-gray-900 mt-1">
          {count}
        </p>

        {onAdd && (
          <button
            onClick={onAdd}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            <FiPlus />
            Add New
          </button>
        )}
      </div>

      {/* Icon */}
      <div className="text-teal-600 bg-teal-50 p-4 rounded-full">
        {icon}
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [showAddPMForm, setShowAddPMForm] = useState(false);
  const [clients, setClients] = useState([]);
  const [testers, setTesters] = useState([]);
  const [managers, setManagers] = useState([]);
  const [showAddTestersForm, setShowAddTesterForm] = useState(false);

  const {
    data,
    isLoading,
    error
  } = useQuery(
    {
      queryKey: ["user", ''],
      queryFn: () => fetchUsers(''),
      staleTime: 1000 * 60 * 5
    });

  const {
    data: Projects = [],
    isLoading: projectDataLoading = false
  } = useQuery(
    {
      queryKey: ["project", ''],
      queryFn: () => fetchProjects({}),
      staleTime: 1000 * 60 * 5
    });



  const filtered = useMemo(() => {
    const temp_clients: any[] = [];
    const temp_managers: any[] = [];
    const temp_testers: any[] = [];

    if (isLoading || error || !data) {
      return { temp_clients, temp_managers, temp_testers };
    }

    data.forEach((us: any) => {
      if (us.role === 'CLIENT') temp_clients.push(us);
      if (us.role === 'MANAGER') temp_managers.push(us);
      if (us.role === 'TESTER') temp_testers.push(us);
    });

    return { temp_clients, temp_managers, temp_testers };
  }, [data, error, isLoading]);


  useEffect(() => { }, [
    showAddClientForm,
    showAddPMForm,
    showAddTestersForm,
  ])
console.log(Projects);

  return (
    <section className="space-y-8">

      {/* Cards Section */}
      <section aria-label="Dashboard statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <StatCard
            title="Clients"
            count={(isLoading || error) ? 0 : filtered.temp_clients.length}
            icon={<FiUsers size={28} />}
            onAdd={() => setShowAddClientForm(true)}
          />

          <StatCard
            title="Projects"
            count={projectDataLoading? 0 : Projects.length || 0}
            icon={<FiBriefcase size={28} />}
            onAdd={() => console.log("Add Project")}
          />

          <StatCard
            title="Project Managers"
            count={(isLoading || error) ? 0 : filtered.temp_managers.length}
            icon={<FiUserCheck size={28} />}
            onAdd={() => setShowAddPMForm(true)}
          />

          <StatCard
            title="Testers"
            count={(isLoading || error) ? 0 : filtered.temp_testers.length}
            icon={<FiUserCheck size={28} />}
            onAdd={() => console.log("Add Tester")}
          />

        </div>
      </section>

      {/* Utility Section (future charts / activity / reports) */}
      <section
        aria-label="Dashboard utilities"
        className="bg-white rounded-xl border border-gray-200 p-6 min-h-[200px]"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Utilities
        </h2>
        <p className="text-sm text-gray-500">
          Charts, reports, recent activity will appear here.
        </p>
      </section>
      {/* Add Client Form Popup */}
      {
        showAddClientForm &&
        <PopupBackground >
          <AddClient onClose={() => setShowAddClientForm(false)} />
        </PopupBackground>
      }

      {
        showAddPMForm &&
        <PopupBackground >
          <AddManager onClose={() => setShowAddPMForm(false)} />
        </PopupBackground>
      }
      {/* Add PM Form Popup */}
      {/* Add Tester Form Popup */}


    </section>
  );
}
