import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { Edit, User, Users, Building } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  desc: string;
  projectType: string;
  client: any;
  manager: any;
  members: any[];
  createdAt: string;
}

export default function ViewProject() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get("/project");
      const projects = res.data.data || [];
      const foundProject = projects.find((p: any) => p._id === id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        setError("Project not found.");
      }
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch project.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-600">{error || "Project not found."}</div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Project Details</h1>
          <Link
            to={`/dashboard/projects/${id}/edit`}
            className="flex items-center gap-2 btn-primary"
          >
            <Edit className="w-5 h-5" />
            Edit Project
          </Link>
        </div>

        <div className="card p-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold text-gray-800">{project.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(project.projectType)}`}>
                  {project.projectType}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
              <p className="text-gray-700">{project.desc || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
              {project.client && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="text-gray-800 font-medium">{project.client.name || project.client}</p>
                  </div>
                </div>
              )}

              {project.manager && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-teal-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Manager</p>
                    <p className="text-gray-800 font-medium">{project.manager.name || project.manager}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-teal-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-gray-800 font-medium">{project.members?.length || 0} members</p>
                  {project.members && project.members.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {project.members.map((member: any, index: number) => (
                        <li key={index} className="text-gray-700 text-sm">
                          {member.name || member}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Link
                to="/dashboard/projects"
                className="text-teal-600 hover:text-teal-700 hover:underline"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

