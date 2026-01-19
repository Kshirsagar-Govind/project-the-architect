import { useParams } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchVulnerabilitiesStats } from "../../services/project.services";
import React from "react";


type ReportStatCardProps = {
  severity: string;
  count: number;
};

const ReportStatCard = ({ severity, count }: ReportStatCardProps) => {
  return (
    <div
      className={`h-32 w-32 rounded-xl flex flex-col justify-center items-center shadow-md 
        text-white 
        ${severity == 'HIGH' ? "bg-stats-HIGH" : severity == 'CRITICAL' ? "bg-stats-CRITICAL" : severity == 'MEDIUM' ? "bg-stats-MEDIUM" : "bg-stats-LOW"}`}
    >
      <span className="text-sm font-semibold tracking-wide">
        {severity}
      </span>

      <span className="text-3xl font-bold mt-1">
        {count}
      </span>
    </div>
  );
};


export default function Overview() {
  const { p_id } = useParams()
  const user = getUser()
  const projectId = p_id || "";

  const { data, isError, isLoading } = useQuery({
    queryKey: ["vulnerability_stats_" + user.id, projectId],
    queryFn: () => fetchVulnerabilitiesStats({ projectId }),
    staleTime: 0,
  });
  console.log(data, isError, isLoading);
  if (isLoading) {
    return (
      <div className=""><h1>Loading</h1></div>
    )
  } else if (isError) {
    return (
      <div className=""><h1>Error</h1></div>
    )
  }
  return (<div>
    <section className="flex gap-5">
      {
        !isLoading && !isError && data && data.map(item => <React.Fragment key={item.severity}>{ReportStatCard({ severity: item.severity, count: item.count })}</React.Fragment>)
      }
    </section>
  </div>)
}