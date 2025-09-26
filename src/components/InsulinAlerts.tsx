import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Syringe, Bell, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface InsulinAlert {
  id: string;
  time: string;
  type: "rapid" | "long";
  dose: string;
  isOverdue: boolean;
}

export const InsulinAlerts = () => {
  const [alerts, setAlerts] = useState<InsulinAlert[]>([
    {
      id: "1",
      time: "12:00 PM",
      type: "rapid",
      dose: "8 units",
      isOverdue: false
    },
    {
      id: "2",
      time: "6:00 PM",
      type: "rapid",
      dose: "6 units",
      isOverdue: false
    },
    {
      id: "3",
      time: "10:00 PM",
      type: "long",
      dose: "20 units",
      isOverdue: false
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getAlertStatus = (time: string) => {
    const now = currentTime;
    const alertTime = new Date();
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    alertTime.setHours(period === 'PM' && hours !== 12 ? hours + 12 : hours);
    alertTime.setMinutes(minutes);
    
    const diffMinutes = (now.getTime() - alertTime.getTime()) / (1000 * 60);
    
    if (diffMinutes > 30) return "overdue";
    if (diffMinutes > 0) return "due";
    if (diffMinutes > -30) return "upcoming";
    return "scheduled";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-health-high bg-health-high/10 border-health-high/20";
      case "due":
        return "text-health-low bg-health-low/10 border-health-low/20";
      case "upcoming":
        return "text-health-info bg-health-info/10 border-health-info/20";
      default:
        return "text-health-normal bg-health-normal/10 border-health-normal/20";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "rapid" ? 
      <Syringe className="h-4 w-4" /> : 
      <Clock className="h-4 w-4" />;
  };

  const markAsTaken = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom animate-float">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-6 w-6 text-primary animate-pulse-glow" />
        <h3 className="text-lg font-semibold">Insulin Schedule</h3>
        {alerts.some(alert => getAlertStatus(alert.time) === "overdue") && (
          <AlertCircle className="h-5 w-5 text-health-high animate-pulse" />
        )}
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => {
          const status = getAlertStatus(alert.time);
          return (
            <div key={alert.id} className={`p-4 rounded-lg border transition-bounce hover:scale-105 ${getStatusColor(status)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(alert.type)}
                  <span className="font-medium">
                    {alert.type === "rapid" ? "Rapid-Acting" : "Long-Acting"} Insulin
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {status === "overdue" ? "OVERDUE" : 
                   status === "due" ? "DUE NOW" :
                   status === "upcoming" ? "UPCOMING" : "SCHEDULED"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{alert.time}</span> • {alert.dose}
                </div>
                
                <Button 
                  size="sm" 
                  onClick={() => markAsTaken(alert.id)}
                  className="bg-health-normal text-white hover:bg-health-normal/80 transition-smooth"
                >
                  Mark Taken
                </Button>
              </div>
            </div>
          );
        })}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Syringe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>All insulin doses taken for today!</p>
          </div>
        )}
      </div>
      
      <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:shadow-health transition-bounce">
        Set Custom Schedule
      </Button>
    </Card>
  );
};