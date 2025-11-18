import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function AddSubscription() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plan: "basic" as "basic" | "standard" | "advanced",
    paymentStatus: "in-progress" as "in-progress" | "cancelled" | "paid",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await api.post(`/plan/subscription/${clientId}`, formData);
      setLoading(false);
      navigate(`/dashboard/clients/${clientId}/subscription`);
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to create subscription.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add Subscription</h1>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Plan *</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Status *</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="in-progress">In Progress</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  'Create Subscription'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/clients/${clientId}`)}
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
