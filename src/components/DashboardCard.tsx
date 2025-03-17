
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: DashboardCardProps) => {
  return (
    <div className={cn(
      "group rounded-lg border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline">
            <h3 className="text-3xl font-semibold leading-tight tracking-tight">
              {value}
            </h3>
            {trend && (
              <div className={cn(
                "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}>
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
