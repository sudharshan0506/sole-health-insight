import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, Battery, Bluetooth, Zap, CheckCircle, AlertCircle } from "lucide-react";
import smartShoeImage from "@/assets/smart-shoe-bg.jpg";

interface ShoeStatusProps {
  isConnected: boolean;
  batteryLevel: number;
  signalStrength: number;
  isCharging: boolean;
}

export const ShoeStatus = ({ isConnected, batteryLevel, signalStrength, isCharging }: ShoeStatusProps) => {
  const getBatteryColor = () => {
    if (isCharging) return "text-health-info bg-health-info/20";
    if (batteryLevel > 50) return "text-health-normal bg-health-normal/20";
    if (batteryLevel > 20) return "text-health-low bg-health-low/20";
    return "text-health-high bg-health-high/20";
  };

  const getSignalColor = () => {
    if (signalStrength > 70) return "text-health-normal bg-health-normal/20";
    if (signalStrength > 30) return "text-health-low bg-health-low/20";
    return "text-health-high bg-health-high/20";
  };

  const getConnectionColor = () => {
    return isConnected ? "text-health-normal bg-health-normal/20" : "text-health-high bg-health-high/20";
  };

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-glow animate-float">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${smartShoeImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Smart Shoe Status</h3>
            <p className="text-sm text-muted-foreground">Health Monitoring Device</p>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"} className="animate-pulse-glow">
            {isConnected ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Connection Status */}
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-bounce hover:scale-110 ${getConnectionColor()}`}>
              <Bluetooth className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Connection</p>
              <p className="text-sm font-medium text-foreground">
                {isConnected ? "Active" : "Lost"}
              </p>
            </div>
          </div>
          
          {/* Battery Level */}
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-bounce hover:scale-110 ${getBatteryColor()}`}>
              {isCharging ? <Zap className="h-6 w-6" /> : <Battery className="h-6 w-6" />}
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {isCharging ? "Charging" : "Battery"}
              </p>
              <p className="text-sm font-medium text-foreground">{batteryLevel}%</p>
            </div>
          </div>
          
          {/* Signal Strength */}
          <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-bounce hover:scale-110 ${getSignalColor()}`}>
              <Wifi className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Signal</p>
              <p className="text-sm font-medium text-foreground">{signalStrength}%</p>
            </div>
          </div>
        </div>
        
        {/* Battery Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Battery Level</span>
            <span className="text-sm text-muted-foreground">{batteryLevel}%</span>
          </div>
          <div className="w-full bg-background/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-smooth ${
                isCharging ? "bg-gradient-to-r from-health-info to-health-normal animate-pulse" :
                batteryLevel > 50 ? "bg-health-normal" :
                batteryLevel > 20 ? "bg-health-low" : "bg-health-high"
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-glow backdrop-blur-sm border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-health-normal" />
            <p className="text-sm font-semibold text-foreground">Monitoring Active</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Non-invasive glucose monitoring via advanced foot sensors
          </p>
        </div>
        
        {!isConnected && (
          <Button className="w-full mt-4 bg-health-high text-white hover:bg-health-high/80 transition-bounce">
            Reconnect Device
          </Button>
        )}
      </div>
    </Card>
  );
};