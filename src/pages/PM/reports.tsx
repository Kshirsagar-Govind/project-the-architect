import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchVulnerabilities, updateReviewStatusVulnerability } from "../../services/project.services";
import {
  AlertCircle,
  RefreshCcw,
  Wrench,
  BadgeCheck,
  CircleCheckBig
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import PopupBackground from "../../components/common/popupBackground";

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
    CRITICAL: "rgba(220, 38, 38, 0.7)", // soft red
    HIGH: "rgba(249, 115, 22, 0.7)",    // soft orange
    MEDIUM: "rgba(250, 204, 21, 0.7)",  // soft yellow
    LOW: "rgba(22, 163, 74, 0.7)",      // soft green
  };

  return {
    backgroundColor: colors[severity] || "#6b7280",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  };

};

const approvalStatusBadge = (status: string) => {
  const colors: any = {
    REJECTED: "rgba(220, 38, 38, 0.7)", // soft red
    PENDING: "rgba(249, 115, 22, 0.7)",    // soft orange
    DUPLICATE: "rgba(250, 204, 21, 0.7)",  // soft yellow
    APPROVED: "rgba(22, 163, 74, 0.7)",      // soft green
  };
  return {
    backgroundColor: colors[status] || "#6b7280",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
  };

}

function Reports() {
  const { p_id } = useParams()
  const [hideRevoked, setHideRevoked] = useState(true);
  const [currentReport, setCurrentReport] = useState(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["vulnerability_" + p_id, p_id],
    queryFn: () => fetchVulnerabilities({ projectId: p_id || '', filters: {} }),
    staleTime: 0,
  });
  console.log(data, '<----report');




  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>Error while fetching reports</p>;

  const vulnerabilities = data?.data || [];

  if (vulnerabilities.length === 0) {
    return <p>No vulnerabilities found</p>;
  }
  console.log(vulnerabilities, "vulnerabilitiesvulnerabilities");


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
            <th style={th}>Approval Status</th>
            <th style={th}>Action</th>
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

                <td style={{ ...td }} className="text-center" >
                  <span 
                  onClick={()=>{setShowReviewPopup(true);setCurrentReport(vul.id)}}
                  style={approvalStatusBadge(vul.reviewStatus)}>
                    {vul.reviewStatus.toUpperCase()}
                  </span>
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
            )
          })}
        </tbody>
      </table>
      {
        currentReport && showReviewPopup &&
        <PopupBackground >
          <VulnerabilityReviewUpdatePopup 
          onClose={()=>{setShowReviewPopup(false)}} 
          reportId={currentReport} />
        </PopupBackground >

      }
    </div>
  );
}

const VulnerabilityReviewUpdatePopup = ({
  onClose,
  reportId,
}: {
  onClose: () => void;
  reportId: string;
}) => {
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  

    const updateReviewStatus = useMutation({
    mutationFn: updateReviewStatusVulnerability,
    onSuccess: () => {
      console.log('Deleted');
    },
    onError: (e: any) => {
      console.log("ERROR", e);
    },
  })

  return (
    <section className="rounded-md bg-white max-h-[80vh] overflow-y-auto min-w-[400px] p-5">
      <h2 className="text-lg font-semibold mb-4">
        Update Vulnerability Review
      </h2>

      {/* Status Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Review Status
        </label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="APPROVED">APPROVED</option>
          <option value="DUPLICATE">DUPLICATE</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Comment Box */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Comment
        </label>
        <textarea
          className="w-full border rounded px-3 py-2 outline-none"
          rows={4}
          placeholder="Add comment (required for Reject / Duplicate)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 border rounded"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-primary-dark text-white rounded"
          onClick={()=>updateReviewStatus.mutate({reviewStatus:status,comment,reportId})}
        >
          Submit
        </button>
      </div>
    </section>
  );
};


export default Reports;
/*

*/