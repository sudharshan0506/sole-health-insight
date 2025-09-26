import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface HealthData {
  time: string;
  glucose: number;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  temperature: number;
}

interface HealthChartProps {
  data: HealthData[];
}

export const HealthChart = ({ data }: HealthChartProps) => {
  // Normalize data for better visualization
  const normalizedData = data.map(item => ({
    ...item,
    glucoseNorm: item.glucose * 0.8, // Scale glucose for chart
    temperatureNorm: (item.temperature - 96) * 10, // Scale temperature for chart
  }));

  return (
    <div className="w-full h-96 p-4 bg-gradient-card backdrop-blur-sm rounded-lg border border-border/50 shadow-card-custom">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Real-Time Health Monitoring</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "var(--shadow-card)",
            }}
          />
          <Legend />
          
          <Line
            type="monotone"
            dataKey="glucoseNorm"
            stroke="hsl(var(--health-info))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--health-info))", strokeWidth: 2, r: 4 }}
            name="Glucose (mg/dL)"
          />
          
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="hsl(var(--health-danger))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--health-danger))", strokeWidth: 2, r: 4 }}
            name="Heart Rate (BPM)"
          />
          
          <Line
            type="monotone"
            dataKey="bloodPressureSys"
            stroke="hsl(var(--health-warning))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--health-warning))", strokeWidth: 2, r: 4 }}
            name="BP Systolic"
          />
          
          <Line
            type="monotone"
            dataKey="temperatureNorm"
            stroke="hsl(var(--health-success))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--health-success))", strokeWidth: 2, r: 4 }}
            name="Temperature (°F)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};