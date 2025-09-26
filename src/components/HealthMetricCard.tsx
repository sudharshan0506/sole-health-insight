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
        return "text-health-normal";
      case "warning":
        return "text-health-low";
      case "danger":
        return "text-health-high";
      default:
        return "text-health-info";
    }
  };

  const getBackgroundGlow = () => {
    switch (status) {
      case "normal":
        return "shadow-glow";
      case "warning":
        return "shadow-[0_0_30px_hsl(var(--health-low)/0.3)]";
      case "danger":
        return "shadow-[0_0_30px_hsl(var(--health-high)/0.3)]";
      default:
        return "shadow-card-custom";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return status === "danger" ? "text-health-high" : "text-health-normal";
      case "down":
        return status === "danger" ? "text-health-normal" : "text-health-high";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`p-6 bg-gradient-card backdrop-blur-lg border-border/50 transition-bounce hover:scale-105 ${getBackgroundGlow()} animate-float`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-glow backdrop-blur-sm ${getStatusColor()} animate-pulse-glow`}>
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">{title}</h3>
        </div>
        <div className={`flex items-center gap-1 ${getTrendColor()} transition-smooth`}>
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black ${getStatusColor()} tracking-tight`}>{value}</span>
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        </div>
        
        {/* Status indicator */}
        <div className={`h-1 w-full rounded-full bg-gradient-to-r ${
          status === "normal" ? "from-health-normal to-health-normal/50" :
          status === "warning" ? "from-health-low to-health-low/50" :
          "from-health-high to-health-high/50"
        }`} />
      </div>
    </Card>
  );
};