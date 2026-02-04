import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Apple, Salad, Fish, Clock, Zap } from "lucide-react";
import { FullMealPlan } from "./FullMealPlan";
import { useMemo } from "react";

interface FoodSuggestion {
  name: string;
  effect: "lower" | "stable" | "avoid" | "boost";
  icon: React.ReactNode;
  description: string;
  calories?: number;
  timing?: string;
}

interface FoodSuggestionsProps {
  glucoseLevel: number;
  heartRate?: number;
}

export const FoodSuggestions = ({ glucoseLevel, heartRate = 75 }: FoodSuggestionsProps) => {
  const { suggestions, urgency, actionMessage } = useMemo(() => {
    let foods: FoodSuggestion[] = [];
    let urgencyLevel: "critical" | "warning" | "normal" = "normal";
    let action = "";

    if (glucoseLevel < 70) {
      urgencyLevel = "critical";
      action = `⚡ IMMEDIATE ACTION: Glucose at ${Math.round(glucoseLevel)} mg/dL - Consume 15-20g fast-acting carbs NOW!`;
      foods = [
        {
          name: "Orange Juice (4 oz)",
          effect: "boost",
          icon: <Zap className="h-4 w-4" />,
          description: "15g fast-acting glucose - drink immediately",
          calories: 55,
          timing: "Effect in 10-15 min"
        },
        {
          name: "Glucose Tablets (4)",
          effect: "boost",
          icon: <Zap className="h-4 w-4" />,
          description: "16g pure glucose - fastest absorption",
          calories: 60,
          timing: "Effect in 5-10 min"
        },
        {
          name: "Regular Soda (4 oz)",
          effect: "boost",
          icon: <Zap className="h-4 w-4" />,
          description: "14g sugar - emergency option",
          calories: 50,
          timing: "Effect in 10-15 min"
        },
        {
          name: "Honey (1 tbsp)",
          effect: "boost",
          icon: <Apple className="h-4 w-4" />,
          description: "17g natural sugars",
          calories: 64,
          timing: "Effect in 15 min"
        }
      ];
    } else if (glucoseLevel > 180) {
      urgencyLevel = "critical";
      action = `🚨 HIGH ALERT: Glucose at ${Math.round(glucoseLevel)} mg/dL - Avoid ALL carbs & sugars!`;
      foods = [
        {
          name: "Water (16 oz)",
          effect: "lower",
          icon: <Fish className="h-4 w-4" />,
          description: "Helps flush excess glucose",
          calories: 0,
          timing: "Drink now"
        },
        {
          name: "Grilled Chicken Breast",
          effect: "lower",
          icon: <Fish className="h-4 w-4" />,
          description: "Zero carbs, satisfying protein",
          calories: 165,
          timing: "Safe to eat"
        },
        {
          name: "Raw Cucumber Slices",
          effect: "lower",
          icon: <Salad className="h-4 w-4" />,
          description: "Very low GI, high water content",
          calories: 16,
          timing: "Safe snack"
        },
        {
          name: "⛔ Avoid: Bread, Rice, Pasta",
          effect: "avoid",
          icon: <Utensils className="h-4 w-4" />,
          description: "All high-carb foods will spike glucose further",
          timing: "Wait 2+ hours"
        }
      ];
    } else if (glucoseLevel > 140) {
      urgencyLevel = "warning";
      action = `⚠️ Glucose elevated at ${Math.round(glucoseLevel)} mg/dL - Choose low-GI foods`;
      foods = [
        {
          name: "Mixed Green Salad",
          effect: "lower",
          icon: <Salad className="h-4 w-4" />,
          description: "Fiber helps stabilize glucose",
          calories: 35,
          timing: "Good choice now"
        },
        {
          name: "Grilled Salmon",
          effect: "lower",
          icon: <Fish className="h-4 w-4" />,
          description: "Omega-3s + protein, no carb spike",
          calories: 208,
          timing: "Excellent option"
        },
        {
          name: "Steamed Broccoli",
          effect: "lower",
          icon: <Salad className="h-4 w-4" />,
          description: "Low GI, high fiber, nutrient-dense",
          calories: 55,
          timing: "Safe to eat"
        },
        {
          name: "Hard-Boiled Eggs",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Protein-rich, won't raise glucose",
          calories: 78,
          timing: "Good snack"
        }
      ];
    } else {
      urgencyLevel = "normal";
      action = `✅ Glucose stable at ${Math.round(glucoseLevel)} mg/dL - Maintain balanced eating`;
      foods = [
        {
          name: "Quinoa Bowl",
          effect: "stable",
          icon: <Salad className="h-4 w-4" />,
          description: "Complex carbs, steady energy release",
          calories: 222,
          timing: "Great for meals"
        },
        {
          name: "Greek Yogurt + Berries",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Protein + low-GI fruit",
          calories: 150,
          timing: "Ideal snack"
        },
        {
          name: "Almonds (1 oz)",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Healthy fats, minimal glucose impact",
          calories: 164,
          timing: "Anytime snack"
        },
        {
          name: "Grilled Fish + Veggies",
          effect: "stable",
          icon: <Fish className="h-4 w-4" />,
          description: "Balanced macro profile",
          calories: 280,
          timing: "Perfect for dinner"
        }
      ];
    }

    return { suggestions: foods, urgency: urgencyLevel, actionMessage: action };
  }, [glucoseLevel]);

  const getEffectColor = (effect: string) => {
    switch (effect) {
      case "lower":
        return "text-health-normal bg-health-normal/10";
      case "stable":
        return "text-health-info bg-health-info/10";
      case "avoid":
        return "text-health-high bg-health-high/10";
      case "boost":
        return "text-health-warning bg-health-warning/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getUrgencyBg = () => {
    switch (urgency) {
      case "critical":
        return "bg-destructive/10 border-destructive/50";
      case "warning":
        return "bg-health-warning/10 border-health-warning/50";
      default:
        return "bg-health-normal/10 border-health-normal/50";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Real-Time Food Guide</h3>
        <Badge variant="outline" className="ml-auto text-xs animate-pulse">
          🔴 LIVE
        </Badge>
      </div>
      
      <div className={`mb-4 p-3 rounded-lg border ${getUrgencyBg()}`}>
        <p className="text-sm font-medium">{actionMessage}</p>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((food, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-all">
            <div className={`p-2 rounded-lg ${getEffectColor(food.effect)}`}>
              {food.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground">{food.name}</span>
                {food.calories !== undefined && (
                  <Badge variant="outline" className="text-xs">
                    {food.calories} cal
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{food.description}</p>
              {food.timing && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {food.timing}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <FullMealPlan glucoseLevel={glucoseLevel} />
    </Card>
  );
};