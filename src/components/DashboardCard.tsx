
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string | ReactNode;
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
      "group rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md relative overflow-hidden",
      className
    )}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-xl"></div>
      <div className="absolute -left-6 -bottom-6 h-20 w-20 rounded-full bg-primary/5 blur-lg"></div>
      
      <div className="flex justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline">
            <h3 className="text-2xl font-bold leading-tight tracking-tight">
              {value}
            </h3>
            {trend && (
              <div className={cn(
                "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                trend.isPositive
                  ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"
              )}>
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {description && (
            <div className="mt-1 text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {icon}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-36 h-36 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-300 -mt-10 -mr-10">
        {icon && React.cloneElement(icon as React.ReactElement, {
          className: "w-full h-full"
        })}
      </div>
    </div>
  );
};

export default DashboardCard;
