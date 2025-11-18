import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { Folder, Building, Users, Shield, AlertCircle, CheckCircle, Plus, TrendingUp } from "lucide-react";

interface Stats {
  projects: number;
  clients: number;
  users: number;
  vulnerabilities: number;
  criticalVulns: number;
  resolvedVulns: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    clients: 0,
    users: 0,
    vulnerabilities: 0,
    criticalVulns: 0,
    resolvedVulns: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes, usersRes] = await Promise.all([
        api.get("/project"),
        api.get("/client"),
        api.get("/user"),
      ]);

      const projects = projectsRes.data.data || [];
      const clients = clientsRes.data.data || [];
      const users = usersRes.data.data || [];

      // Fetch vulnerabilities from all projects
      let allVulns: any[] = [];
      for (const project of projects) {
        try {
          const vulnRes = await api.get(`/vulnerability/${project._id}`);
          allVulns = [...allVulns, ...(vulnRes.data.data || [])];
        } catch (e) {
          // Project might not have vulnerabilities
        }
      }

      setStats({
        projects: projects.length,
        clients: clients.length,
        users: users.length,
        vulnerabilities: allVulns.length,
        criticalVulns: allVulns.filter((v) => v.severity === "critical").length,
        resolvedVulns: allVulns.filter((v) => v.status === "resolved" || v.status === "closed").length,
      });
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch dashboard data.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 ml-64 flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Complete overview of the platform</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Stats Cards */}
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
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.projects}</h3>
            <p className="text-gray-600 text-sm">Total Projects</p>
          </Link>

          <Link
            to="/dashboard/clients"
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                <Building className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.clients}</h3>
            <p className="text-gray-600 text-sm">Total Clients</p>
          </Link>

          <Link
            to="/dashboard/users"
            className="card hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors duration-200">
                <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors duration-200" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.users}</h3>
            <p className="text-gray-600 text-sm">Total Users</p>
          </Link>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.vulnerabilities}</h3>
            <p className="text-gray-600 text-sm">Total Vulnerabilities</p>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Security Status</h2>
              <Shield className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700 font-medium">Critical Issues</span>
                </div>
                <span className="text-2xl font-bold text-red-700">{stats.criticalVulns}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">Resolved Issues</span>
                </div>
                <span className="text-2xl font-bold text-green-700">{stats.resolvedVulns}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/dashboard/projects/add"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-teal-50 hover:border-teal-300 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-teal-600" />
                </div>
                <span className="text-gray-900 font-medium text-sm">New Project</span>
              </Link>
              <Link
                to="/dashboard/clients/add"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-900 font-medium text-sm">New Client</span>
              </Link>
              <Link
                to="/dashboard/users/add"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-900 font-medium text-sm">New User</span>
              </Link>
              <Link
                to="/dashboard/users"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-900 font-medium text-sm">Manage Users</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Activity log feature coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

