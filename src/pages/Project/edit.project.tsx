import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

interface Client {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
}

interface Project {
  title: string;
  desc: string;
  projectType: string;
  client: any;
  manager: any;
  members: any[];
}

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Project & { members: string[] }>({
    title: "",
    desc: "",
    projectType: "web",
    client: "",
    manager: "",
    members: [],
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsRes, usersRes, projectRes] = await Promise.all([
        api.get("/client"),
        api.get("/user"),
        api.get("/project"),
      ]);
      setClients(clientsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      const projects = projectRes.data.data || [];
      const project = projects.find((p: any) => p._id === id);
      if (project) {
        setFormData({
          title: project.title || "",
          desc: project.desc || "",
          projectType: project.projectType || "web",
          client: project.client?._id || project.client || "",
          manager: project.manager?._id || project.manager || "",
          members: project.members?.map((m: any) => m._id || m) || [],
        });
      }
      setLoading(false);
    } catch (err: any) {
      setError("Failed to fetch data.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberToggle = (userId: string) => {
    setFormData({
      ...formData,
      members: formData.members.includes(userId)
        ? formData.members.filter((id) => id !== userId)
        : [...formData.members, userId],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.title || !formData.client || !formData.manager) {
      setError("Title, client, and manager are required.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/project/${id}`, formData);
      setSaving(false);
      navigate("/dashboard/projects");
    } catch (err: any) {
      setSaving(false);
      setError(err?.response?.data?.message || "Failed to update project.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Edit Project</h1>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Project title"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                className="input-field"
                placeholder="Project description"
                rows={4}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Project Type *</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="product">Product</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client *</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Manager *</label>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a manager</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Members</label>
              <div className="max-h-40 overflow-y-auto bg-gray-50 rounded border border-gray-200 p-3 space-y-2">
                {users.map((user) => (
                  <label key={user._id} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={formData.members.includes(user._id)}
                      onChange={() => handleMemberToggle(user._id)}
                      className="accent-teal-600"
                    />
                    <span>{user.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  'Update Project'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/projects")}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

