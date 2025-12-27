import { useQuery } from "@tanstack/react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { fetchClients } from "../../services/client.services";

type Client = {
  id: number;
  name: string;
  email: string;
  company: string;
  accountStatus: "ACTIVE" | "PENDING" | 'BLOCKED' | 'DELETED';
};



export default function Clients() {

  const { data, error, isLoading } = useQuery({ queryKey: ['client', ''], queryFn: fetchClients })

  // console.log(data, '<<<<<<<clients');

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Clients
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Client
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
                Company
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
            isLoading?
            <tr>
              <th>Loading...</th>
            </tr>
            :data.map((client:Client) => (
              <tr
                key={client.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {client.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {client.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {client.company}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium
                      ${client.accountStatus === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {client.accountStatus}
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
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
