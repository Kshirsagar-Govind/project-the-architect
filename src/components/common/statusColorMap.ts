export const projectStatusStyles: Record<string, string> = {
  "in-progress": "bg-blue-100 text-blue-700",
  "completed": "bg-green-100 text-green-700",
  "hold": "bg-yellow-100 text-yellow-800",
  "inactive": "bg-gray-200 text-gray-700",
}

export const statusActions = {
  OPEN: ["IN-PROGRESS"],
  "IN-PROGRESS": ["FIXED"],
  FIXED: ["VERIFIED"],
  CLOSED: [],
};

export const severityBadge = (severity: string) => {
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

export const approvalStatusBadge = (status: string) => {
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