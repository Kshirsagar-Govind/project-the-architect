import { useEffect, useMemo, useState } from "react";
import { Pencil, UserPlus } from "lucide-react";
// import AssignManager from "./Forms/assignPM";
import PopupBackground from "../../components/common/popupBackground";
import { useQuery } from "@tanstack/react-query";
import { assignMembersProject, fetchProjects, updateProject } from "../../services/project.services";
import { useDebounce } from '../../hooks/useDebounce'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers } from "../../services/users.services";
import type { Project, ProjectStatus, User } from "../../utils/interfaces";

export default function AllProjects() {

  const [title, setTitle] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [status, setStatus] = useState('');

  const debounceTitle = useDebounce(300, title);
  const debounceClientEmail = useDebounce(500, clientEmail);

  const filters = useMemo(() => ({
    title: debounceTitle,
    clientEmail: debounceClientEmail,
    status: status
  }), [debounceTitle, debounceClientEmail, status])


  const { data:project=[], isLoading, isError } = useQuery({
    queryKey: ['project_1', filters], queryFn: () => fetchProjects(filters)
  })

  const [showAssignPM, setShowAssignPM] = useState(false)
  // const [selectedProjectId, setSelectedProjectId] = useState<Project>()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
console.log(project);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          {/* <button className="inline-flex align-bottom bg-primary px-4 py-2 rounded-sm text-primary-contrast" >
            Add Project
            <IoIosAddCircle className="ml-2" />
            </button> */}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="Project name"
            className="input-field"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            placeholder="Client email"
            className="input-field"
            value={clientEmail}
            onChange={(e) =>
              setClientEmail(e.target.value)
            }
          />

          <select
            className="input-field"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Manager</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Testers</th>
              {/* <th className="px-4 py-3 text-left">Created</th> */}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {
              isError ?
                <tr className="border-t hover:bg-gray-50">
                  <th className="col-span-full py-2">Error in fetching project...</th>
                </tr>
                :
                isLoading ?
                  <tr className="border-t hover:bg-gray-50">
                    <th className="col-span-full py-2">Fetching project...</th>
                  </tr>
                  :
                  project.length > 0 ?
                    project.map((p: Project) => (
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-left">{p.id}</td>
                        <td className="px-4 py-3 text-left font-medium">{p.title}</td>
                        <td className="px-4 py-3 text-left">{p.projectType}</td>
                        <td className="px-4 py-3 text-left">{p.client.name}</td>
                        <td className={`px-4 py-3 text-left`}>
                          {p.manager ? (
                            p.manager.name
                          ) :
                            <span className='text-xs px-2 py-1 rounded-full bg-error-light text-white'>
                              N/A
                            </span>
                          }
                        </td>

                        <td className="px-4 py-3 text-left">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium
                      ${p.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">{p.members.length > 0 ? p.members.length : 'N/A'}</td>
                        {/* <td className="px-4 py-3">{p.createdOn}</td> */}

                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => { setShowAssignPM(true); setSelectedProject(p) }}
                            className="text-gray-600 hover:text-primary-dark">
                            <Pencil size={16} />
                          </button>
                        </td>
                      </tr>
                    )) :
                    <tr className="border-t hover:bg-gray-50 py-2">
                      <th className="col-span-full py-2">
                        No Projects Found.
                      </th>
                    </tr>
            }
          </tbody>
        </table>
      </div>
      {
        showAssignPM && selectedProject &&
        <PopupBackground>
          <ProjectEdit
            onClose={() => setShowAssignPM(false)}
            project={selectedProject}
          />
        </PopupBackground>
      }
    </section>
  );
}


type ProjectEditProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectEdit({ project, onClose }: ProjectEditProps) {
  const queryClient = useQueryClient();

  const [managerId, setManagerId] = useState(project.manager?.id || "");
  const [status, setStatus] = useState(project.status);
  const [testerIds, setTesterIds] = useState<string[]>(project.members?project.members.map((te:any) => te.userId):[]);

  /* 🔹 Fetch Managers */
  const {
    data: managers = [],
  } = useQuery(
    {
      queryKey: ["manager", "MANAGER"],
      queryFn: () => fetchUsers("MANAGER"),
    });

  /* 🔹 Fetch Testers */
  const { data: testers = [] } = useQuery({
    queryKey: ['tester', "TESTER"],
    queryFn: () => fetchUsers("TESTER"),
  });

  /* 🔹 Update Project */
  const mutation = useMutation({
    mutationFn: () =>
      assignMembersProject({
        manager: managerId,
        status,
        members: testerIds,
      }, project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      onClose();
    },
  });
console.log(testers,'testers');
console.log(testerIds,'testerIds');

const isAlreadyTester=(id:string)=>{
  console.log(id,'+++++',testerIds.includes(id), {testerIds});
  
  if(testerIds.includes(id)) return true;
  return false;
}

  return (
    <PopupBackground>
      <div className="bg-white rounded-lg p-6 w-[500px] space-y-4">
        <h2 className="text-xl font-semibold">Edit Project</h2>

        {/* Manager */}
        <div>
          <label className="block text-sm font-medium">Project Manager</label>
          <select
            className="input-field w-full"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          >
            <option value="">Select Manager</option>
            {managers.map((m: User) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="input-field w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="hold">Hold</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Testers */}
        <div>
          <label className="block text-sm font-medium">Assign Testers</label>
          <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
            {testers.map((t: User) => (
              <label key={t.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isAlreadyTester(t.id)}
                 onChange={(e) => {
                  setTesterIds((prev) =>
                    e.target.checked
                      ? [...prev, t.id]          // CHECK
                      : prev.filter((id) => id !== t.id) // UNCHECK
                  );
                }}

                />
                {t.name}
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </PopupBackground>
  );
}
