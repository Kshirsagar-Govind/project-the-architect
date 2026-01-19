import {
  AlertCircle,
  RefreshCcw,
  Wrench,
  BadgeCheck,
  CircleCheckBig
} from "lucide-react";

export const STATUS_CONFIG = {
  OPEN: { tooltip: "Change to open", color: "#fbbf24", icon: <AlertCircle color="#fbbf24" size={'22px'} /> },
  "IN-PROGRESS": { tooltip: "Change to In-progress", color: "#3b82f6", icon: <RefreshCcw color="#60a5fa" size={'22px'} /> },
  FIXED: { tooltip: "Change to Fixed", color: "#6366f1", icon: <Wrench color="#818cf8" size={'22px'} /> },
  VERIFIED: { tooltip: "Change to Verified", color: "#22c55e", icon: <BadgeCheck color="#4ade80" size={'22px'} /> },
  CLOSED: { tooltip: "Change to Closed", color: "#16a34a", icon: <CircleCheckBig color="#22c55e" size={'22px'} /> },
};