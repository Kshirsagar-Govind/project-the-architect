import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Trash2, Edit, Eye, Plus, UserPlus } from "lucide-react";
import LeftNav from "../../components/navigations/leftNav";

interface Project {
  _id: string;
  id: string;
  title: string;
  desc: string;
  projectType: string;
  client: any;
  manager: any;
  members: any[];
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/project");
      setProjects(res.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch projects.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/project/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      setDeleteLoading(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete project.");
      setDeleteLoading(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "web":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "mobile":
        return "bg-green-100 text-green-700 border-green-200";
      case "product":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <>
        <LeftNav />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 ml-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LeftNav />
      <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <Link
              to="/dashboard/projects/add"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Project
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No projects found. Add your first project to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="card hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">{project.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ml-2 ${getTypeColor(project.projectType)}`}>
                        {project.projectType}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.desc || "No description"}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      <p>Manager: {project.manager?.name || "Not assigned"}</p>
                      <p>Members: {project.members?.length || 0}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <Link
                        to={`/dashboard/projects/${project._id}`}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/dashboard/projects/${project._id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/dashboard/projects/${project._id}/assign-manager`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Assign Manager"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project._id)}
                        disabled={deleteLoading === project._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 ml-auto"
                        title="Delete"
                      >
                        {deleteLoading === project._id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                          </svg>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
