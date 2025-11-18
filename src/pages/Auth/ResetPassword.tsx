import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import '../../index.css'

export default function ResetPassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!oldPassword || !newPassword) {
      setError("Please provide both old and new passwords.");
      return;
    }
    if (oldPassword === newPassword) {
      setError("New password must be different from old password.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/reset-password", { oldPassword, newPassword });
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Architect</h1>
          <p className="text-sm text-gray-600">Change your password</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Password updated successfully!
            </div>
            <Link
              to="/auth/login"
              className="block text-center text-teal-600 hover:text-teal-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Old Password</label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-field pr-20"
                  placeholder="Enter old password"
                  aria-label="Old Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {showOldPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pr-20"
                  placeholder="Enter new password"
                  aria-label="New Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Password'
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              <Link to="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
