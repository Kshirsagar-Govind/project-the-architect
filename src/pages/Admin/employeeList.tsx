import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { fetchUsers, updateUser } from "../../services/users.services";
import { useState } from "react";
import PopupBackground from "../../components/common/popupBackground";
import toast from "react-hot-toast";

type Tester = {
  _id:string;
  id: string;
  name: string;
  email: string;
  role: 'TESTER' | 'MANAGER'
  accountStatus: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'DELETED';
};

const role = "TESTER";
export default function Employees() {
  const [selectedTester, setTester] = useState<Tester>();
  const [editing, setEditing] = useState<boolean>(false);
  const QueryClient = useQueryClient()
  const {
    data: testers = [],
    isLoading,
    error
  } = useQuery(
    {
      queryKey: ["user", role],
      queryFn: () => fetchUsers(role),
      staleTime: 1000 * 60 * 5
    });

  const updateTester = useMutation({
    mutationFn: updateUser,
    onSuccess: () => { 
      toast.success('User updated!')
      QueryClient.invalidateQueries({queryKey:['user', role]})
      setEditing(false);
     },
    onError: () => { 
      toast.error('User updating failed!')
    },
  })

  console.log(testers,"testerstesters");
  

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Employees
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Employees
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
            {isLoading ?
              <tr className="w-full">
                <td>
                Loading...
                </td>
                </tr>
              : testers.map((user: Tester) => (
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
                      onClick={()=>{setEditing(true); setTester(user)}}
                        className="p-2 rounded hover:bg-blue-50 text-blue-600"
                        title="Edit Employee"
                      >
                        <FiEdit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                        title="Delete Employee"
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
      {editing && selectedTester &&
        (<PopupBackground>
          <EditForm 
          tester={selectedTester} 
          onClose={()=>setTester(undefined)}
          onSubmit={(payload)=>updateTester.mutate({id:selectedTester._id,payload})}
          />
        </PopupBackground>)
        }
    </div>
  );
}
type EditFormProps = {
  tester: Tester;
  onClose: () => void;
  onSubmit: (data: Partial<Tester>) => void;
};

const EditForm = ({ tester, onClose, onSubmit }: EditFormProps) => {
  const [form, setForm] = useState({
    name: tester.name,
    role: tester.role,
    accountStatus: tester.accountStatus
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSubmit({
      id: tester.id,
      ...form
    });
  };

  return (
    <div className="bg-white p-6 rounded-md w-96">
      <h3 className="text-lg font-semibold mb-4">Edit Employee</h3>

      <div className="space-y-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />

        <select
          name="accountStatus"
          value={form.accountStatus}
          onChange={handleChange}
          className="input-field"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="input-field"
        >
          <option value="MEMBER">MEMBER</option>
          <option value="MANAGER">MANAGER</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
      </div>
    </div>
  );
};
