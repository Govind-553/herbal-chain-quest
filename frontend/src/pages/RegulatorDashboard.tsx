import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Download, Filter, TrendingUp, CheckCircle2, Cloud, HardDrive } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:3000";

type TrustLevel = "green" | "yellow" | "red";

interface BatchData {
  batchId: string;
  species: string;
  farmer: { name: string, location: string };
  harvestDate: string;
  labTest: { trustBadge: TrustLevel };
  isFinalized: boolean;
}

const mockBatches: BatchData[] = [
  {
    batchId: "AYR-XYZ789",
    species: "Tulsi",
    farmer: { name: "Rajesh Kumar", location: "Kerala - Wayanad" },
    harvestDate: "2024-01-10",
    labTest: { trustBadge: "green" },
    isFinalized: true,
  },
  {
    batchId: "AYR-ABC456",
    species: "Ashwagandha",
    farmer: { name: "Priya Sharma", location: "Rajasthan - Jaisalmer" },
    harvestDate: "2024-01-08",
    labTest: { trustBadge: "yellow" },
    isFinalized: false,
  },
  {
    batchId: "AYR-DEF123", 
    species: "Turmeric",
    farmer: { name: "Mohan Singh", location: "Karnataka - Mysore" },
    harvestDate: "2024-01-05",
    labTest: { trustBadge: "green" },
    isFinalized: true,
  },
  {
    batchId: "AYR-GHI012",
    species: "Neem",
    farmer: { name: "Sunita Devi", location: "Madhya Pradesh - Indore" },
    harvestDate: "2024-01-03",
    labTest: { trustBadge: "red" },
    isFinalized: false,
  },
  {
    batchId: "AYR-JKL345",
    species: "Tulsi",
    farmer: { name: "Arjun Patel", location: "Tamil Nadu - Nilgiris" },
    harvestDate: "2024-01-01",
    labTest: { trustBadge: "green" },
    isFinalized: true,
  }
];

const RegulatorDashboard = () => {
  const [batches, setBatches] = useState<BatchData[]>(mockBatches);
  const [filterBy, setFilterBy] = useState("all");
  const [isLiveMode, setIsLiveMode] = useState(false);
  const { toast } = useToast();

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/dashboard/regulator`);
      const fetchedBatches = res.data.batches.map((b: any) => ({
        ...b,
        exportReady: b.labTest?.trustBadge === "green",
        location: b.farmer?.location,
        trustBadge: b.labTest?.trustBadge,
      }));
      setBatches(fetchedBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast({
        title: "Connection Failed",
        description: "Could not fetch live data. Displaying static data.",
        variant: "destructive",
      });
      setBatches(mockBatches);
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      fetchBatches();
    } else {
      setBatches(mockBatches);
    }
  }, [isLiveMode]);

  const toggleLiveMode = () => {
    setIsLiveMode(prev => {
      const newMode = !prev;
      return newMode;
    });
  };

  const filteredBatches = batches.filter(batch => {
    if (filterBy === "all") return true;
    if (filterBy === "green") return batch.labTest?.trustBadge === "green";
    if (filterBy === "yellow") return batch.labTest?.trustBadge === "yellow";
    if (filterBy === "red") return batch.labTest?.trustBadge === "red";
    return true;
  });

  const totalBatches = filteredBatches.length;
  const exportReadyBatches = filteredBatches.filter(batch => batch.isFinalized).length;
  const exportReadyPercentage = totalBatches > 0 ? Math.round((exportReadyBatches / totalBatches) * 100) : 0;
  
  const tulsiExportReady = filteredBatches.filter(batch => 
    batch.species === "Tulsi" && batch.isFinalized
  ).length;
  const totalTulsi = filteredBatches.filter(batch => batch.species === "Tulsi").length;
  const tulsiPercentage = totalTulsi > 0 ? Math.round((tulsiExportReady / totalTulsi) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* The padding top class 'pt-[72px]' prevents content from being hidden by the fixed header */}
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Regulator Dashboard</h1>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalBatches}</div>
              <div className="text-sm text-muted-foreground">This season</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Export Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-trust-green">{exportReadyPercentage}%</div>
              <div className="text-sm text-muted-foreground">{exportReadyBatches}/{totalBatches} batches</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tulsi Export Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{tulsiPercentage}%</div>
              <div className="text-sm text-muted-foreground">{tulsiExportReady}/{totalTulsi} Tulsi batches</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-trust-green">92%</div>
                <TrendingUp className="h-5 w-5 text-trust-green" />
              </div>
              <div className="text-sm text-muted-foreground">Above target</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Batch Table */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle>Batch Compliance Overview</CardTitle>
                    <CardDescription>
                      All registered batches with trust badge status and export readiness.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="All Batches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="green">Export Ready</SelectItem>
                        <SelectItem value="yellow">Under Review</SelectItem>
                        <SelectItem value="red">Non-Compliant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Trust Badge</TableHead>
                      <TableHead>Export Ready</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.batchId}>
                        <TableCell className="font-mono font-semibold">
                          {batch.batchId}
                        </TableCell>
                        <TableCell>{batch.species}</TableCell>
                        <TableCell className="text-sm">{batch.farmer.location}</TableCell>
                        <TableCell>
                          {batch.labTest?.trustBadge && <TrustBadge level={batch.labTest.trustBadge} />}
                        </TableCell>
                        <TableCell>
                          {batch.isFinalized ? (
                            <Badge className="bg-trust-green text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Not Ready
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Export Readiness & Reports */}
          <div className="space-y-6">
            <Card className="border-2 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Export Readiness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-accent">{exportReadyPercentage}%</div>
                  <p className="text-muted-foreground">
                    Tulsi batches are export-ready this season
                  </p>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-semibold mb-1">National Impact:</p>
                    <p>Total batches: {totalBatches}</p>
                    <p>{exportReadyPercentage}% ready for international export</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>
                  Generate and download regulatory compliance reports.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Harvest Rules Compliance
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Quality Check Summary
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Readiness Report
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Traceability Audit Trail
                </Button>
              </CardContent>
            </Card>

            {/* Quality Standards */}
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Standards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-trust-green/10 rounded">
                  <span>Pesticide Compliance:</span>
                  <Badge className="bg-trust-green text-white">100%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-trust-green/10 rounded">
                  <span>Heavy Metal Limits:</span>
                  <Badge className="bg-trust-green text-white">98%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-trust-yellow/10 rounded">
                  <span>Moisture Standards:</span>
                  <Badge className="bg-trust-yellow text-black">85%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-trust-green/10 rounded">
                  <span>Traceability:</span>
                  <Badge className="bg-trust-green text-white">100%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;