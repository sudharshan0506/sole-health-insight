import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface HealthData {
  glucose: number;
  heartRate: number;
  bloodPressureSys: number;
  bloodPressureDia: number;
  temperature: number;
}

interface NotificationConfig {
  glucoseLowThreshold: number;
  glucoseHighThreshold: number;
  stepGoal: number;
}

const DEFAULT_CONFIG: NotificationConfig = {
  glucoseLowThreshold: 70,
  glucoseHighThreshold: 180,
  stepGoal: 10000,
};

export const useHealthNotifications = (
  healthData: HealthData | null,
  steps: number,
  config: NotificationConfig = DEFAULT_CONFIG
) => {
  const permissionGranted = useRef(false);
  const lastGlucoseAlert = useRef<"low" | "high" | null>(null);
  const stepGoalNotified = useRef(false);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      permissionGranted.current = true;
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      permissionGranted.current = permission === "granted";
      return permissionGranted.current;
    }

    return false;
  }, []);

  const sendNotification = useCallback((title: string, options: NotificationOptions) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          vibrate: [200, 100, 200],
          requireInteraction: true,
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Also show in-app toast
        if (options.tag?.includes("critical")) {
          toast.error(title, { description: options.body, duration: 10000 });
        } else if (options.tag?.includes("goal")) {
          toast.success(title, { description: options.body, duration: 5000 });
        } else {
          toast.warning(title, { description: options.body, duration: 5000 });
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  }, []);

  // Check glucose levels
  useEffect(() => {
    if (!healthData) return;

    const { glucose } = healthData;
    const { glucoseLowThreshold, glucoseHighThreshold } = config;

    if (glucose < glucoseLowThreshold && lastGlucoseAlert.current !== "low") {
      lastGlucoseAlert.current = "low";
      sendNotification("⚠️ CRITICAL: Low Glucose Alert!", {
        body: `Your glucose is ${Math.round(glucose)} mg/dL - dangerously low! Consume fast-acting carbs immediately.`,
        tag: "glucose-critical-low",
        urgency: "critical" as any,
      });
    } else if (glucose > glucoseHighThreshold && lastGlucoseAlert.current !== "high") {
      lastGlucoseAlert.current = "high";
      sendNotification("🚨 CRITICAL: High Glucose Alert!", {
        body: `Your glucose is ${Math.round(glucose)} mg/dL - critically high! Consider insulin and avoid carbohydrates.`,
        tag: "glucose-critical-high",
        urgency: "critical" as any,
      });
    } else if (glucose >= glucoseLowThreshold && glucose <= glucoseHighThreshold) {
      lastGlucoseAlert.current = null;
    }
  }, [healthData, config, sendNotification]);

  // Check step goal
  useEffect(() => {
    if (steps >= config.stepGoal && !stepGoalNotified.current) {
      stepGoalNotified.current = true;
      sendNotification("🎉 Step Goal Achieved!", {
        body: `Congratulations! You've reached ${steps.toLocaleString()} steps today. Keep up the great work!`,
        tag: "step-goal-reached",
      });
    }

    // Reset for next day (simplified - resets when steps drop significantly)
    if (steps < config.stepGoal * 0.1) {
      stepGoalNotified.current = false;
    }
  }, [steps, config.stepGoal, sendNotification]);

  // Check heart rate
  useEffect(() => {
    if (!healthData) return;

    const { heartRate } = healthData;

    if (heartRate > 120) {
      sendNotification("💓 High Heart Rate Warning", {
        body: `Your heart rate is ${Math.round(heartRate)} BPM. Rest and take deep breaths.`,
        tag: "heart-rate-high",
      });
    }
  }, [healthData?.heartRate, sendNotification]);

  return { requestPermission, sendNotification };
};
