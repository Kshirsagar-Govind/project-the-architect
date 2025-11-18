import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { Edit, Mail, Building, Phone, MapPin } from "lucide-react";
import LeftNav from "../../components/navigations/leftNav";

interface Client {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewClient() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/client/${id}`);
      setClient(res.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch client.");
      setLoading(false);
    }
  };

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

  if (error || !client) {
    return (
      <>
        <LeftNav />
        <div className="min-h-screen bg-gray-50 p-6 ml-64 flex items-center justify-center">
          <div className="text-red-600">{error || "Client not found."}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <LeftNav />
      <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Client Details</h1>
            <Link
              to={`/dashboard/clients/${id}/edit`}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Client
            </Link>
          </div>

          <div className="card">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{client.name}</h2>
                <p className="text-gray-500 text-sm">
                  Created: {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{client.email}</p>
                  </div>
                </div>

                

                {client.company && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company</p>
                      <p className="text-gray-900 font-medium">{client.company}</p>
                    </div>
                  </div>
                )}

                {client.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-900 font-medium">{client.phone}</p>
                    </div>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="text-gray-900 font-medium">{client.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Link
                  to="/dashboard/clients"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  ← Back to Clients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
