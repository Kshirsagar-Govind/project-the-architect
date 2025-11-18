import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import '../../index.css'

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Please provide your email address.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/forget-password", { email });
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Architect</h1>
          <p className="text-sm text-gray-600">Reset your password</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Password reset email sent! Please check your inbox.
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
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@company.com"
                  aria-label="Email"
                  required
                />
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
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
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
