import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  status: "normal" | "warning" | "danger";
  icon: React.ReactNode;
}

export const HealthMetricCard = ({ title, value, unit, trend, status, icon }: HealthMetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "text-health-success";
      case "warning":
        return "text-health-warning";
      case "danger":
        return "text-health-danger";
      default:
        return "text-health-info";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return status === "danger" ? "text-health-danger" : "text-health-success";
      case "down":
        return status === "danger" ? "text-health-success" : "text-health-danger";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 shadow-card-custom transition-smooth hover:shadow-health hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-primary/10 ${getStatusColor()}`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${getStatusColor()}`}>{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
      </div>
    </Card>
  );
};