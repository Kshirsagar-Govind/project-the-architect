import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { Folder, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  desc: string;
  projectType: string;
  client: any;
  manager: any;
  members: any[];
  status?: string;
}

interface Vulnerability {
  _id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
}

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientEmail, setClientEmail] = useState<string>("");

  useEffect(() => {
    // Get client email from token (assuming email is in token)
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setClientEmail(payload.email || "");
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      
      // Get client ID from email
      let clientId = null;
      if (clientEmail) {
        const clientsRes = await api.get(`/client?email=${clientEmail}`);
        const clients = clientsRes.data.data || [];
        if (clients.length > 0) {
          clientId = clients[0]._id;
        }
      }

      // Fetch all projects and filter by client
      const projectsRes = await api.get("/project");
      const allProjects = projectsRes.data.data || [];
      
      if (clientId) {
        const clientProjects = allProjects.filter(
          (p: Project) => p.client?._id === clientId || p.client?.toString() === clientId
        );
        setProjects(clientProjects);

        // Fetch vulnerabilities for client's projects
        if (clientProjects.length > 0) {
          const projectIds = clientProjects.map((p: Project) => p._id);
          const vulnPromises = projectIds.map((pid: string) =>
            api.get(`/vulnerability/${pid}`).catch(() => ({ data: { data: [] } }))
          );
          const vulnResults = await Promise.all(vulnPromises);
          const allVulns = vulnResults.flatMap((res) => res.data.data || []);
          setVulnerabilities(allVulns);
        }
      } else {
        // If no client ID, show all projects (fallback)
        setProjects(allProjects);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching client data:", err);
      setLoading(false);
    }
  };

  const getSeverityCount = (severity: string) => {
    return vulnerabilities.filter((v) => v.severity === severity).length;
  };

  const getStatusCount = (status: string) => {
    return vulnerabilities.filter((v) => v.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 ml-64 flex items-center justify-center">
        <div className="text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Overview of your projects and security status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{projects.length}</h3>
            <p className="text-gray-600 text-sm">Total Projects</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{vulnerabilities.length}</h3>
            <p className="text-gray-600 text-sm">Total Vulnerabilities</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {getStatusCount("resolved") + getStatusCount("closed")}
            </h3>
            <p className="text-gray-600 text-sm">Resolved Issues</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{getStatusCount("open")}</h3>
            <p className="text-gray-600 text-sm">Open Issues</p>
          </div>
        </div>

        {/* Vulnerability Severity Breakdown */}
        {vulnerabilities.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vulnerability Severity</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700 mb-1">{getSeverityCount("critical")}</div>
                <div className="text-sm text-red-600">Critical</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700 mb-1">{getSeverityCount("high")}</div>
                <div className="text-sm text-orange-600">High</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700 mb-1">{getSeverityCount("medium")}</div>
                <div className="text-sm text-yellow-600">Medium</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700 mb-1">{getSeverityCount("low")}</div>
                <div className="text-sm text-green-600">Low</div>
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
            <Link
              to="/dashboard/projects"
              className="text-teal-600 hover:text-teal-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>No projects assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/dashboard/projects/${project._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{project.desc || "No description"}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Type: {project.projectType}</span>
                        {project.manager && (
                          <span>Manager: {typeof project.manager === "object" ? project.manager.name : "N/A"}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      project.projectType === "web" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      project.projectType === "mobile" ? "bg-green-100 text-green-700 border-green-200" :
                      "bg-purple-100 text-purple-700 border-purple-200"
                    }`}>
                      {project.projectType}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
