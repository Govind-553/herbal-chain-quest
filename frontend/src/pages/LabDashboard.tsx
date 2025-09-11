import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FlaskConical, CheckCircle, Cloud, HardDrive } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://ayurchain-blockchain-based-traceability.onrender.com";

type TrustLevel = "green" | "yellow" | "red";

interface BatchData {
  batchId: string;
  species: string;
  farmer: { name: string, location: string };
  harvestDate: string;
  labTest: { trustBadge: TrustLevel; date: string; pesticideResult: string };
  isFinalized: boolean;
}

// Updated interface to match the data structure used for rendering
interface RecentTestItem {
  id: string;
  species: string;
  trust: TrustLevel;
}

const mockTests: RecentTestItem[] = [
  { id: "AYR-XYZ789", species: "Tulsi", trust: "green" as TrustLevel },
  { id: "AYR-ABC456", species: "Ashwagandha", trust: "yellow" as TrustLevel },
  { id: "AYR-DEF123", species: "Turmeric", trust: "green" as TrustLevel }
];

const LabDashboard = () => {
  const { toast } = useToast();
  const [batchId, setBatchId] = useState("");
  const [testResults, setTestResults] = useState({
    moistureLevel: "",
    pesticideResult: "",
    heavyMetals: "",
    microbialCount: "",
    activeCompounds: ""
  });
  const [computedTrust, setComputedTrust] = useState<TrustLevel | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [recentTests, setRecentTests] = useState(mockTests);

  const fetchRecentTests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/dashboard/regulator`);
      const fetchedBatches = res.data.batches
        .filter((b: any) => b.labTest)
        .map((b: any) => ({
          id: b.batchId,
          species: b.species,
          trust: b.labTest.trustBadge,
        }));
      setRecentTests(fetchedBatches);
    } catch (error) {
      console.error("Error fetching recent lab tests:", error);
      toast({
        title: "Connection Failed",
        description: "Could not fetch live data. Displaying static data.",
        variant: "destructive",
      });
      setIsLiveMode(false);
      setRecentTests(mockTests);
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      fetchRecentTests();
    } else {
      setRecentTests(mockTests);
    }
  }, [isLiveMode, isSubmitted]); // Re-fetch when submitted in live mode

  const toggleLiveMode = () => {
    setIsLiveMode(prev => {
      const newMode = !prev;
      toast({
        title: newMode ? "Live Data Activated" : "Static Data Activated",
        description: newMode ? "Fetching data from the backend." : "Switched to local mock data.",
      });
      return newMode;
    });
  };

  const handleSubmit = async () => {
    if (!batchId || !testResults.moistureLevel || !testResults.pesticideResult) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch ID and required test results.",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/labtest`, { batchId, testResults });
      
      setComputedTrust(res.data.trustBadge);
      setIsSubmitted(true);
      
      toast({
        title: "Lab Results Submitted",
        description: `Trust badge computed and submitted to the blockchain.`,
      });
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting test results.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setBatchId("");
    setTestResults({
      moistureLevel: "",
      pesticideResult: "",
      heavyMetals: "",
      microbialCount: "",
      activeCompounds: ""
    });
    setComputedTrust(null);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Lab Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveMode}
            className="flex items-center gap-2"
          >
            {isLiveMode ? <Cloud className="h-4 w-4" /> : <HardDrive className="h-4 w-4" />}
            {isLiveMode ? "Live Data" : "Static Data"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Lab Test Results</CardTitle>
              <CardDescription>
                Input batch ID and test results to auto-compute trust badge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="batchId">Batch ID *</Label>
                <div className="flex gap-2">
                  <Input
                    id="batchId"
                    placeholder="e.g., AYR-ABC123"
                    value={batchId}
                    onChange={(e) => setBatchId(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moisture">Moisture Level (%)*</Label>
                  <Input
                    id="moisture"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12.5"
                    value={testResults.moistureLevel}
                    onChange={(e) => setTestResults(prev => ({ ...prev, moistureLevel: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pesticide">Pesticide Test *</Label>
                  <Select 
                    value={testResults.pesticideResult}
                    onValueChange={(value) => setTestResults(prev => ({ ...prev, pesticideResult: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heavyMetals">Heavy Metals (ppm)</Label>
                  <Input
                    id="heavyMetals"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.3"
                    value={testResults.heavyMetals}
                    onChange={(e) => setTestResults(prev => ({ ...prev, heavyMetals: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="microbial">Microbial Count (cfu/g)</Label>
                  <Input
                    id="microbial"
                    type="number"
                    placeholder="e.g., 50000"
                    value={testResults.microbialCount}
                    onChange={(e) => setTestResults(prev => ({ ...prev, microbialCount: e.target.value }))}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="activeCompounds">Active Compounds (%)</Label>
                  <Input
                    id="activeCompounds"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3.2"
                    value={testResults.activeCompounds}
                    onChange={(e) => setTestResults(prev => ({ ...prev, activeCompounds: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="flex-1" disabled={isSubmitted}>
                  Submit to LabTest API
                </Button>
                {isSubmitted && (
                  <Button variant="outline" onClick={resetForm}>
                    New Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {computedTrust && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-trust-green">
                    <CheckCircle className="h-6 w-6" />
                    Trust Badge Computed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-lg font-semibold">Batch: {batchId}</div>
                    <TrustBadge level={computedTrust} className="justify-center" />
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Trust badge automatically computed based on test results and submitted to the blockchain.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Quality Standards Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between p-2 bg-trust-green/10 rounded">
                    <span>Moisture Level:</span>
                    <span className="font-semibold">8-15% (Optimal)</span>
                  </div>
                  <div className="flex justify-between p-2 bg-trust-green/10 rounded">
                    <span>Pesticide Residue:</span>
                    <span className="font-semibold">Must Pass</span>
                  </div>
                  <div className="flex justify-between p-2 bg-trust-yellow/10 rounded">
                    <span>Heavy Metals:</span>
                    <span className="font-semibold">{"<"}10 ppm</span>
                  </div>
                  <div className="flex justify-between p-2 bg-trust-yellow/10 rounded">
                    <span>Microbial Count:</span>
                    <span className="font-semibold">{"<"}100,000 cfu/g</span>
                  </div>
                  <div className="flex justify-between p-2 bg-accent/10 rounded">
                    <span>Active Compounds:</span>
                    <span className="font-semibold">{">"}2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border border-border rounded">
                      <div>
                        <p className="font-semibold text-sm">{test.id}</p>
                        <p className="text-xs text-muted-foreground">{test.species}</p>
                      </div>
                      <TrustBadge level={test.trust} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;