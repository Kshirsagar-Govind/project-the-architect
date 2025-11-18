import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LeftNav from "../../components/navigations/leftNav";

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
    company: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setLoading(true);
      await api.post("/client", formData);
      setLoading(false);
      navigate("/dashboard/clients");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to create client.");
    }
  };

  return (
    <>
      <LeftNav />
      <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Client</h1>

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
                  placeholder="client@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Street address"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? "Creating..." : "Create Client"}
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
