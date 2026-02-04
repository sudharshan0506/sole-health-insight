import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, BellRing, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface NotificationSettingsProps {
  onRequestPermission: () => Promise<boolean>;
}

export const NotificationSettings = ({ onRequestPermission }: NotificationSettingsProps) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const granted = await onRequestPermission();
      setPermissionState(Notification.permission);
      
      if (granted) {
        toast.success("Notifications enabled!", {
          description: "You'll receive alerts for critical health events."
        });
      } else {
        toast.error("Notifications blocked", {
          description: "Please enable notifications in your browser settings."
        });
      }
    } catch (error) {
      toast.error("Failed to enable notifications");
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (permissionState) {
      case "granted":
        return <BellRing className="h-5 w-5 text-health-success" />;
      case "denied":
        return <BellOff className="h-5 w-5 text-health-danger" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (permissionState) {
      case "granted":
        return <Badge className="bg-health-success/20 text-health-success">Enabled</Badge>;
      case "denied":
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Not Set</Badge>;
    }
  };

  if (!("Notification" in window)) {
    return (
      <Card className="p-4 bg-gradient-card border-border/50">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Push notifications not supported in this browser
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-card border-border/50">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Health Alerts</span>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {permissionState === "granted" 
                ? "You'll receive critical glucose & step goal alerts"
                : "Enable to receive critical health notifications"}
            </p>
          </div>
        </div>

        {permissionState !== "granted" && (
          <Button
            size="sm"
            onClick={handleEnableNotifications}
            disabled={isRequesting || permissionState === "denied"}
            className="gap-2"
          >
            {isRequesting ? (
              <>Enabling...</>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Enable
              </>
            )}
          </Button>
        )}

        {permissionState === "granted" && (
          <CheckCircle className="h-5 w-5 text-health-success" />
        )}
      </div>

      {permissionState === "denied" && (
        <p className="text-xs text-destructive mt-3">
          Notifications are blocked. Please enable them in your browser settings to receive health alerts.
        </p>
      )}
    </Card>
  );
};
