import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Apple, Salad, Fish } from "lucide-react";
import { FullMealPlan } from "./FullMealPlan";

interface FoodSuggestion {
  name: string;
  effect: "lower" | "stable" | "avoid";
  icon: React.ReactNode;
  description: string;
}

interface FoodSuggestionsProps {
  glucoseLevel: number;
}

export const FoodSuggestions = ({ glucoseLevel }: FoodSuggestionsProps) => {
  const getFoodSuggestions = (): FoodSuggestion[] => {
    if (glucoseLevel < 70) {
      return [
        {
          name: "Orange Juice",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Quick glucose boost"
        },
        {
          name: "Banana",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Natural sugars + potassium"
        },
        {
          name: "Glucose Tablets",
          effect: "stable",
          icon: <Utensils className="h-4 w-4" />,
          description: "Fast-acting glucose"
        }
      ];
    } else if (glucoseLevel > 140) {
      return [
        {
          name: "Leafy Greens",
          effect: "lower",
          icon: <Salad className="h-4 w-4" />,
          description: "Low glycemic index"
        },
        {
          name: "Grilled Chicken",
          effect: "lower",
          icon: <Fish className="h-4 w-4" />,
          description: "Protein without carbs"
        },
        {
          name: "Avoid Sweets",
          effect: "avoid",
          icon: <Utensils className="h-4 w-4" />,
          description: "Skip high-sugar foods"
        }
      ];
    } else {
      return [
        {
          name: "Whole Grains",
          effect: "stable",
          icon: <Salad className="h-4 w-4" />,
          description: "Steady energy release"
        },
        {
          name: "Nuts & Seeds",
          effect: "stable",
          icon: <Apple className="h-4 w-4" />,
          description: "Healthy fats & protein"
        },
        {
          name: "Lean Protein",
          effect: "stable",
          icon: <Fish className="h-4 w-4" />,
          description: "Maintains glucose balance"
        }
      ];
    }
  };

  const suggestions = getFoodSuggestions();

  const getEffectColor = (effect: string) => {
    switch (effect) {
      case "lower":
        return "text-health-normal bg-health-normal/10";
      case "stable":
        return "text-health-info bg-health-info/10";
      case "avoid":
        return "text-health-high bg-health-high/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getRecommendationText = () => {
    if (glucoseLevel < 70) return "Low Glucose - Quick Action Needed";
    if (glucoseLevel > 140) return "High Glucose - Choose Carefully";
    return "Normal Range - Maintain Balance";
  };

  const getRecommendationColor = () => {
    if (glucoseLevel < 70) return "text-health-low";
    if (glucoseLevel > 140) return "text-health-high";
    return "text-health-normal";
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom animate-float">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Food Recommendations</h3>
      </div>
      
      <div className="mb-4">
        <Badge className={`${getRecommendationColor()} bg-background/50`}>
          {getRecommendationText()}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((food, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-smooth">
            <div className={`p-2 rounded-lg ${getEffectColor(food.effect)}`}>
              {food.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{food.name}</span>
                <Badge variant="outline" className="text-xs">
                  {food.effect === "lower" ? "Lowers" : food.effect === "stable" ? "Stabilizes" : "Avoid"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{food.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <FullMealPlan glucoseLevel={glucoseLevel} />
    </Card>
  );
};