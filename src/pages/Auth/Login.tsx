import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getCurrentUser } from "../../utils/getCurrentUser";
import '../../index.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {e
    e?.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      // Fetch user info to get role
      const user = await getCurrentUser();
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        
        // Redirect based on role
        const role = user.role;
        if (role == "ADMIN") {
          navigate("/dashboard/admin");
        } else if (role == "MANAGER") {
          navigate("/manager");
        } else if (role == "TESTER") {
          navigate("/tester");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/dashboard");
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Architect</h1>
          <p className="text-sm text-gray-600">Sign in to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-20"
                placeholder="Enter your password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              Remember me
            </label>
            <Link to="/auth/forget-password" className="text-teal-600 hover:text-teal-700 font-medium">
              Forgot password?
            </Link>
          </div>

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
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/register-user" className="text-teal-600 hover:text-teal-700 font-medium">
              Register as Staff
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            <Link to="/auth/register-client" className="text-teal-600 hover:text-teal-700 font-medium">
              Register as Client →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
