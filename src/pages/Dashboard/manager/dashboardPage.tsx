import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { Folder, Users, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

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
}

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
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
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      
      // Fetch all projects
      const projectsRes = await api.get("/project");
      const allProjects = projectsRes.data.data || [];
      
      // Filter projects where this user is manager
      const managedProjects = allProjects.filter(
        (p: Project) => 
          (p.manager?._id?.toString() === userId) || 
          (p.manager?.toString() === userId) ||
          (typeof p.manager === "object" && p.manager?.id === userId)
      );
      setProjects(managedProjects);

      // Get all unique team members from managed projects
      const allMembers = new Set<string>();
      managedProjects.forEach((p: Project) => {
        if (p.members && Array.isArray(p.members)) {
          p.members.forEach((member: any) => {
            const memberId = typeof member === "object" ? (member._id || member.id) : member;
            if (memberId) allMembers.add(memberId);
          });
        }
      });

      // Fetch user details for team members
      if (allMembers.size > 0) {
        const usersRes = await api.get("/user");
        const allUsers = usersRes.data.data || [];
        const membersData = allUsers.filter((u: any) => allMembers.has(u.id));
        setTeamMembers(membersData);
      }

      // Fetch vulnerabilities for managed projects
      const projectIds = managedProjects.map((p: Project) => p._id);
      const vulnPromises = projectIds.map((pid: string) =>
        api.get(`/vulnerability/${pid}`).catch(() => ({ data: { data: [] } }))
      );
      const vulnResults = await Promise.all(vulnPromises);
      const allVulns = vulnResults.flatMap((res) => res.data.data || []);
      setVulnerabilities(allVulns);
      
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching manager data:", err);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Manage your projects and team</p>
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
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{projects.length}</h3>
            <p className="text-gray-600 text-sm">Managed Projects</p>
          </Link>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{teamMembers.length}</h3>
            <p className="text-gray-600 text-sm">Team Members</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{vulnerabilities.length}</h3>
            <p className="text-gray-600 text-sm">Vulnerabilities</p>
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
            <p className="text-gray-600 text-sm">Resolved Issues</p>
          </div>
        </div>

        {/* Vulnerability Severity Breakdown */}
        {vulnerabilities.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vulnerability Overview</h2>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xl font-bold text-blue-700 mb-1">{getStatusCount("open")}</div>
                <div className="text-xs text-blue-600">Open</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xl font-bold text-purple-700 mb-1">{getStatusCount("in-progress")}</div>
                <div className="text-xs text-purple-600">In Progress</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xl font-bold text-green-700 mb-1">{getStatusCount("resolved")}</div>
                <div className="text-xs text-green-600">Resolved</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-gray-700 mb-1">{getStatusCount("closed")}</div>
                <div className="text-xs text-gray-600">Closed</div>
              </div>
            </div>
          </div>
        )}

        {/* Projects and Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Managed Projects */}
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
              <div className="text-center py-8 text-gray-600">
                <Folder className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No projects assigned to you yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <Link
                    key={project._id}
                    to={`/dashboard/projects/${project._id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <p className="text-gray-600 text-xs line-clamp-1">{project.desc || "No description"}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Members: {project.members?.length || 0}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ml-2 ${
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

          {/* Team Members */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
            </div>

            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No team members assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold">
                        {member.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-gray-500 text-xs">{member.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium border ${
                        member.role === "manager" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        "bg-green-100 text-green-700 border-green-200"
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}