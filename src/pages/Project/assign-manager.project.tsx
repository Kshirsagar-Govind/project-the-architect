import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

interface User {
  _id: string;
  name: string;
}

export default function AssignManager() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manager, setManager] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUsers();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user");
      setUsers(res.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError("Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!manager) {
      setError("Please select a manager.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/project/${id}/assign-manager`, { manager });
      setSaving(false);
      navigate("/dashboard/projects");
    } catch (err: any) {
      setSaving(false);
      setError(err?.response?.data?.message || "Failed to assign manager.");
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Assign Manager</h1>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Manager *</label>
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
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
                  'Assign Manager'
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

