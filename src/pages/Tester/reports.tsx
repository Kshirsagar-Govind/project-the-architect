import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteVulnerability, fetchVulnerabilities } from "../../services/project.services";
import { getUser } from "../../utils/auth";
import { MdEditDocument, MdDelete } from "react-icons/md"
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from "react";
import { approvalStatusBadge, severityBadge } from "../../components/common/statusColorMap";

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
  const [hideRevoked, setHideRevoked] = useState(true);

  const projectId = p_id;
  const user = getUser();
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["vulnerability", projectId],
    queryFn: () => fetchVulnerabilities({ projectId, filters: { reportedBy: user.id } }),
    staleTime: 0,
  });


  const deleteReport = useMutation({
    mutationFn: deleteVulnerability,
    onSuccess: () => {
      console.log('Deleted');
    },
    onError: (e: any) => {
      console.log("ERROR", e);
    },
  })

  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>Error while fetching reports</p>;

  const vulnerabilities = data?.data || [];

  if (vulnerabilities.length === 0) {
    return <p>No vulnerabilities found</p>;
  }

  return (
    <div style={{ paddingBottom: "24px" }}>
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
            <th style={th}>Reported On</th>
            <th style={th}>Review Status</th>
            <th style={th} className="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {vulnerabilities.map((vul) => {
            if(hideRevoked && vul.status=='REVOKED') return;
            return (
              <tr key={vul.id} style={row} >
                <td style={td} className="pl-2">{vul.title}</td>
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
                <td style={td} className="text-center">
                  <span 
                  style={approvalStatusBadge(vul.reviewStatus)}>
                    {vul.reviewStatus.toUpperCase()}
                  </span>
                </td>

                <td style={td} className="text-center flex flex-row justify-center items-center">
                  <button
                    disabled={vul.reviewStatus.toUpperCase()=='APPROVED'}
                    style={actionBtn}
                    // className="bg-primary-dark"
                    onClick={() => navigate(`/tester/submit-report/${projectId}?report_id=${vul.id}`)}
                  >
                    <MdEditDocument className={vul.reviewStatus.toUpperCase()=='APPROVED'?"text-gray-300":"text-primary"} size={'20px'} />
                  </button>
                  <button
                    style={actionBtn}
                    // className="bg-primary-dark"
                    onClick={() => deleteReport.mutate({ reportId: vul.id })}
                  >
                    <MdDelete className="text-primary" size={'20px'} />
                  </button>
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>
    </div>
  );
}
