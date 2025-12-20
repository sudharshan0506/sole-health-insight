import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Utensils, 
  Sun, 
  Coffee, 
  Moon, 
  Apple, 
  Leaf, 
  Fish, 
  Egg,
  Wheat,
  Milk,
  Salad,
  Cookie,
  ArrowDown,
  ArrowUp,
  Minus,
  Clock,
  Flame
} from "lucide-react";

interface MealItem {
  name: string;
  portion: string;
  calories: number;
  glucoseImpact: "low" | "medium" | "high";
  icon: React.ReactNode;
  benefits: string;
}

interface Meal {
  time: string;
  type: string;
  items: MealItem[];
  totalCalories: number;
}

interface FullMealPlanProps {
  glucoseLevel: number;
}

export const FullMealPlan = ({ glucoseLevel }: FullMealPlanProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getMealPlan = (): { [key: string]: Meal[] } => {
    const isHighGlucose = glucoseLevel > 140;
    const isLowGlucose = glucoseLevel < 70;

    if (isLowGlucose) {
      return {
        immediate: [
          {
            time: "Now",
            type: "Quick Action",
            totalCalories: 100,
            items: [
              { name: "Orange Juice", portion: "1/2 cup", calories: 55, glucoseImpact: "high", icon: <Apple className="h-4 w-4" />, benefits: "Fast-acting sugar for quick recovery" },
              { name: "Glucose Tablets", portion: "3-4 tablets", calories: 45, glucoseImpact: "high", icon: <Cookie className="h-4 w-4" />, benefits: "Immediate glucose boost" },
            ],
          },
        ],
        followUp: [
          {
            time: "15 mins later",
            type: "Stabilizing Snack",
            totalCalories: 200,
            items: [
              { name: "Whole Wheat Crackers", portion: "6 crackers", calories: 80, glucoseImpact: "medium", icon: <Wheat className="h-4 w-4" />, benefits: "Complex carbs for sustained energy" },
              { name: "Peanut Butter", portion: "2 tbsp", calories: 190, glucoseImpact: "low", icon: <Egg className="h-4 w-4" />, benefits: "Protein + healthy fats" },
            ],
          },
        ],
      };
    }

    if (isHighGlucose) {
      return {
        breakfast: [
          {
            time: "7:00 AM",
            type: "Breakfast",
            totalCalories: 350,
            items: [
              { name: "Scrambled Eggs", portion: "2 eggs", calories: 180, glucoseImpact: "low", icon: <Egg className="h-4 w-4" />, benefits: "High protein, no carbs" },
              { name: "Spinach Sauté", portion: "1 cup", calories: 40, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Fiber-rich, low glycemic" },
              { name: "Avocado", portion: "1/2", calories: 130, glucoseImpact: "low", icon: <Salad className="h-4 w-4" />, benefits: "Healthy fats, very low GI" },
            ],
          },
        ],
        lunch: [
          {
            time: "12:30 PM",
            type: "Lunch",
            totalCalories: 450,
            items: [
              { name: "Grilled Salmon", portion: "5 oz", calories: 250, glucoseImpact: "low", icon: <Fish className="h-4 w-4" />, benefits: "Omega-3, no glucose spike" },
              { name: "Mixed Greens Salad", portion: "2 cups", calories: 50, glucoseImpact: "low", icon: <Salad className="h-4 w-4" />, benefits: "High fiber, low calories" },
              { name: "Olive Oil Dressing", portion: "2 tbsp", calories: 150, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Healthy monounsaturated fats" },
            ],
          },
        ],
        snack: [
          {
            time: "3:30 PM",
            type: "Afternoon Snack",
            totalCalories: 150,
            items: [
              { name: "Almonds", portion: "1/4 cup", calories: 100, glucoseImpact: "low", icon: <Apple className="h-4 w-4" />, benefits: "Protein + fiber" },
              { name: "Celery Sticks", portion: "4 sticks", calories: 10, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Virtually no glucose impact" },
              { name: "Cucumber Slices", portion: "1/2 cup", calories: 8, glucoseImpact: "low", icon: <Salad className="h-4 w-4" />, benefits: "Hydrating, low calorie" },
            ],
          },
        ],
        dinner: [
          {
            time: "7:00 PM",
            type: "Dinner",
            totalCalories: 500,
            items: [
              { name: "Grilled Chicken Breast", portion: "6 oz", calories: 280, glucoseImpact: "low", icon: <Fish className="h-4 w-4" />, benefits: "Lean protein source" },
              { name: "Steamed Broccoli", portion: "1.5 cups", calories: 80, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "High fiber, vitamin C" },
              { name: "Cauliflower Rice", portion: "1 cup", calories: 40, glucoseImpact: "low", icon: <Wheat className="h-4 w-4" />, benefits: "Low-carb rice alternative" },
              { name: "Olive Oil", portion: "1 tbsp", calories: 100, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Heart-healthy fats" },
            ],
          },
        ],
      };
    }

    // Normal glucose - balanced diet
    return {
      breakfast: [
        {
          time: "7:00 AM",
          type: "Breakfast",
          totalCalories: 400,
          items: [
            { name: "Steel-Cut Oatmeal", portion: "1 cup cooked", calories: 150, glucoseImpact: "medium", icon: <Wheat className="h-4 w-4" />, benefits: "Slow-release energy" },
            { name: "Mixed Berries", portion: "1/2 cup", calories: 40, glucoseImpact: "low", icon: <Apple className="h-4 w-4" />, benefits: "Antioxidants, low sugar" },
            { name: "Greek Yogurt", portion: "1/2 cup", calories: 80, glucoseImpact: "low", icon: <Milk className="h-4 w-4" />, benefits: "Protein + probiotics" },
            { name: "Walnuts", portion: "1 tbsp", calories: 50, glucoseImpact: "low", icon: <Apple className="h-4 w-4" />, benefits: "Omega-3 fatty acids" },
          ],
        },
      ],
      lunch: [
        {
          time: "12:30 PM",
          type: "Lunch",
          totalCalories: 550,
          items: [
            { name: "Quinoa", portion: "1 cup cooked", calories: 220, glucoseImpact: "medium", icon: <Wheat className="h-4 w-4" />, benefits: "Complete protein grain" },
            { name: "Grilled Chicken", portion: "4 oz", calories: 180, glucoseImpact: "low", icon: <Fish className="h-4 w-4" />, benefits: "Lean protein" },
            { name: "Roasted Vegetables", portion: "1 cup", calories: 100, glucoseImpact: "low", icon: <Salad className="h-4 w-4" />, benefits: "Fiber + vitamins" },
            { name: "Tahini Dressing", portion: "1 tbsp", calories: 50, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Healthy fats + calcium" },
          ],
        },
      ],
      snack: [
        {
          time: "3:30 PM",
          type: "Afternoon Snack",
          totalCalories: 200,
          items: [
            { name: "Apple", portion: "1 medium", calories: 95, glucoseImpact: "medium", icon: <Apple className="h-4 w-4" />, benefits: "Fiber slows sugar absorption" },
            { name: "Almond Butter", portion: "1 tbsp", calories: 100, glucoseImpact: "low", icon: <Egg className="h-4 w-4" />, benefits: "Protein + healthy fats" },
          ],
        },
      ],
      dinner: [
        {
          time: "7:00 PM",
          type: "Dinner",
          totalCalories: 600,
          items: [
            { name: "Baked Salmon", portion: "5 oz", calories: 280, glucoseImpact: "low", icon: <Fish className="h-4 w-4" />, benefits: "Omega-3 rich" },
            { name: "Sweet Potato", portion: "1 medium", calories: 130, glucoseImpact: "medium", icon: <Wheat className="h-4 w-4" />, benefits: "Complex carbs + fiber" },
            { name: "Asparagus", portion: "8 spears", calories: 30, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Low calorie, nutrient dense" },
            { name: "Lemon Herb Sauce", portion: "2 tbsp", calories: 80, glucoseImpact: "low", icon: <Leaf className="h-4 w-4" />, benefits: "Fresh, light flavoring" },
          ],
        },
      ],
    };
  };

  const mealPlan = getMealPlan();

  const getGlucoseImpactIcon = (impact: string) => {
    switch (impact) {
      case "low":
        return <ArrowDown className="h-3 w-3 text-health-normal" />;
      case "high":
        return <ArrowUp className="h-3 w-3 text-health-high" />;
      default:
        return <Minus className="h-3 w-3 text-health-low" />;
    }
  };

  const getGlucoseImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "text-health-normal bg-health-normal/10";
      case "high":
        return "text-health-high bg-health-high/10";
      default:
        return "text-health-low bg-health-low/10";
    }
  };

  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "breakfast":
        return <Coffee className="h-5 w-5" />;
      case "lunch":
        return <Sun className="h-5 w-5" />;
      case "dinner":
        return <Moon className="h-5 w-5" />;
      default:
        return <Apple className="h-5 w-5" />;
    }
  };

  const totalDailyCalories = Object.values(mealPlan)
    .flat()
    .reduce((sum, meal) => sum + meal.totalCalories, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-health transition-bounce">
          View Full Meal Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            Personalized Meal Plan
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground">Current Glucose Level</p>
              <p className="text-2xl font-bold">{Math.round(glucoseLevel)} mg/dL</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Daily Calories</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <Flame className="h-5 w-5 text-health-low" />
                {totalDailyCalories}
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {Object.entries(mealPlan).map(([mealType, meals]) => (
              <div key={mealType}>
                {meals.map((meal, mealIndex) => (
                  <Card key={mealIndex} className="p-4 bg-background/50 border-border/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getMealIcon(meal.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{meal.type}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {meal.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {meal.totalCalories} cal
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {meal.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/80 border border-border/20"
                        >
                          <div className="p-2 rounded-lg bg-secondary/50 text-primary">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getGlucoseImpactColor(item.glucoseImpact)}`}
                                >
                                  {getGlucoseImpactIcon(item.glucoseImpact)}
                                  {item.glucoseImpact} GI
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.portion} • {item.calories} cal
                            </p>
                            <p className="text-xs text-primary/80 mt-1">
                              {item.benefits}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This meal plan is personalized based on your current glucose level. 
            {glucoseLevel < 70 && " Focus on quick-acting carbs now, then stabilize."}
            {glucoseLevel > 140 && " Focus on low-glycemic foods to help lower glucose."}
            {glucoseLevel >= 70 && glucoseLevel <= 140 && " Maintain balanced eating to keep glucose stable."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
