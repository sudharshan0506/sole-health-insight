import { useState, useEffect } from "react";
import { HealthMetricCard } from "@/components/HealthMetricCard";
import { HealthChart } from "@/components/HealthChart";
import { AIInsights } from "@/components/AIInsights";
import { ShoeStatus } from "@/components/ShoeStatus";
import { FoodSuggestions } from "@/components/FoodSuggestions";
import { InsulinAlerts } from "@/components/InsulinAlerts";
import { HospitalFinder } from "@/components/HospitalFinder";
import { MedicationAlerts } from "@/components/MedicationAlerts";
import { HealthHistory } from "@/components/HealthHistory";
import { ActivityTracking } from "@/components/ActivityTracking";
import { NotificationSettings } from "@/components/NotificationSettings";
import { Activity, Droplet, Heart, Thermometer, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useHealthNotifications } from "@/hooks/useHealthNotifications";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [healthData, setHealthData] = useState([
    { time: "10:00", glucose: 95, heartRate: 72, bloodPressureSys: 120, bloodPressureDia: 80, temperature: 98.6 },
    { time: "10:15", glucose: 98, heartRate: 75, bloodPressureSys: 118, bloodPressureDia: 78, temperature: 98.4 },
    { time: "10:30", glucose: 102, heartRate: 78, bloodPressureSys: 122, bloodPressureDia: 82, temperature: 98.7 },
    { time: "10:45", glucose: 96, heartRate: 73, bloodPressureSys: 119, bloodPressureDia: 79, temperature: 98.5 },
    { time: "11:00", glucose: 94, heartRate: 71, bloodPressureSys: 117, bloodPressureDia: 77, temperature: 98.6 },
  ]);

  const [previousData, setPreviousData] = useState<typeof healthData[0] | null>(null);

  const [shoeStatus, setShoeStatus] = useState({
    isConnected: true,
    batteryLevel: 85,
    signalStrength: 92,
    isCharging: false
  });

  const [activityData, setActivityData] = useState({
    steps: 4523,
    exerciseMinutes: 15
  });

  // Save health data to history periodically
  const saveHealthToHistory = async (data: typeof healthData[0]) => {
    if (!user) return;

    try {
      await supabase.from("health_history").insert({
        user_id: user.id,
        glucose_level: Math.round(data.glucose),
        heart_rate: Math.round(data.heartRate),
        blood_pressure_systolic: Math.round(data.bloodPressureSys),
        blood_pressure_diastolic: Math.round(data.bloodPressureDia),
        temperature: data.temperature,
        steps: activityData.steps,
        exercise_duration: activityData.exerciseMinutes,
      });
    } catch (error) {
      console.error("Failed to save health data:", error);
    }
  };

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

      setHealthData(prev => {
        setPreviousData(prev[prev.length - 1]);
        return [...prev.slice(-4), newDataPoint];
      });
      
      // Update activity data
      setActivityData(prev => ({
        steps: prev.steps + Math.floor(Math.random() * 100),
        exerciseMinutes: prev.exerciseMinutes
      }));

      // Save to history every 5 minutes (every 20th update at 15s intervals)
      if (Math.random() < 0.05) {
        saveHealthToHistory(newDataPoint);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const currentData = healthData[healthData.length - 1];

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return "warning";
    if (glucose > 140) return "danger";
    return "normal";
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1 space-y-4">
            <h1 className="text-5xl font-black bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow">
              Smart Shoe Health Monitor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary non-invasive health monitoring through intelligent footwear technology
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Shoe Status */}
        <ShoeStatus {...shoeStatus} />

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <HealthMetricCard
            title="Glucose Level"
            value={Math.round(currentData.glucose).toString()}
            unit="mg/dL"
            trend={currentData.glucose > healthData[healthData.length - 2]?.glucose ? "up" : "down"}
            status={getGlucoseStatus(currentData.glucose)}
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

        {/* Activity Tracking */}
        <ActivityTracking 
          glucoseLevel={currentData.glucose}
          steps={activityData.steps}
          exerciseMinutes={activityData.exerciseMinutes}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Chart and AI */}
          <div className="xl:col-span-2 space-y-8">
            <HealthChart data={healthData} />
            <AIInsights currentData={currentData} previousData={previousData || undefined} />
            <HealthHistory />
          </div>
          
          {/* Right Column - Food, Medications, Insulin */}
          <div className="space-y-8">
            <MedicationAlerts />
            <FoodSuggestions glucoseLevel={currentData.glucose} heartRate={currentData.heartRate} />
            <InsulinAlerts />
          </div>
        </div>

        {/* Hospital Finder */}
        <HospitalFinder />
      </div>
    </div>
  );
};

export default Dashboard;