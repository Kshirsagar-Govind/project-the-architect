import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { Folder, AlertCircle, CheckCircle, Clock, Plus, FileText } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  desc: string;
  projectType: string;
  client: any;
  manager: any;
  members: any[];
}

interface Vulnerability {
  _id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  projectId: any;
  reportedBy: any;
}

export default function MemberDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [myVulnerabilities, setMyVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Get user ID from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id || "");
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      
      // Fetch all projects
      const projectsRes = await api.get("/project");
      const allProjects = projectsRes.data.data || [];
      
      // Filter projects where this user is a member
      const assignedProjects = allProjects.filter((p: Project) => {
        if (!p.members || !Array.isArray(p.members)) return false;
        return p.members.some((member: any) => {
          const memberId = typeof member === "object" ? (member._id || member.id) : member;
          return memberId === userId || memberId?.toString() === userId;
        });
      });
      setProjects(assignedProjects);

      // Fetch vulnerabilities for assigned projects and filter by reportedBy
      const projectIds = assignedProjects.map((p: Project) => p._id);
      const vulnPromises = projectIds.map((pid: string) =>
        api.get(`/vulnerability/${pid}`).catch(() => ({ data: { data: [] } }))
      );
      const vulnResults = await Promise.all(vulnPromises);
      const allVulns = vulnResults.flatMap((res) => res.data.data || []);
      
      // Filter vulnerabilities reported by this user
      const myReportedVulns = allVulns.filter((v: Vulnerability) => {
        const reportedById = typeof v.reportedBy === "object" 
          ? (v.reportedBy._id || v.reportedBy.id) 
          : v.reportedBy;
        return reportedById === userId || reportedById?.toString() === userId;
      });
      setMyVulnerabilities(myReportedVulns);
      
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching member data:", err);
      setLoading(false);
    }
  };

  const getSeverityCount = (severity: string) => {
    return myVulnerabilities.filter((v) => v.severity === severity).length;
  };

  const getStatusCount = (status: string) => {
    return myVulnerabilities.filter((v) => v.status === status).length;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Your assigned projects and reported vulnerabilities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/dashboard/projects"
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-200">
                <Folder className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors duration-200" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{projects.length}</h3>
            <p className="text-gray-600 text-sm">Assigned Projects</p>
          </Link>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{myVulnerabilities.length}</h3>
            <p className="text-gray-600 text-sm">My Reports</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {getStatusCount("resolved") + getStatusCount("closed")}
            </h3>
            <p className="text-gray-600 text-sm">Resolved</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{getStatusCount("open")}</h3>
            <p className="text-gray-600 text-sm">Pending</p>
          </div>
        </div>

        {/* My Vulnerability Reports */}
        {myVulnerabilities.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Vulnerability Reports</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
            <div className="space-y-2">
              {myVulnerabilities.slice(0, 5).map((vuln) => {
                const project = projects.find((p) => p._id === vuln.projectId?._id || p._id === vuln.projectId);
                const severityColors: Record<string, string> = {
                  critical: "bg-red-100 text-red-700 border-red-200",
                  high: "bg-orange-100 text-orange-700 border-orange-200",
                  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
                  low: "bg-green-100 text-green-700 border-green-200",
                };
                const statusColors: Record<string, string> = {
                  open: "bg-blue-100 text-blue-700 border-blue-200",
                  "in-progress": "bg-purple-100 text-purple-700 border-purple-200",
                  resolved: "bg-green-100 text-green-700 border-green-200",
                  closed: "bg-gray-100 text-gray-700 border-gray-200",
                };
                return (
                  <Link
                    key={vuln._id}
                    to={`/dashboard/projects/${vuln.projectId?._id || vuln.projectId}/vulnerabilities/${vuln._id}/edit`}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{vuln.title}</h4>
                      <p className="text-gray-500 text-xs">
                        Project: {project?.title || "Unknown"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[vuln.severity] || ""}`}>
                        {vuln.severity}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[vuln.status] || ""}`}>
                        {vuln.status}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            {myVulnerabilities.length > 5 && (
              <Link
                to="/dashboard/projects"
                className="block mt-4 text-center text-teal-600 hover:text-teal-700 font-medium text-sm"
              >
                View All Reports →
              </Link>
            )}
          </div>
        )}

        {/* Assigned Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Projects</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/dashboard/projects/${project._id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{project.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ml-2 ${
                      project.projectType === "web" ? "bg-blue-100 text-blue-700 border-blue-200" :
                      project.projectType === "mobile" ? "bg-green-100 text-green-700 border-green-200" :
                      "bg-purple-100 text-purple-700 border-purple-200"
                    }`}>
                      {project.projectType}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.desc || "No description"}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Manager: {typeof project.manager === "object" ? project.manager.name : "N/A"}
                    </span>
                    <Link
                      to={`/dashboard/projects/${project._id}/vulnerabilities/add`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      Report Issue
                    </Link>
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

