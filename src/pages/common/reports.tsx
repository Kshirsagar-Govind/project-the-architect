import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteVulnerability, fetchVulnerabilities, updateReviewStatusVulnerability } from "../../services/project.services";
import {
  CircleCheckBig,
  SquarePenIcon
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PopupBackground from "../../components/common/popupBackground";
import { approvalStatusBadge, severityBadge } from "../../components/common/statusColorMap";
import { STATUS_CONFIG } from "../../components/common/styles";
import { getCurrentUser } from "../../utils/auth";
import { useAuth } from "../../hooks/useAuth";
import { VulnerabilityReviewUpdatePopup } from "../common/VulnerabilityReviewUpdatePopup";
import { MdDelete, MdEditDocument } from "react-icons/md";

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


function Reports() {
  const { p_id } = useParams();
  const { user } = useAuth();
  const projectId = p_id;
  const permissions = user?.permissions || [];

  const [hideRevoked, setHideRevoked] = useState(true);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery({
    queryKey: ["vulnerability_" + p_id, p_id],
    queryFn: () => fetchVulnerabilities({ projectId: p_id || '', filters: {} }),
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
    <div style={{ padding: "24px" }}>
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
            {
              ["TESTER", "MANAGER"].includes(user?.role) && <th style={th}>Approval Status</th>
            }
            {
              ["TESTER", "MANAGER"].includes(user?.role) && <th style={th}>Action</th>
            }

          </tr>
        </thead>

        <tbody>
          {vulnerabilities.map((vul: any) => {
            if (hideRevoked && vul.status == 'REVOKED') return;
            return (
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

                {["TESTER", "MANAGER"].includes(user?.role) &&
                  <td style={{ ...td }} className="text-center" >
                    <span className="inline-flex items-center gap-3">
                      <span
                        style={{ ...approvalStatusBadge(vul.reviewStatus), width: "fit-content" }}>
                        {vul.reviewStatus.toUpperCase()}
                      </span>
                      {
                        permissions.includes("UPDATE_REVIEW_STATUS") &&
                        <SquarePenIcon
                          onClick={() => { setShowReviewPopup(true); setCurrentReport(vul.id) }}
                          size={'20px'} color="gray" />}
                    </span>
                  </td>}

                <td style={td} className="text-center flex flex-row justify-center items-center">
                  {user?.role == "MANAGER" &&
                    (statusActions[vul.status].length == 0 ?
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
                      }))
                  }

                  {
                    user?.role == "TESTER" &&
                    <>
                      <button
                        disabled={vul.reviewStatus.toUpperCase() == 'APPROVED'}
                        style={actionBtn}
                        // className="bg-primary-dark"
                        onClick={() => navigate(`/tester/submit-report/${projectId}?report_id=${vul.id}`)}
                      >
                        <MdEditDocument className={vul.reviewStatus.toUpperCase() == 'APPROVED' ? "text-gray-300" : "text-primary"} size={'20px'} />
                      </button>
                      <button
                        style={actionBtn}
                        // className="bg-primary-dark"
                        onClick={() => deleteReport.mutate({ reportId: vul.id })}
                      >
                        <MdDelete className="text-primary" size={'20px'} />
                      </button>
                    </>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {
        currentReport && showReviewPopup &&
        <PopupBackground >
          <VulnerabilityReviewUpdatePopup
            onClose={() => { setShowReviewPopup(false) }}
            reportId={currentReport} />
        </PopupBackground >
      }
    </div>
  );
}
export default Reports;
