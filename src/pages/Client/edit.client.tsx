import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import LeftNav from "../../components/navigations/leftNav";

interface Client {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
  address?: string;
}

export default function EditClient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Client>({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client/${id}`);
      const client = res.data.data;
      setFormData({
        name: client.name || "",
        email: client.email || "",
        password: client.password || "",
        company: client.company || "",
        phone: client.phone || "",
        address: client.address || "",
      });
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch client.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(formData,'=======================',e.target.name, e.target.value);
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
      await api.put(`/client/${id}`, formData);
      setSaving(false);
      navigate("/dashboard/clients");
    } catch (err: any) {
      setSaving(false);
      setError(err?.response?.data?.message || "Failed to update client.");
    }
  };

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Client</h1>

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
                  placeholder="Client name"
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
                  placeholder="client@example.com"
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
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Street address"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? "Updating..." : "Update Client"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/clients")}
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
