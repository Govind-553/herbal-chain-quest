import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sprout, Save, Send, Wifi, WifiOff } from "lucide-react";

const species = [
  "Tulsi (Holy Basil)",
  "Ashwagandha", 
  "Turmeric",
  "Neem",
  "Brahmi",
  "Guduchi",
  "Amla"
];

const locations = [
  "Kerala - Wayanad District",
  "Karnataka - Mysore District", 
  "Tamil Nadu - Nilgiris District",
  "Rajasthan - Jaisalmer District",
  "Madhya Pradesh - Indore District",
  "Uttarakhand - Haridwar District"
];

const FarmerDashboard = () => {
  const { toast } = useToast();
  const [isOffline, setIsOffline] = useState(false);
  const [formData, setFormData] = useState({
    species: "",
    harvestDate: "",
    location: "",
    quantity: "",
    notes: ""
  });
  const [generatedBatchId, setGeneratedBatchId] = useState("");

  // Mock sensor data generation
  const generateSensorData = () => ({
    moistureLevel: Math.round(12 + Math.random() * 8), // 12-20%
    pesticideLevel: Math.round(Math.random() * 3), // 0-3 ppm (safe range)
    temperature: Math.round(22 + Math.random() * 8), // 22-30°C
    humidity: Math.round(45 + Math.random() * 15) // 45-60%
  });

  const handleSubmit = () => {
    if (!formData.species || !formData.harvestDate || !formData.location || !formData.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const sensorData = generateSensorData();
    const batchId = `AYR-${Date.now().toString(36).toUpperCase()}`;
    setGeneratedBatchId(batchId);
    
    toast({
      title: "Harvest Data Submitted Successfully",
      description: `Batch ID: ${batchId} has been generated.`,
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved Offline",
      description: "Your data has been saved locally for when connection returns.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* The padding top class 'pt-[72px]' prevents content from being hidden by the fixed header */}
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOffline(!isOffline)}
            className="flex items-center gap-2"
          >
            {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            {isOffline ? "Offline Mode" : "Online"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Harvest Data Form */}
          <Card>
            <CardHeader>
              <CardTitle>Record Harvest Data</CardTitle>
              <CardDescription>
                Enter details about your harvest to generate a batch ID for traceability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select value={formData.species} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, species: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select herb species" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date *</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, location: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select harvest location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 150"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the harvest..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                {isOffline ? (
                  <Button onClick={handleSaveDraft} className="flex-1 flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save as Draft (Offline)
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="flex-1 flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Submit to Collector API
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generated Data Display */}
          <div className="space-y-6">
            {/* Batch ID Display */}
            {generatedBatchId && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-trust-green">Batch Generated Successfully</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Generated Batch ID</p>
                    <p className="text-2xl font-mono font-bold text-primary">{generatedBatchId}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mock Sensor Data */}
            <Card>
              <CardHeader>
                <CardTitle>Auto-Generated Sensor Data</CardTitle>
                <CardDescription>
                  Real-time environmental and quality metrics from field sensors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Moisture Level</p>
                    <p className="text-xl font-semibold text-primary">
                      {generateSensorData().moistureLevel}%
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Pesticide Level</p>
                    <p className="text-xl font-semibold text-trust-green">
                      {generateSensorData().pesticideLevel} ppm
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="text-xl font-semibold text-accent">
                      {generateSensorData().temperature}°C
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="text-xl font-semibold text-secondary-foreground">
                      {generateSensorData().humidity}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>How it Works</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Fill in harvest details and submit to generate a unique batch ID</p>
                <p>• Sensor data is automatically collected from field monitoring devices</p>
                <p>• Use offline mode to save drafts when connectivity is poor</p>
                <p>• Your batch ID will be used throughout the supply chain for traceability</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;