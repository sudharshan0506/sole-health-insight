import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footprints, Target, Flame, Clock, TrendingUp, Dumbbell, Heart, Zap } from "lucide-react";
import { toast } from "sonner";

interface ExerciseRecommendation {
  id: string;
  name: string;
  duration: string;
  intensity: "low" | "moderate" | "high";
  glucoseImpact: string;
  caloriesBurned: number;
  icon: React.ReactNode;
}

interface ActivityTrackingProps {
  glucoseLevel: number;
  steps?: number;
  exerciseMinutes?: number;
}

export const ActivityTracking = ({ glucoseLevel, steps = 0, exerciseMinutes = 0 }: ActivityTrackingProps) => {
  const [currentSteps, setCurrentSteps] = useState(steps);
  const [currentExercise, setCurrentExercise] = useState(exerciseMinutes);
  const stepGoal = 10000;
  const exerciseGoal = 30; // 30 minutes daily

  // Simulate step updates from smart shoe
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSteps(prev => prev + Math.floor(Math.random() * 50));
    }, 30000); // Add random steps every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getGlucoseBasedRecommendations = (): ExerciseRecommendation[] => {
    if (glucoseLevel > 140) {
      // High glucose - recommend moderate to high intensity
      return [
        {
          id: "1",
          name: "Brisk Walking",
          duration: "30 min",
          intensity: "moderate",
          glucoseImpact: "Can reduce glucose by 20-40 mg/dL",
          caloriesBurned: 150,
          icon: <Footprints className="h-5 w-5" />,
        },
        {
          id: "2",
          name: "Light Jogging",
          duration: "20 min",
          intensity: "moderate",
          glucoseImpact: "Can reduce glucose by 30-50 mg/dL",
          caloriesBurned: 200,
          icon: <Zap className="h-5 w-5" />,
        },
        {
          id: "3",
          name: "Resistance Training",
          duration: "25 min",
          intensity: "high",
          glucoseImpact: "Improves insulin sensitivity for 24-48 hours",
          caloriesBurned: 180,
          icon: <Dumbbell className="h-5 w-5" />,
        },
      ];
    } else if (glucoseLevel < 70) {
      // Low glucose - avoid intense exercise
      return [
        {
          id: "1",
          name: "Gentle Stretching",
          duration: "15 min",
          intensity: "low",
          glucoseImpact: "Safe for low glucose, minimal impact",
          caloriesBurned: 30,
          icon: <Heart className="h-5 w-5" />,
        },
        {
          id: "2",
          name: "Slow Walk",
          duration: "10 min",
          intensity: "low",
          glucoseImpact: "Light activity after snack recommended",
          caloriesBurned: 40,
          icon: <Footprints className="h-5 w-5" />,
        },
      ];
    } else {
      // Normal glucose - balanced recommendations
      return [
        {
          id: "1",
          name: "Moderate Walking",
          duration: "30 min",
          intensity: "moderate",
          glucoseImpact: "Maintains stable glucose levels",
          caloriesBurned: 120,
          icon: <Footprints className="h-5 w-5" />,
        },
        {
          id: "2",
          name: "Cycling",
          duration: "25 min",
          intensity: "moderate",
          glucoseImpact: "Great for cardiovascular health",
          caloriesBurned: 170,
          icon: <Zap className="h-5 w-5" />,
        },
        {
          id: "3",
          name: "Yoga",
          duration: "30 min",
          intensity: "low",
          glucoseImpact: "Reduces stress, stabilizes glucose",
          caloriesBurned: 80,
          icon: <Heart className="h-5 w-5" />,
        },
        {
          id: "4",
          name: "Swimming",
          duration: "20 min",
          intensity: "moderate",
          glucoseImpact: "Full-body workout, excellent for joints",
          caloriesBurned: 200,
          icon: <Dumbbell className="h-5 w-5" />,
        },
      ];
    }
  };

  const recommendations = getGlucoseBasedRecommendations();
  const stepProgress = Math.min((currentSteps / stepGoal) * 100, 100);
  const exerciseProgress = Math.min((currentExercise / exerciseGoal) * 100, 100);
  const caloriesBurned = Math.round((currentSteps * 0.04) + (currentExercise * 5));

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return "bg-health-normal/20 text-health-normal border-health-normal/30";
      case "moderate":
        return "bg-health-info/20 text-health-info border-health-info/30";
      case "high":
        return "bg-health-low/20 text-health-low border-health-low/30";
      default:
        return "";
    }
  };

  const handleStartExercise = (exercise: ExerciseRecommendation) => {
    toast.success(`Starting ${exercise.name}! Good luck! 🏃‍♂️`);
    // Simulate adding exercise time
    setTimeout(() => {
      const duration = parseInt(exercise.duration);
      setCurrentExercise(prev => prev + duration);
      toast.success(`Completed ${exercise.name}! Great job! 🎉`);
    }, 3000);
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom">
      <div className="flex items-center gap-2 mb-6">
        <Footprints className="h-6 w-6 text-primary animate-pulse-glow" />
        <h3 className="text-lg font-semibold">Activity Tracking</h3>
        {glucoseLevel > 140 && (
          <Badge className="ml-auto bg-health-low/20 text-health-low border-health-low/30">
            Exercise Recommended
          </Badge>
        )}
      </div>

      {/* Step Counter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <Footprints className="h-5 w-5 text-primary" />
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-primary">{currentSteps.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">of {stepGoal.toLocaleString()} steps</p>
          <Progress value={stepProgress} className="mt-2 h-2" />
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-health-low/10 to-health-low/5 border border-health-low/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-health-low" />
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-health-low">{currentExercise}</p>
          <p className="text-sm text-muted-foreground">of {exerciseGoal} min exercise</p>
          <Progress value={exerciseProgress} className="mt-2 h-2" />
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-health-high/10 to-health-high/5 border border-health-high/20">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-5 w-5 text-health-high" />
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold text-health-high">{caloriesBurned}</p>
          <p className="text-sm text-muted-foreground">calories burned</p>
        </div>
      </div>

      {/* Exercise Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-accent" />
          <h4 className="font-medium">Exercise Recommendations</h4>
          <span className="text-xs text-muted-foreground">
            (Based on glucose: {Math.round(glucoseLevel)} mg/dL)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 transition-smooth"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">{rec.icon}</div>
                  <div>
                    <p className="font-medium">{rec.name}</p>
                    <p className="text-sm text-muted-foreground">{rec.duration}</p>
                  </div>
                </div>
                <Badge className={getIntensityColor(rec.intensity)}>
                  {rec.intensity}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{rec.glucoseImpact}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-health-high">
                  <Flame className="h-3 w-3" />
                  <span>{rec.caloriesBurned} cal</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStartExercise(rec)}
                  className="h-7 text-xs"
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert for high glucose */}
      {glucoseLevel > 140 && (
        <div className="mt-4 p-4 rounded-lg bg-health-low/10 border border-health-low/30">
          <div className="flex items-center gap-2 text-health-low">
            <Zap className="h-5 w-5" />
            <span className="font-medium">High Glucose Alert</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Your glucose is elevated. A 15-30 minute walk can help reduce levels by 20-40 mg/dL.
            Consider light exercise after your next meal.
          </p>
        </div>
      )}

      {glucoseLevel < 70 && (
        <div className="mt-4 p-4 rounded-lg bg-health-high/10 border border-health-high/30">
          <div className="flex items-center gap-2 text-health-high">
            <Heart className="h-5 w-5" />
            <span className="font-medium">Low Glucose Warning</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Your glucose is low. Avoid intense exercise and have a snack with fast-acting carbs first.
            Light stretching is safe after stabilizing.
          </p>
        </div>
      )}
    </Card>
  );
};
