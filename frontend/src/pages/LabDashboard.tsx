import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FlaskConical, Search, CheckCircle } from "lucide-react";

type TrustLevel = "green" | "yellow" | "red";

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

  const computeTrustBadge = () => {
    const moisture = parseFloat(testResults.moistureLevel);
    const pesticide = testResults.pesticideResult;
    const heavyMetals = parseFloat(testResults.heavyMetals);
    const microbial = parseFloat(testResults.microbialCount);
    const activeCompounds = parseFloat(testResults.activeCompounds);

    // Trust badge computation logic
    const criticalFailures = [
      pesticide === "fail",
      heavyMetals > 10, // ppm threshold
      microbial > 100000 // cfu/g threshold  
    ];

    const minorIssues = [
      moisture > 15 || moisture < 8, // Outside optimal range
      activeCompounds < 2 // Below minimum potency
    ];

    if (criticalFailures.some(Boolean)) {
      return "red";
    } else if (minorIssues.some(Boolean)) {
      return "yellow"; 
    } else {
      return "green";
    }
  };

  const handleSubmit = () => {
    if (!batchId || !testResults.moistureLevel || !testResults.pesticideResult) {
      toast({
        title: "Missing Information",
        description: "Please fill in batch ID and required test results.",
        variant: "destructive"
      });
      return;
    }

    const trustLevel = computeTrustBadge();
    setComputedTrust(trustLevel);
    setIsSubmitted(true);
    
    toast({
      title: "Lab Results Submitted",
      description: `Trust badge computed and submitted to /labtest API.`,
    });
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
      
      {/* The padding top class 'pt-[72px]' prevents content from being hidden by the fixed header */}
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center gap-3 mb-8">
          <FlaskConical className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Lab Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lab Test Entry Form */}
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
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moisture">Moisture Level (%) *</Label>
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

          {/* Trust Badge Display */}
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

            {/* Test Standards Reference */}
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

            {/* Recent Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Lab Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "AYR-XYZ789", species: "Tulsi", trust: "green" as TrustLevel },
                    { id: "AYR-ABC456", species: "Ashwagandha", trust: "yellow" as TrustLevel },
                    { id: "AYR-DEF123", species: "Turmeric", trust: "green" as TrustLevel }
                  ].map((test) => (
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