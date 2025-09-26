import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Battery, Bluetooth } from "lucide-react";
import smartShoeImage from "@/assets/smart-shoe-bg.jpg";

interface ShoeStatusProps {
  isConnected: boolean;
  batteryLevel: number;
  signalStrength: number;
}

export const ShoeStatus = ({ isConnected, batteryLevel, signalStrength }: ShoeStatusProps) => {
  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-card backdrop-blur-sm border-border/50 shadow-card-custom">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${smartShoeImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Smart Shoe Status</h3>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Connection Status */}
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-full ${isConnected ? 'bg-health-success/20 text-health-success' : 'bg-health-danger/20 text-health-danger'}`}>
              <Bluetooth className="h-5 w-5" />
            </div>
            <span className="text-xs text-muted-foreground">Connection</span>
          </div>
          
          {/* Battery Level */}
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-full ${batteryLevel > 20 ? 'bg-health-success/20 text-health-success' : 'bg-health-warning/20 text-health-warning'}`}>
              <Battery className="h-5 w-5" />
            </div>
            <span className="text-xs text-muted-foreground">{batteryLevel}%</span>
          </div>
          
          {/* Signal Strength */}
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-full ${signalStrength > 70 ? 'bg-health-success/20 text-health-success' : signalStrength > 30 ? 'bg-health-warning/20 text-health-warning' : 'bg-health-danger/20 text-health-danger'}`}>
              <Wifi className="h-5 w-5" />
            </div>
            <span className="text-xs text-muted-foreground">{signalStrength}%</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-background/30 border border-border/30">
          <p className="text-sm text-foreground font-medium">Monitoring Active</p>
          <p className="text-xs text-muted-foreground">Non-invasive glucose monitoring via foot sensors</p>
        </div>
      </div>
    </Card>
  );
};