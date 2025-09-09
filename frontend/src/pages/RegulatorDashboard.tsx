import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Download, Filter, TrendingUp, CheckCircle2 } from "lucide-react";

type TrustLevel = "green" | "yellow" | "red";

interface BatchData {
  batchId: string;
  species: string;
  farmer: string;
  location: string;
  harvestDate: string;
  trustBadge: TrustLevel;
  exportReady: boolean;
  labTestDate: string;
}

const mockBatches: BatchData[] = [
  {
    batchId: "AYR-XYZ789",
    species: "Tulsi",
    farmer: "Rajesh Kumar", 
    location: "Kerala - Wayanad",
    harvestDate: "2024-01-10",
    trustBadge: "green",
    exportReady: true,
    labTestDate: "2024-01-12"
  },
  {
    batchId: "AYR-ABC456",
    species: "Ashwagandha",
    farmer: "Priya Sharma",
    location: "Rajasthan - Jaisalmer", 
    harvestDate: "2024-01-08",
    trustBadge: "yellow",
    exportReady: false,
    labTestDate: "2024-01-11"
  },
  {
    batchId: "AYR-DEF123", 
    species: "Turmeric",
    farmer: "Mohan Singh",
    location: "Karnataka - Mysore",
    harvestDate: "2024-01-05",
    trustBadge: "green",
    exportReady: true,
    labTestDate: "2024-01-08"
  },
  {
    batchId: "AYR-GHI012",
    species: "Neem",
    farmer: "Sunita Devi",
    location: "Madhya Pradesh - Indore",
    harvestDate: "2024-01-03",
    trustBadge: "red",
    exportReady: false,
    labTestDate: "2024-01-06"
  },
  {
    batchId: "AYR-JKL345",
    species: "Tulsi",
    farmer: "Arjun Patel", 
    location: "Tamil Nadu - Nilgiris",
    harvestDate: "2024-01-01",
    trustBadge: "green",
    exportReady: true,
    labTestDate: "2024-01-04"
  }
];

const RegulatorDashboard = () => {
  const totalBatches = mockBatches.length;
  const exportReadyBatches = mockBatches.filter(batch => batch.exportReady).length;
  const exportReadyPercentage = Math.round((exportReadyBatches / totalBatches) * 100);
  
  const tulsiExportReady = mockBatches.filter(batch => 
    batch.species === "Tulsi" && batch.exportReady
  ).length;
  const totalTulsi = mockBatches.filter(batch => batch.species === "Tulsi").length;
  const tulsiPercentage = Math.round((tulsiExportReady / totalTulsi) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Regulator Dashboard</h1>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Batch Compliance Overview</CardTitle>
                    <CardDescription>
                      All registered batches with trust badge status and export readiness.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="green">Export Ready</SelectItem>
                        <SelectItem value="yellow">Under Review</SelectItem>
                        <SelectItem value="red">Non-Compliant</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
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
                    {mockBatches.map((batch) => (
                      <TableRow key={batch.batchId}>
                        <TableCell className="font-mono font-semibold">
                          {batch.batchId}
                        </TableCell>
                        <TableCell>{batch.species}</TableCell>
                        <TableCell className="text-sm">{batch.location}</TableCell>
                        <TableCell>
                          <TrustBadge level={batch.trustBadge} />
                        </TableCell>
                        <TableCell>
                          {batch.exportReady ? (
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
                    <p>Total herbs this season: 5,000 kg</p>
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