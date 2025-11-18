import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import LeftNav from "../../components/navigations/leftNav";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User & { password?: string }>({
    name: "",
    email: "",
    role: "member",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user");
      const users = res.data.data || [];
      const user = users.find((u: any) => u.id === id);
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "member",
          password: "",
        });
      }
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch user.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }
    try {
      setSaving(true);
      const updateData: any = { name: formData.name, email: formData.email };
      if (formData.password) {
        updateData.password = formData.password;
      }
      await api.put(`/user/${id}`, updateData);
      setSaving(false);
      navigate("/dashboard/users");
    } catch (err: any) {
      setSaving(false);
      setError(err?.response?.data?.message || "Failed to update user.");
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h1>

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
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password (leave empty to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter new password"
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
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Updating..." : "Update User"}
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
