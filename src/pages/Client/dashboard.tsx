import { useQuery } from "@tanstack/react-query"
import { fetchProjects } from "../../services/project.services"
import { getUser } from "../../utils/auth"
import ProjectCard from "../../components/common/projectCard";

export default function Dashboard() {
    const user = getUser();
    console.log(user, 'useruser');
    const {
        data,
        error,
        isLoading }
        = useQuery(
            {
                queryKey: ['project_'+user.id, user.id],
                queryFn: () => fetchProjects({ client: user.id }),
                enabled: !!user.id
            })

    return (
        <div>
            {
                isLoading ?
                    <h1>Loading...</h1> :
                    data.length > 0 ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.map(pro => {
                                return (<><ProjectCard role={'CLIENT'} project={pro} /></>)
                            })}
                        </div>
                        :
                        <h1>No Projects assigned</h1>
            }
        </div>
    )
}
