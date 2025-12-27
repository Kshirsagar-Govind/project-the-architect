import { useQuery } from "@tanstack/react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { fetchUsers } from "../../services/users.services";

type User = {
  id: number;
  name: string;
  email: string;
  company: string;
  accountStatus: "ACTIVE" | "BLOCKED";
};

const role = 'MANAGER';
export default function ProjectManager() {
  const {
    data,
    isLoading,
  } = useQuery(
    {
      queryKey: ["user", role],
      queryFn: () => fetchUsers(role),
    });
  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Managers
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Managers
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">
                Email
              </th>

              <th className="px-4 py-3 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {
              isLoading ?
                <tr className="border-t hover:bg-gray-50">
                  <th className="col-span-full py-2">Fetching managers...</th>
                </tr>
           : data.length>0? data.map((user:User) => (
            <tr
              key={user.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm text-gray-700">
                {user.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {user.email}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium
                      ${user.accountStatus === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {user.accountStatus}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">

                  {/* Edit */}
                  <button
                    className="p-2 rounded hover:bg-blue-50 text-blue-600"
                    title="Edit Client"
                  >
                    <FiEdit size={18} />
                  </button>

                  {/* Delete */}
                  <button
                    className="p-2 rounded hover:bg-red-50 text-red-600"
                    title="Delete Client"
                  >
                    <FiTrash2 size={18} />
                  </button>

                </div>
              </td>
            </tr>
            )):
            <tr className="border-t hover:bg-gray-50">
                  <th className="col-span-full py-2">No managers found.</th>
                </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  );
}
