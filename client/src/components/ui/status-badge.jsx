import { cva } from "class-variance-authority";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock, 
  faCheck, 
  faBoxOpen, 
  faCheckDouble, 
  faBan,
  faCircle
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors",
  {
    variants: {
      status: {
        placed: "bg-blue-50 text-blue-700 border-blue-200",
        accepted: "bg-amber-50 text-amber-800 border-amber-200",
        ready: "bg-purple-50 text-purple-700 border-purple-200",
        completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
        cancelled: "bg-rose-50 text-rose-700 border-rose-200",
        default: "bg-earth-100 text-earth-700 border-earth-300",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

const statusIcons = {
  placed: faClock,
  accepted: faCheck,
  ready: faBoxOpen,
  completed: faCheckDouble,
  cancelled: faBan,
};

function StatusBadge({ status = "placed", label, showIcon = true, className }) {
  const normalizedStatus = status?.toLowerCase() || "default";
  const icon = statusIcons[normalizedStatus] || faCircle;
  const displayLabel = label || normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  return (
    <span className={cn(badgeVariants({ status: normalizedStatus }), className)}>
      {showIcon && <FontAwesomeIcon icon={icon} className="text-[10px]" />}
      <span>{displayLabel}</span>
    </span>
  );
}

export { StatusBadge, badgeVariants };
