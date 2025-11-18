import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Trash2, Edit, Plus } from "lucide-react";
import LeftNav from "../../components/navigations/leftNav";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user");
      setUsers(res.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch users.");
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setDeleteLoading(userId);
      await api.delete(`/user/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      setDeleteLoading(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete user.");
      setDeleteLoading(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "member":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <Link
              to="/dashboard/users/add"
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add User
            </Link>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="card">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No users found. Add your first user to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-gray-700 font-semibold">Name</th>
                      <th className="pb-3 text-gray-700 font-semibold">Email</th>
                      <th className="pb-3 text-gray-700 font-semibold">Role</th>
                      <th className="pb-3 text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-gray-900 font-medium">{user.name}</td>
                        <td className="py-4 text-gray-600">{user.email}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/dashboard/users/${user.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteLoading === user.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === user.id ? (
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
