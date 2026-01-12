import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import '../../index.css'

export default function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "tester",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/user", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: (formData.role).toUpperCase(),
      });
      
      // Save token
      localStorage.setItem("token", res.data.token);
      
      // Fetch user info to get full user data including ID
      try {
        const usersRes = await api.get("/user");
        const users = usersRes.data.data || [];
        const createdUser = users.find((u: any) => u.email === formData.email);
        
        if (createdUser) {
          localStorage.setItem("user", JSON.stringify(createdUser));
        } else {
          // Fallback: store partial user info
          const user = {
            name: formData.name,
            email: formData.email,
            role: formData.role.toUpperCase(),
          };
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (e) {
        // If fetch fails, store partial user info
        const user = {
          name: formData.name,
          email: formData.email,
          role: formData.role.toUpperCase(),
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      setLoading(false);
      setSuccess(true);
      
      // Redirect based on role
      setTimeout(() => {
        if (formData.role === "ADMIN") {
          navigate("/dashboard/admin");
        } else if (formData.role === "MANAGER") {
          navigate("/dashboard/manager");
        } else if (formData.role === "MEMBER") {
          navigate("/dashboard/tester");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to register. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600">Your account has been created. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Registration</h1>
          <p className="text-sm text-gray-600">Register as Manager or Member</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="john@company.com"
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
              <option value="" hidden >Select</option>
              <option value="tester">Tester</option>
              <option value="manager">Manager</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Select your role: Member or Manager</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-20"
                placeholder="Enter password (min. 6 characters)"
                required
                minLength={6}
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pr-20"
                placeholder="Confirm password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
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
                Registering...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Sign in
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/auth/register-client" className="text-sm text-gray-600 hover:text-gray-900">
            Register as Client instead →
          </Link>
        </div>
      </div>
    </div>
  );
}

