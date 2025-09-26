import { useState, useEffect } from "react";
import { HealthMetricCard } from "@/components/HealthMetricCard";
import { HealthChart } from "@/components/HealthChart";
import { AIInsights } from "@/components/AIInsights";
import { ShoeStatus } from "@/components/ShoeStatus";
import { Activity, Droplet, Heart, Thermometer } from "lucide-react";

const Dashboard = () => {
  const [healthData, setHealthData] = useState([
    { time: "10:00", glucose: 95, heartRate: 72, bloodPressureSys: 120, bloodPressureDia: 80, temperature: 98.6 },
    { time: "10:15", glucose: 98, heartRate: 75, bloodPressureSys: 118, bloodPressureDia: 78, temperature: 98.4 },
    { time: "10:30", glucose: 102, heartRate: 78, bloodPressureSys: 122, bloodPressureDia: 82, temperature: 98.7 },
    { time: "10:45", glucose: 96, heartRate: 73, bloodPressureSys: 119, bloodPressureDia: 79, temperature: 98.5 },
    { time: "11:00", glucose: 94, heartRate: 71, bloodPressureSys: 117, bloodPressureDia: 77, temperature: 98.6 },
  ]);

  const [aiInsights, setAiInsights] = useState([
    {
      id: "1",
      type: "normal" as const,
      title: "Glucose Levels Stable",
      message: "Your glucose levels are within the normal range (70-100 mg/dL). Keep up the good work!",
      confidence: 95,
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      type: "recommendation" as const,
      title: "Heart Rate Optimization",
      message: "Consider light exercise to maintain optimal cardiovascular health. Your current heart rate suggests good fitness.",
      confidence: 87,
      timestamp: "5 minutes ago"
    },
    {
      id: "3",
      type: "prediction" as const,
      title: "Glucose Trend Analysis",
      message: "Based on current patterns, glucose levels may increase slightly after meals. Monitor for next 2 hours.",
      confidence: 78,
      timestamp: "10 minutes ago"
    }
  ]);

  const [shoeStatus, setShoeStatus] = useState({
    isConnected: true,
    batteryLevel: 85,
    signalStrength: 92
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const newDataPoint = {
        time: timeString,
        glucose: 85 + Math.random() * 30,
        heartRate: 65 + Math.random() * 20,
        bloodPressureSys: 110 + Math.random() * 20,
        bloodPressureDia: 70 + Math.random() * 15,
        temperature: 98.2 + Math.random() * 0.8,
      };

      setHealthData(prev => [...prev.slice(-4), newDataPoint]);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const currentData = healthData[healthData.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Shoe Health Monitor
          </h1>
          <p className="text-muted-foreground">
            Revolutionary non-invasive health monitoring through intelligent footwear
          </p>
        </div>

        {/* Shoe Status */}
        <ShoeStatus {...shoeStatus} />

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HealthMetricCard
            title="Glucose Level"
            value={Math.round(currentData.glucose).toString()}
            unit="mg/dL"
            trend={currentData.glucose > healthData[healthData.length - 2]?.glucose ? "up" : "down"}
            status={currentData.glucose < 100 ? "normal" : currentData.glucose < 140 ? "warning" : "danger"}
            icon={<Droplet className="h-5 w-5" />}
          />
          
          <HealthMetricCard
            title="Heart Rate"
            value={Math.round(currentData.heartRate).toString()}
            unit="BPM"
            trend={currentData.heartRate > healthData[healthData.length - 2]?.heartRate ? "up" : "down"}
            status={currentData.heartRate >= 60 && currentData.heartRate <= 100 ? "normal" : "warning"}
            icon={<Heart className="h-5 w-5" />}
          />
          
          <HealthMetricCard
            title="Blood Pressure"
            value={`${Math.round(currentData.bloodPressureSys)}/${Math.round(currentData.bloodPressureDia)}`}
            unit="mmHg"
            trend={currentData.bloodPressureSys > healthData[healthData.length - 2]?.bloodPressureSys ? "up" : "down"}
            status={currentData.bloodPressureSys < 130 ? "normal" : currentData.bloodPressureSys < 140 ? "warning" : "danger"}
            icon={<Activity className="h-5 w-5" />}
          />
          
          <HealthMetricCard
            title="Temperature"
            value={currentData.temperature.toFixed(1)}
            unit="°F"
            trend={currentData.temperature > healthData[healthData.length - 2]?.temperature ? "up" : "down"}
            status={currentData.temperature >= 98.0 && currentData.temperature <= 99.5 ? "normal" : "warning"}
            icon={<Thermometer className="h-5 w-5" />}
          />
        </div>

        {/* Chart and AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HealthChart data={healthData} />
          <AIInsights insights={aiInsights} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;