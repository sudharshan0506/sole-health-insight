import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Pill, Clock, AlertTriangle, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Medication {
  id: string;
  medication_name: string;
  dosage: string;
  scheduled_time: string;
  frequency: string;
  is_taken: boolean;
}

export const MedicationAlerts = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "daily",
  });

  useEffect(() => {
    if (user) {
      fetchMedications();
      checkUpcomingAlerts();
    }
  }, [user]);

  useEffect(() => {
    // Check for upcoming alerts every minute
    const interval = setInterval(checkUpcomingAlerts, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  const fetchMedications = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("medication_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_time", { ascending: true });

    if (!error && data) {
      setMedications(data);
    }
  };

  const checkUpcomingAlerts = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    medications.forEach((med) => {
      const scheduleTime = med.scheduled_time.slice(0, 5);
      const timeDiff = getTimeDifferenceInMinutes(currentTime, scheduleTime);

      if (timeDiff === 5 && !med.is_taken) {
        toast.warning(`⏰ Reminder: Take ${med.medication_name} (${med.dosage}) in 5 minutes!`, {
          duration: 10000,
        });
      } else if (timeDiff === 0 && !med.is_taken) {
        toast.error(`🔔 TIME TO TAKE: ${med.medication_name} (${med.dosage}) NOW!`, {
          duration: 30000,
        });
      } else if (timeDiff < 0 && timeDiff > -30 && !med.is_taken) {
        toast.error(`⚠️ OVERDUE: ${med.medication_name} was due ${Math.abs(timeDiff)} minutes ago!`, {
          duration: 15000,
        });
      }
    });
  };

  const getTimeDifferenceInMinutes = (current: string, scheduled: string) => {
    const [currentHours, currentMinutes] = current.split(":").map(Number);
    const [schedHours, schedMinutes] = scheduled.split(":").map(Number);
    
    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const schedTotalMinutes = schedHours * 60 + schedMinutes;
    
    return schedTotalMinutes - currentTotalMinutes;
  };

  const addMedication = async () => {
    if (!user || !newMedication.name || !newMedication.dosage || !newMedication.time) {
      toast.error("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("medication_alerts").insert({
      user_id: user.id,
      medication_name: newMedication.name,
      dosage: newMedication.dosage,
      scheduled_time: newMedication.time,
      frequency: newMedication.frequency,
      is_taken: false,
    });

    if (error) {
      toast.error("Failed to add medication");
    } else {
      toast.success(`${newMedication.name} added to your schedule`);
      setNewMedication({ name: "", dosage: "", time: "", frequency: "daily" });
      setIsDialogOpen(false);
      fetchMedications();
    }
  };

  const markAsTaken = async (id: string, name: string) => {
    const { error } = await supabase
      .from("medication_alerts")
      .update({ is_taken: true })
      .eq("id", id);

    if (!error) {
      toast.success(`${name} marked as taken ✓`);
      fetchMedications();
    }
  };

  const deleteMedication = async (id: string) => {
    const { error } = await supabase
      .from("medication_alerts")
      .delete()
      .eq("id", id);

    if (!error) {
      toast.success("Medication removed from schedule");
      fetchMedications();
    }
  };

  const getAlertStatus = (time: string, isTaken: boolean) => {
    if (isTaken) return "taken";
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const scheduleTime = time.slice(0, 5);
    const timeDiff = getTimeDifferenceInMinutes(currentTime, scheduleTime);

    if (timeDiff < -15) return "overdue";
    if (timeDiff <= 0) return "due";
    if (timeDiff <= 30) return "upcoming";
    return "scheduled";
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "overdue":
        return "border-health-high/50 bg-health-high/10 animate-pulse";
      case "due":
        return "border-health-low/50 bg-health-low/10";
      case "upcoming":
        return "border-health-info/50 bg-health-info/10";
      case "taken":
        return "border-health-normal/50 bg-health-normal/10 opacity-60";
      default:
        return "border-border/50 bg-background/50";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary animate-pulse-glow" />
          <h3 className="text-lg font-semibold">Medication Alerts</h3>
          {medications.some((m) => getAlertStatus(m.scheduled_time, m.is_taken) === "overdue") && (
            <AlertTriangle className="h-5 w-5 text-health-high animate-pulse" />
          )}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Medication Name</Label>
                <Input
                  placeholder="e.g., Metformin"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage</Label>
                <Input
                  placeholder="e.g., 500mg"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Time</Label>
                <Input
                  type="time"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={newMedication.frequency}
                  onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice_daily">Twice Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addMedication} className="w-full bg-gradient-primary">
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {medications.map((med) => {
          const status = getAlertStatus(med.scheduled_time, med.is_taken);
          return (
            <div
              key={med.id}
              className={`p-4 rounded-lg border transition-all ${getStatusStyles(status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{med.medication_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} • {formatTime(med.scheduled_time)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      status === "overdue"
                        ? "text-health-high border-health-high"
                        : status === "due"
                        ? "text-health-low border-health-low"
                        : status === "taken"
                        ? "text-health-normal border-health-normal"
                        : ""
                    }
                  >
                    {status.toUpperCase()}
                  </Badge>
                  
                  {!med.is_taken && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsTaken(med.id, med.medication_name)}
                      className="text-health-normal hover:bg-health-normal/20"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMedication(med.id)}
                    className="text-destructive hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {medications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No medications scheduled</p>
            <p className="text-sm">Add your first medication above</p>
          </div>
        )}
      </div>
    </Card>
  );
};
