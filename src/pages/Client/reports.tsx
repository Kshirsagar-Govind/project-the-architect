import { useQuery } from "@tanstack/react-query";
import { fetchVulnerabilities } from "../../services/project.services";
import {
  AlertCircle,
  RefreshCcw,
  Wrench,
  BadgeCheck,
  CircleCheckBig
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getUser } from "../../utils/auth";

const table = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  borderRadius: "8px",
  overflow: "hidden",
};

const th = {
  padding: "10px 12px",
  backgroundColor: "#4DB6AC",
  color: "#fff",
  fontSize: "14px",
  fontWeight: '400'
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
};

const row = {
  transition: "background 0.2s",
};

const actionBtn = {
  padding: "0 5px",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};
const statusActions = {
  OPEN: ["IN-PROGRESS"],
  "IN-PROGRESS": ["FIXED"],
  FIXED: ["VERIFIED"],
  CLOSED: [],
};

const STATUS_CONFIG = {
  open: { tooltip: "Change to open", color: "#fbbf24", icon: <AlertCircle color="#fbbf24" size={'22px'} /> },
  "IN-PROGRESS": { tooltip: "Change to In-progress", color: "#3b82f6", icon: <RefreshCcw color="#60a5fa" size={'22px'} /> },
  FIXED: { tooltip: "Change to Fixed", color: "#6366f1", icon: <Wrench color="#818cf8" size={'22px'} /> },
  VERIFIED: { tooltip: "Change to Verified", color: "#22c55e", icon: <BadgeCheck color="#4ade80" size={'22px'} /> },
  CLOSED: { tooltip: "Change to Closed", color: "#16a34a", icon: <CircleCheckBig color="#22c55e" size={'22px'} /> },
};

const severityBadge = (severity: string) => {
  const colors: any = {
    critical: "rgba(220, 38, 38, 0.7)", // soft red
    high: "rgba(249, 115, 22, 0.7)",    // soft orange
    medium: "rgba(250, 204, 21, 0.7)",  // soft yellow
    low: "rgba(22, 163, 74, 0.7)",      // soft green
  }
    ;

  return {
    backgroundColor: colors[severity] || "#6b7280",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  };
};


export default function Reports() {
  const { p_id } = useParams()
  const user = getUser()
  const projectId = p_id || "";

  const { data, error, isLoading } = useQuery({
    queryKey: ["vulnerability_"+user.id, projectId],
    queryFn: () => fetchVulnerabilities({ projectId, filters: {reviewStatus:"APPROVED"} }),
    staleTime: 0,
  });

  if (error) return <p>Error while fetching reports</p>;

  const vulnerabilities = data?.data || [];
  console.log(data,'<<=');
  
  return (
    <div >
      <h2 className="text-xl pb-4">Vulnerability Reports</h2>
      <table style={table}>
        <thead>
          <tr>
            <th style={th} className="text-left">Title</th>
            <th style={th} className="text-left">Type</th>
            <th style={th} className="text-center">Severity</th>
            <th style={th}>Status</th>
            <th style={th}>CVSS</th>
            <th style={th}>Endpoint</th>
            <th style={th}>Status</th>
            <th style={th}>Reported On</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {
            isLoading ?
              <tr style={row}>
                <td style={td} colSpan={8} className="text-center text-xl">Fetching report</td>
              </tr>
              :
              (data.data.length == 0) ?
                <tr style={row}>
                  <td style={td} colSpan={8} className="text-center text-xl">No vulnerabilities found</td>
                </tr>
                :
                vulnerabilities.map((vul) => (
                  <tr key={vul._id} style={row}>
                    <td style={td}>{vul.title}</td>
                    <td style={td}>{vul.vulnerabilityType}</td>

                    <td style={td} className="text-center">
                      <span style={severityBadge(vul.severity)}>
                        {vul.severity.toUpperCase()}
                      </span>
                    </td>

                    <td style={td} className="text-center">{vul.status}</td>
                    <td style={td} className="text-center">{vul.cvss}</td>
                    <td style={td} className="text-center">{vul.affectedEndpoint}</td>

                    <td style={td} className="text-center">
                      {new Date(vul.createdAt).toLocaleDateString()}
                    </td>

                    <td style={td} className="text-center flex flex-row justify-center items-center">
                      {
                        statusActions[vul.status].length == 0 ?
                          <button disabled>
                            <CircleCheckBig size={'22px'} color="gray" />
                          </button>
                          : statusActions[vul.status].map(item => {
                            return (
                              <div
                                title={item.tooltip}
                                className="">
                                <button
                                  className="px-1">
                                  {STATUS_CONFIG[item].icon}
                                </button>
                              </div>
                            )
                          })
                      }

                    </td>
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
}
