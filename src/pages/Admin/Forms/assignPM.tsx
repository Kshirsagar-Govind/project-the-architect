import { useState } from 'react'
import { fetchUsers } from '../../../services/users.services';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ButtonSpinner } from '../../../components/common/buttonSpinner';
import toast from 'react-hot-toast';
import { AssignPM } from '../../../services/project.services';
type AMProps = {
    onClose: () => void;
    projectId: string;
};


export default function AssignManager({ onClose, projectId }: AMProps) {
    const [manager, setManager] = useState("");
    const [saving, setSaving] = useState(false);
    const QueryClient = useQueryClient()

    const {
        data: managers = [],
        isLoading,
        error
    } = useQuery(
        {
            queryKey: ["user", "MANAGER"],
            queryFn: () => fetchUsers("MANAGER"),
        });


    const assignProjectManager = useMutation({
        mutationFn: AssignPM,
        onSuccess: () => {
            setSaving(false);
            toast.success('PM assigned successfully!', { duration: 2000, position: 'top-center' })
            QueryClient.invalidateQueries({ queryKey: ['project', ''] })
        },
        onError: () => {
            setSaving(false);
            toast.error('User updating failed!');
        },
    })

    // onSubmit={(payload)=>updateTester.mutate({id:selectedTester._id,payload})}
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        assignProjectManager.mutate({ p_id: projectId, pm_id: manager })
    }

    return (
        <div className="bg-white py-5 px-10 rounded-md">
            <div>
                <h4>
                    Assign Manager
                </h4>
            </div>
            {
                isLoading ?
                    <p>Loading...</p>
                    :
                    <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Manager *</label>
                            <select
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Select a manager</option>
                                {managers.map((user: { _id: string, name: string }) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={onClose}
                                type="button"
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className={`flex-1 min-w-40 flex justify-center btn-primary ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {saving ? (
                                    <ButtonSpinner text={'assigning...'} />
                                ) : (
                                    'Assign Manager'
                                )}
                            </button>

                        </div>
                    </form>
            }
        </div>
    )
}
