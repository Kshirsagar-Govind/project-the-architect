import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

interface Client {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
}

export default function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    projectType: "web",
    client: "",
    manager: "",
    members: [] as string[],
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [clientsRes, usersRes] = await Promise.all([
        api.get("/client"),
        api.get("/user"),
      ]);
      setClients(clientsRes.data.data || []);
      setUsers(usersRes.data.data || []);
      setFetching(false);
    } catch (err: any) {
      setError("Failed to fetch data.");
      setFetching(false);
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
      setLoading(true);
      console.log(formData,'==============================formData');
      
      await api.post("/project", formData);
      setLoading(false);
      navigate("/dashboard/projects");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to create project.");
    }
  };

  if (fetching) {
    return (
      <>
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Project</h1>

          <div className="card">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
              <label className="text-sm font-medium text-gray-300 mb-1 block">Description</label>
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
              <label className="text-sm font-medium text-gray-300 mb-1 block">Client *</label>
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
                <div className="max-h-40 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-3 space-y-2">
                  {users.map((user) => (
                    <label key={user._id} className="flex items-center gap-2 text-gray-900 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.members.includes(user._id)}
                        onChange={() => handleMemberToggle(user._id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>{user.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? "Creating..." : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/projects")}
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

