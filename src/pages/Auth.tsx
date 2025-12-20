import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Heart, Activity, User, Mail, Phone, Ruler, Weight, Calendar } from "lucide-react";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  age: z.number().min(1, "Age must be at least 1").max(150, "Invalid age"),
  gender: z.string().min(1, "Please select a gender"),
  height: z.number().min(30, "Height must be at least 30 cm").max(300, "Invalid height"),
  weight: z.number().min(1, "Weight must be at least 1 kg").max(500, "Invalid weight"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits").max(15),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const validationResult = signUpSchema.safeParse({
          email,
          password,
          fullName,
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          mobileNumber,
        });

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          toast.error(firstError.message);
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, {
          full_name: fullName,
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          mobile_number: mobileNumber,
          email,
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully! Welcome to Smart Shoe Health Monitor.");
          navigate("/dashboard");
        }
      } else {
        const validationResult = signInSchema.safeParse({ email, password });

        if (!validationResult.success) {
          const firstError = validationResult.error.errors[0];
          toast.error(firstError.message);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);

        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center">
        <div className="animate-pulse-glow">
          <Heart className="h-16 w-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-primary animate-pulse-glow" />
            <Activity className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-primary bg-clip-text text-transparent">
            Smart Shoe Health Monitor
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your patient profile to get started" : "Welcome back! Sign in to continue"}
          </p>
        </div>

        <Card className="p-8 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min="1"
                      max="150"
                      className="bg-background/50"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Gender
                    </Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      required
                      min="30"
                      max="300"
                      className="bg-background/50"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-primary" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      min="1"
                      max="500"
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-health transition-bounce text-lg py-6"
            >
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline transition-smooth"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
