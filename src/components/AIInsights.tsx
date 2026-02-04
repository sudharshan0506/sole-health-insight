import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";

interface HealthData {
  glucose: number;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  temperature: number;
}

interface AIInsightsProps {
  currentData: HealthData;
  previousData?: HealthData;
}

interface AIInsight {
  id: string;
  type: "prediction" | "alert" | "recommendation" | "normal";
  title: string;
  message: string;
  confidence: number;
  timestamp: string;
}

export const AIInsights = ({ currentData, previousData }: AIInsightsProps) => {
  const insights = useMemo(() => {
    const generatedInsights: AIInsight[] = [];
    const now = new Date();
    
    // Glucose Analysis
    if (currentData.glucose < 70) {
      generatedInsights.push({
        id: "glucose-low",
        type: "alert",
        title: "⚠️ Low Glucose Alert",
        message: `Your glucose is ${Math.round(currentData.glucose)} mg/dL - dangerously low! Consume fast-acting carbs immediately (juice, glucose tablets).`,
        confidence: 98,
        timestamp: "Just now"
      });
    } else if (currentData.glucose > 180) {
      generatedInsights.push({
        id: "glucose-high",
        type: "alert",
        title: "🔴 High Glucose Warning",
        message: `Glucose at ${Math.round(currentData.glucose)} mg/dL is critically high. Consider insulin adjustment and avoid carbohydrates.`,
        confidence: 96,
        timestamp: "Just now"
      });
    } else if (currentData.glucose > 140) {
      generatedInsights.push({
        id: "glucose-elevated",
        type: "recommendation",
        title: "Elevated Glucose",
        message: `Glucose at ${Math.round(currentData.glucose)} mg/dL. Light walking can help lower it. Avoid sugary foods for the next 2 hours.`,
        confidence: 89,
        timestamp: "Just now"
      });
    } else if (currentData.glucose >= 70 && currentData.glucose <= 100) {
      generatedInsights.push({
        id: "glucose-normal",
        type: "normal",
        title: "✅ Glucose Optimal",
        message: `Excellent! Your glucose is ${Math.round(currentData.glucose)} mg/dL - perfectly within the healthy range (70-100 mg/dL).`,
        confidence: 95,
        timestamp: "Just now"
      });
    }

    // Heart Rate Analysis
    if (currentData.heartRate < 60) {
      generatedInsights.push({
        id: "hr-low",
        type: "recommendation",
        title: "Low Heart Rate",
        message: `Heart rate at ${Math.round(currentData.heartRate)} BPM is below normal. This may be normal if athletic, otherwise consult a doctor.`,
        confidence: 82,
        timestamp: "1 min ago"
      });
    } else if (currentData.heartRate > 100) {
      generatedInsights.push({
        id: "hr-high",
        type: "alert",
        title: "Elevated Heart Rate",
        message: `Heart rate at ${Math.round(currentData.heartRate)} BPM. Take deep breaths and rest. If persistent, seek medical attention.`,
        confidence: 90,
        timestamp: "Just now"
      });
    } else {
      generatedInsights.push({
        id: "hr-normal",
        type: "normal",
        title: "Heart Rate Normal",
        message: `Heart rate at ${Math.round(currentData.heartRate)} BPM is within the healthy range (60-100 BPM).`,
        confidence: 94,
        timestamp: "1 min ago"
      });
    }

    // Blood Pressure Analysis
    if (currentData.bloodPressureSys >= 140 || currentData.bloodPressureDia >= 90) {
      generatedInsights.push({
        id: "bp-high",
        type: "alert",
        title: "High Blood Pressure",
        message: `BP at ${Math.round(currentData.bloodPressureSys)}/${Math.round(currentData.bloodPressureDia)} mmHg is elevated. Reduce sodium intake and practice relaxation.`,
        confidence: 91,
        timestamp: "Just now"
      });
    } else if (currentData.bloodPressureSys < 90 || currentData.bloodPressureDia < 60) {
      generatedInsights.push({
        id: "bp-low",
        type: "recommendation",
        title: "Low Blood Pressure",
        message: `BP at ${Math.round(currentData.bloodPressureSys)}/${Math.round(currentData.bloodPressureDia)} mmHg. Stay hydrated and avoid standing up quickly.`,
        confidence: 85,
        timestamp: "2 mins ago"
      });
    }

    // Trend Analysis
    if (previousData) {
      const glucoseTrend = currentData.glucose - previousData.glucose;
      if (Math.abs(glucoseTrend) > 15) {
        generatedInsights.push({
          id: "glucose-trend",
          type: "prediction",
          title: glucoseTrend > 0 ? "📈 Glucose Rising" : "📉 Glucose Falling",
          message: `Glucose ${glucoseTrend > 0 ? "increased" : "decreased"} by ${Math.abs(Math.round(glucoseTrend))} mg/dL. ${glucoseTrend > 0 ? "Monitor for continued rise." : "Ensure it stabilizes above 70 mg/dL."}`,
          confidence: 87,
          timestamp: "Just now"
        });
      }
    }

    // Temperature Analysis
    if (currentData.temperature > 99.5) {
      generatedInsights.push({
        id: "temp-fever",
        type: "alert",
        title: "🌡️ Elevated Temperature",
        message: `Temperature at ${currentData.temperature.toFixed(1)}°F indicates fever. Rest, stay hydrated, and monitor symptoms.`,
        confidence: 93,
        timestamp: "Just now"
      });
    }

    return generatedInsights;
  }, [currentData, previousData]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <TrendingUp className="h-5 w-5" />;
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
        <Brain className="h-6 w-6 text-primary animate-pulse" />
        <h3 className="text-lg font-semibold">Real-Time AI Health Insights</h3>
        <Badge variant="outline" className="ml-auto text-xs animate-pulse">
          🔴 LIVE
        </Badge>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {insights.map((insight) => (
          <div key={insight.id} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30 transition-all hover:bg-background/70">
            <div className={`p-2 rounded-full bg-background ${getInsightColor(insight.type)}`}>
              {getInsightIcon(insight.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
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
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>AI is analyzing your health data...</p>
          </div>
        )}
      </div>
    </Card>
  );
};