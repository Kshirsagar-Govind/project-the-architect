import api from "../api/axios";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'MEMBER' | 'MANAGER'
  accountStatus: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'DELETED';
};


export const fetchUsers = async (role: string) => {
    const res = await api.get("/user", {
        params: { role },
    });
    return res.data.data;
};

export const updateUser = async ({id, payload}:{id:string,payload:Partial<User>}) => {
  const res = await api.put(`/user/${id}`,payload)
  return res.data;  
}