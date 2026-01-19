import { useQuery } from "@tanstack/react-query"
import { fetchProjects } from "../../services/project.services"
import ProjectCard from "../../components/common/projectCard";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
    const { user } = useAuth();
    const {
        data,
        error,
        isLoading }
        = useQuery(
            {
                queryKey: ['projects_' + user?.role+"_"+user?.email, user?.id],
                queryFn: () => {

                    const filters = {
                        manager: '',
                        client: '',
                        member: '',
                    };
                    if (user?.role == 'MANAGER') filters.manager = user?.id;
                    else if (user?.role == 'CLIENT') filters.client = user?.id;
                    else if (user?.role == 'TESTER') filters.member = user?.id;
                    console.log(filters, user);
                    

                    
                    return fetchProjects(filters)
                },
                enabled: !!user?.id
            })

    return (
        <div>
            {
                isLoading ?
                    <h1>Loading...</h1> :
                    data && data.length > 0 ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.map((pro:any) => {
                                return (<><ProjectCard role={user?.role||"TESTER"} project={pro} /></>)
                            })}
                        </div>
                        :
                        <h1>No Projects assigned</h1>
            }
        </div>
    )
}
