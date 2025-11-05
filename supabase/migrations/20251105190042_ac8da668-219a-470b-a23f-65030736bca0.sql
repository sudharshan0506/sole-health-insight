-- Create profiles table with patient details
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  height DECIMAL(5,2) NOT NULL CHECK (height > 0),
  weight DECIMAL(5,2) NOT NULL CHECK (weight > 0),
  mobile_number TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_history table to track all health metric changes
CREATE TABLE public.health_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  glucose_level INTEGER NOT NULL,
  heart_rate INTEGER NOT NULL,
  blood_pressure_systolic INTEGER NOT NULL,
  blood_pressure_diastolic INTEGER NOT NULL,
  temperature DECIMAL(4,2) NOT NULL,
  steps INTEGER DEFAULT 0,
  exercise_duration INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Create medication_alerts table for tablet intake reminders
CREATE TABLE public.medication_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  scheduled_time TIME NOT NULL,
  frequency TEXT NOT NULL,
  is_taken BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMPTZ,
  alert_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create food_recommendations table
CREATE TABLE public.food_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_items JSONB NOT NULL,
  calories INTEGER,
  glucose_impact TEXT,
  recommended_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for health_history
CREATE POLICY "Users can view own health history"
  ON public.health_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health history"
  ON public.health_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for medication_alerts
CREATE POLICY "Users can view own medication alerts"
  ON public.medication_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication alerts"
  ON public.medication_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication alerts"
  ON public.medication_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medication alerts"
  ON public.medication_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for food_recommendations
CREATE POLICY "Users can view own food recommendations"
  ON public.food_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food recommendations"
  ON public.food_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_health_history_user_id ON public.health_history(user_id);
CREATE INDEX idx_health_history_recorded_at ON public.health_history(recorded_at DESC);
CREATE INDEX idx_medication_alerts_user_id ON public.medication_alerts(user_id);
CREATE INDEX idx_medication_alerts_date ON public.medication_alerts(alert_date);
CREATE INDEX idx_food_recommendations_user_id ON public.food_recommendations(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, age, gender, height, weight, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'age')::INTEGER, 25),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other'),
    COALESCE((NEW.raw_user_meta_data->>'height')::DECIMAL, 170.0),
    COALESCE((NEW.raw_user_meta_data->>'weight')::DECIMAL, 70.0),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();