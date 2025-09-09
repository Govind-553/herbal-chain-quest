import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  level: "green" | "yellow" | "red";
  className?: string;
}

const trustLevels = {
  green: {
    label: "Export Ready",
    bg: "bg-trust-green",
    text: "text-white",
    description: "Meets all quality standards"
  },
  yellow: {
    label: "Under Review", 
    bg: "bg-trust-yellow",
    text: "text-foreground",
    description: "Pending final checks"
  },
  red: {
    label: "Non-Compliant",
    bg: "bg-trust-red", 
    text: "text-white",
    description: "Does not meet standards"
  }
};

export const TrustBadge = ({ level, className }: TrustBadgeProps) => {
  const trust = trustLevels[level];
  
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className={cn(
        "px-3 py-1 rounded-full text-sm font-semibold",
        trust.bg,
        trust.text
      )}>
        {trust.label}
      </div>
      <span className="text-xs text-muted-foreground">{trust.description}</span>
    </div>
  );
};