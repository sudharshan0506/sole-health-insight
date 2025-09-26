import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface AIInsight {
  id: string;
  type: "prediction" | "alert" | "recommendation" | "normal";
  title: string;
  message: string;
  confidence: number;
  timestamp: string;
}

interface AIInsightsProps {
  insights: AIInsight[];
}

export const AIInsights = ({ insights }: AIInsightsProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <Brain className="h-5 w-5" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5" />;
      case "recommendation":
        return <Info className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "prediction":
        return "text-primary";
      case "alert":
        return "text-health-danger";
      case "recommendation":
        return "text-health-warning";
      default:
        return "text-health-success";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "alert":
        return "destructive";
      case "prediction":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 shadow-card-custom">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">AI Health Insights</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
            <div className={`p-2 rounded-full bg-background ${getInsightColor(insight.type)}`}>
              {getInsightIcon(insight.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">{insight.title}</h4>
                <Badge variant={getBadgeVariant(insight.type)}>
                  {Math.round(insight.confidence)}% confidence
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{insight.message}</p>
              
              <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>AI is analyzing your health data...</p>
          </div>
        )}
      </div>
    </Card>
  );
};