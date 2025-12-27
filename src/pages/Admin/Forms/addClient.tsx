import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgCloseO } from "react-icons/cg";

export default function AddClient({onClose}) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
        contactNumber: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.email) {
            setError("Name and email are required.");
            return;
        }
    };

    return (
        <section className="rounded-md  bg-white max-h-[80vh] overflow-y-auto min-w-full">
            
            <div className="px-7">

                <h1 className="pt-5 text-2xl font-semibold text-gray-900 mb-4">
                    Add New Client
                </h1>

            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4 w-100  px-7"
            >
                {/* Name */}
                <div>
                    <label className="">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field mt-2"
                        placeholder="Client name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field  mt-2"
                        placeholder="client@example.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="form-label">Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field  mt-2"
                    />
                </div>

                {/* Company */}
                <div>
                    <label className="form-label">Company</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field  mt-2"
                    />
                </div>

                {/* Contact */}
                <div>
                    <label className="form-label">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="input-field  mt-2"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="input-field  mt-2 resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-3 py-3 sticky bottom-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary px-6"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1"
                    >
                        {loading ? "Creating..." : "Create Client"}
                    </button>


                </div>
            </form>
        </section>
    );
}
