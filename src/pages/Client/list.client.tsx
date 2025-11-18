import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Trash2, Edit, Eye, Plus } from "lucide-react";
import LeftNav from "../../components/navigations/leftNav";

interface Client {
  _id: string;
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/client");
      setClients(res.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch clients.");
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    try {
      setDeleteLoading(id);
      await api.delete(`/client/${id}`);
      setClients(clients.filter((c) => c._id !== id));
      setDeleteLoading(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete client.");
      setDeleteLoading(null);
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

  return (
    <>
      <LeftNav />
      <div className="min-h-screen bg-gray-50 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <Link
              to="/dashboard/clients/add"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Client
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card">
            {clients.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No clients found. Add your first client to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-gray-700 font-semibold">Name</th>
                      <th className="pb-3 text-gray-700 font-semibold">Email</th>
                      <th className="pb-3 text-gray-700 font-semibold">Company</th>
                      <th className="pb-3 text-gray-700 font-semibold">Phone</th>
                      <th className="pb-3 text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-gray-900 font-medium">{client.name}</td>
                        <td className="py-4 text-gray-600">{client.email}</td>
                        <td className="py-4 text-gray-600">{client.company || "-"}</td>
                        <td className="py-4 text-gray-600">{client.phone || "-"}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dashboard/clients/${client._id}`}
                              className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/dashboard/clients/${client._id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(client._id)}
                              disabled={deleteLoading === client._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === client._id ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
