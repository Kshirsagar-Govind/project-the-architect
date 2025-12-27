import api from "../api/axios"

export const fetchClients = async()=>{
    const res = await api.get('/client');
    return res.data.data;
}