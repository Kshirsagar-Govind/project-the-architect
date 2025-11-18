import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LeftNav from "../../components/navigations/leftNav";

export default function AddUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/user", formData);
      setLoading(false);
      navigate("/dashboard/users");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <>
      <LeftNav />
      <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New User</h1>

          <div className="card">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="User name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/users")}
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
