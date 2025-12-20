import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, TrendingUp, TrendingDown, Minus, Calendar, Activity, Droplet, Heart, Thermometer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface HealthRecord {
  id: string;
  glucose_level: number | null;
  heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  temperature: number | null;
  steps: number | null;
  exercise_duration: number | null;
  notes: string | null;
  recorded_at: string;
}

export const HealthHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("health_history")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setHistory(data);
    }
    setLoading(false);
  };

  const saveCurrentReading = async (healthData: Omit<HealthRecord, 'id' | 'recorded_at'>) => {
    if (!user) return;

    const { error } = await supabase.from("health_history").insert([{
      user_id: user.id,
      glucose_level: healthData.glucose_level,
      heart_rate: healthData.heart_rate,
      blood_pressure_systolic: healthData.blood_pressure_systolic,
      blood_pressure_diastolic: healthData.blood_pressure_diastolic,
      temperature: healthData.temperature,
      steps: healthData.steps,
      exercise_duration: healthData.exercise_duration,
      notes: healthData.notes,
    }]);

    if (!error) {
      fetchHistory();
    }
  };

  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (!current || !previous) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (current > previous) return <TrendingUp className="h-4 w-4 text-health-low" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-health-normal" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getGlucoseStatus = (level: number | null) => {
    if (!level) return "unknown";
    if (level < 70) return "low";
    if (level > 140) return "high";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-health-low bg-health-low/10 border-health-low/20";
      case "high":
        return "text-health-high bg-health-high/10 border-health-high/20";
      case "normal":
        return "text-health-normal bg-health-normal/10 border-health-normal/20";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const groupByDate = (records: HealthRecord[]) => {
    const groups: { [key: string]: HealthRecord[] } = {};
    records.forEach((record) => {
      const date = format(new Date(record.recorded_at), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    return groups;
  };

  const groupedHistory = groupByDate(history);

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Health History</h3>
        <Badge variant="outline" className="ml-auto">
          {history.length} records
        </Badge>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <ScrollArea className="h-[400px] pr-4">
            {Object.entries(groupedHistory).map(([date, records]) => (
              <div key={date} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </span>
                </div>

                <div className="space-y-3 pl-6 border-l-2 border-border/50">
                  {records.map((record, index) => {
                    const prevRecord = records[index + 1];
                    const glucoseStatus = getGlucoseStatus(record.glucose_level);

                    return (
                      <div
                        key={record.id}
                        className="relative p-4 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 transition-smooth"
                      >
                        <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary border-2 border-background" />

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(record.recorded_at), "HH:mm")}
                          </span>
                          {record.glucose_level && (
                            <Badge className={getStatusColor(glucoseStatus)}>
                              {glucoseStatus.toUpperCase()}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {record.glucose_level && (
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-primary" />
                              <span>{record.glucose_level} mg/dL</span>
                              {getTrendIcon(record.glucose_level, prevRecord?.glucose_level ?? null)}
                            </div>
                          )}

                          {record.heart_rate && (
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-health-high" />
                              <span>{record.heart_rate} BPM</span>
                              {getTrendIcon(record.heart_rate, prevRecord?.heart_rate ?? null)}
                            </div>
                          )}

                          {record.blood_pressure_systolic && record.blood_pressure_diastolic && (
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-accent" />
                              <span>
                                {record.blood_pressure_systolic}/{record.blood_pressure_diastolic} mmHg
                              </span>
                            </div>
                          )}

                          {record.temperature && (
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-health-low" />
                              <span>{record.temperature}°F</span>
                            </div>
                          )}

                          {record.steps && (
                            <div className="flex items-center gap-2 col-span-2">
                              <Activity className="h-4 w-4 text-health-normal" />
                              <span>{record.steps.toLocaleString()} steps</span>
                              {record.exercise_duration && (
                                <span className="text-muted-foreground">
                                  • {record.exercise_duration} min exercise
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {record.notes && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {history.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No health records yet</p>
                <p className="text-sm">Your health data will appear here</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-4">
            {history.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplet className="h-5 w-5 text-primary" />
                      <span className="font-medium">Avg Glucose</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        history
                          .filter((r) => r.glucose_level)
                          .reduce((sum, r) => sum + (r.glucose_level || 0), 0) /
                          history.filter((r) => r.glucose_level).length || 0
                      )}{" "}
                      <span className="text-sm font-normal text-muted-foreground">mg/dL</span>
                    </p>
                  </Card>

                  <Card className="p-4 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-health-high" />
                      <span className="font-medium">Avg Heart Rate</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        history
                          .filter((r) => r.heart_rate)
                          .reduce((sum, r) => sum + (r.heart_rate || 0), 0) /
                          history.filter((r) => r.heart_rate).length || 0
                      )}{" "}
                      <span className="text-sm font-normal text-muted-foreground">BPM</span>
                    </p>
                  </Card>

                  <Card className="p-4 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-health-normal" />
                      <span className="font-medium">Total Steps</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {history
                        .filter((r) => r.steps)
                        .reduce((sum, r) => sum + (r.steps || 0), 0)
                        .toLocaleString()}
                    </p>
                  </Card>

                  <Card className="p-4 bg-background/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-accent" />
                      <span className="font-medium">Records</span>
                    </div>
                    <p className="text-2xl font-bold">{history.length}</p>
                  </Card>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
