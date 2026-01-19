import api from "../api/axios"

export const addNewProject=async (payload:any) => {
    const res = await api.post(`/project`,payload)
    return res.data.data;
}

export const fetchProjects = async (filters: any) => {
    const params = new URLSearchParams();
    if (filters.title) params.append("title", filters.title);
    if (filters.clientEmail) params.append("clientEmail", filters.clientEmail);
    if (filters.status) params.append("status", filters.status);
    if (filters.manager!='') params.append("manager", filters.manager);
    if (filters.member!='') params.append("member", filters.member);
    if (filters.client!='') params.append("client", filters.client);
    
    const res = await api.get(`/project?${params.toString()}`)
    return res.data.data;
}

export const AssignPM = async ({p_id,pm_id}:{p_id: string, pm_id: string}) => {
    const res = await api.put(`/project/${p_id}/assign-manager`, { manager: pm_id });
    return res;
}

export const updateProject=async (payload:object,p_id:string) => {
    const res = await api.put(`/project/${p_id}`, payload);
    return res.data;
}

export const assignMembersProject=async (payload:object,p_id:string) => {
    const res = await api.put(`/project/${p_id}/assign-members`, payload);
    return res.data;
}


export const fetchVulnerabilities=async ({projectId,filters}:{projectId: string, filters:any}) => {
    const params = new URLSearchParams();
    if (filters.reportedBy) params.append("reportedBy", filters.reportedBy);
    if (filters.reviewStatus) params.append("reviewStatus", filters.reviewStatus);
    const res = await api.get(`/vulnerability/${projectId}${params.toString().length>0?'?'+params.toString():''}`);
    return res.data;
}

export const fetchVulnerabilitiesStats=async ({projectId}:{projectId: string}) => {
    const res = await api.get(`/vulnerability/${projectId}/stats`);
    return res.data.data;
}


export const deleteVulnerability=async ({reportId}:{reportId: string}) => {
    const res = await api.patch(`/vulnerability/${reportId}/delete`);
    return res.data;
}

export const createVulnerability = async ({projectId,report}:{projectId: string, report:any}) => {
    const res = await api.post(`/vulnerability/${projectId}`, report);
    return res.data.data;
}


export const fetchVulnerability=async ({projectId,reportId}:{projectId: string,reportId:string}) => {
    const res = await api.get(`/vulnerability/${projectId}/${reportId}`);
    return res.data.data;
}

export const updateReviewStatusVulnerability=async ({reviewStatus, comment,reportId}:{reviewStatus:string, comment:string, reportId:string}) => {
    const res = await api.patch(`/vulnerability/${reportId}/update-review-status`,{reviewStatus, comment});
    return res.data;
}
