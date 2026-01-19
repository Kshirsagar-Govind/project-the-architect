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
import { severityBadge } from "../../components/common/statusColorMap";

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
  console.log(data,error, isLoading,'<<=');
  
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
            <th style={th}>Reported On</th>
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
                    <td style={td} className="text-center">
                      {new Date(vul.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
}
