import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import '../../index.css'

export default function RegisterClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    contactNumber: "",
    address: "",
    country: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      await api.post("/client", {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.contactNumber,
        address: formData.address,
        country: formData.country,
        website: formData.website,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
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
            <p className="text-gray-600">Your client account has been created. Please contact admin for login credentials.</p>
          </div>
          <Link to="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Registration</h1>
          <p className="text-sm text-gray-600">Register as a client to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Company Inc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input-field"
                placeholder="United States"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="input-field"
              placeholder="https://www.company.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="Street address, City, State"
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            <p className="font-medium mb-1">Note:</p>
            <p>After registration, please contact the administrator to set up your login credentials.</p>
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
                Registering...
              </div>
            ) : (
              'Register as Client'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

