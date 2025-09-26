import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, Calendar, Star } from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  distance: string;
  rating: number;
  specialty: string;
  emergency: boolean;
  phone: string;
}

export const HospitalFinder = () => {
  const nearbyHospitals: Hospital[] = [
    {
      id: "1",
      name: "City Medical Center",
      distance: "0.8 miles",
      rating: 4.8,
      specialty: "Endocrinology",
      emergency: true,
      phone: "(555) 123-4567"
    },
    {
      id: "2", 
      name: "Diabetes Care Clinic",
      distance: "1.2 miles",
      rating: 4.9,
      specialty: "Diabetes Specialist",
      emergency: false,
      phone: "(555) 234-5678"
    },
    {
      id: "3",
      name: "General Hospital",
      distance: "2.1 miles", 
      rating: 4.5,
      specialty: "General Medicine",
      emergency: true,
      phone: "(555) 345-6789"
    }
  ];

  const bookAppointment = (hospitalId: string) => {
    // Simulate appointment booking
    alert(`Booking appointment at ${nearbyHospitals.find(h => h.id === hospitalId)?.name}`);
  };

  const callHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getDirections = (hospitalName: string) => {
    // Simulate navigation
    alert(`Getting directions to ${hospitalName}`);
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-lg border-border/50 shadow-card-custom animate-float">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Nearby Healthcare</h3>
      </div>
      
      <div className="space-y-4">
        {nearbyHospitals.map((hospital) => (
          <div key={hospital.id} className="p-4 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">{hospital.name}</h4>
                  {hospital.emergency && (
                    <Badge className="bg-health-high text-white text-xs">
                      Emergency
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Navigation className="h-3 w-3" />
                    {hospital.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {hospital.rating}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-health-info">{hospital.specialty}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => bookAppointment(hospital.id)}
                className="flex-1 bg-health-normal text-white hover:bg-health-normal/80 transition-smooth"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Book
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => callHospital(hospital.phone)}
                className="flex-1"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => getDirections(hospital.name)}
                className="flex-1"
              >
                <Navigation className="h-3 w-3 mr-1" />
                Navigate
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:shadow-health transition-bounce">
        <MapPin className="h-4 w-4 mr-2" />
        View All on Map
      </Button>
    </Card>
  );
};