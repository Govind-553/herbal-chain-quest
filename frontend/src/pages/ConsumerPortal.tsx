import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, QrCode, MapPin, Calendar, User, CheckCircle2, Globe, X } from "lucide-react";

interface BatchInfo {
  batchId: string;
  species: string;
  farmer: {
    name: string;
    location: string;
    coordinates: { lat: number; lng: number };
  };
  harvestDate: string;
  labTest: {
    date: string;
    moistureLevel: number;
    pesticideResult: string;
    trustBadge: "green" | "yellow" | "red";
  };
  processing: {
    date: string;
    steps: string[];
    processor: string;
  };
  globalReady: boolean;
  qrGenerated: string;
}

const mockBatchData: BatchInfo = {
  batchId: "AYR-XYZ789",
  species: "Tulsi (Holy Basil)",
  farmer: {
    name: "Rajesh Kumar",
    location: "Wayanad District, Kerala",
    coordinates: { lat: 11.6854, lng: 76.1320 }
  },
  harvestDate: "2025-01-10",
  labTest: {
    date: "2025-01-12",
    moistureLevel: 12.3,
    pesticideResult: "Pass",
    trustBadge: "green"
  },
  processing: {
    date: "2025-01-15",
    steps: ["Drying", "Cleaning & Sorting", "Processing", "Packaging", "Quality Check"],
    processor: "AyurChain Certified Processor"
  },
  globalReady: true,
  qrGenerated: "2025-01-16T10:30:00Z"
};

const ConsumerPortal = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) {
      toast({
        title: "Enter Batch ID",
        description: "Please enter a batch ID to search for product information.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (query.toUpperCase().includes("AYR") || query.includes("XYZ789")) {
        setBatchInfo(mockBatchData);
        toast({
          title: "Product Found!",
          description: `Retrieved information for batch ${mockBatchData.batchId}`,
        });
      } else {
        setBatchInfo(null);
        toast({
          title: "Batch Not Found",
          description: "Please check the batch ID and try again.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleQrScan = () => {
    toast({
      title: "QR Code Scan Initiated",
      description: "Accessing camera to scan QR code...",
    });

    // Simulate a successful scan after a delay
    setTimeout(() => {
        const scannedData = "AYR-XYZ789";
        setSearchQuery(scannedData);
        handleSearch(scannedData);
    }, 2000);
  };

  const handleClear = () => {
    setSearchQuery("");
    setBatchInfo(null);
  };

  const timelineSteps = [
    {
      title: "Harvest",
      date: batchInfo?.harvestDate,
      location: batchInfo?.farmer.location,
      icon: User,
      details: `Harvested by ${batchInfo?.farmer.name}`
    },
    {
      title: "Lab Testing",
      date: batchInfo?.labTest.date,
      location: "Certified Lab Facility",
      icon: Search,
      details: `Quality tested - ${batchInfo?.labTest.pesticideResult} all standards`
    },
    {
      title: "Processing",
      date: batchInfo?.processing.date,
      location: batchInfo?.processing.processor,
      icon: CheckCircle2,
      details: `${batchInfo?.processing.steps.length} processing steps completed`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* The padding top class 'pt-[72px]' prevents content from being hidden by the fixed header */}
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center gap-3 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Consumer Portal</h1>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Product Traceability Lookup</CardTitle>
            <CardDescription>
              Scan QR code or enter batch ID to view complete product provenance and quality information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative flex items-center">
                  <Input
                    placeholder="Enter Batch ID (e.g., AYR-XYZ789)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pr-8" // Adjusted padding for the clear button
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      className="absolute right-1 w-7 h-7"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => handleSearch()} 
                  disabled={isLoading} 
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
                <Button 
                  onClick={handleQrScan} 
                  variant="outline" 
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Information Display */}
        {batchInfo && (
          <div className="space-y-8">
            {/* Product Header */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{batchInfo.species}</CardTitle>
                    <CardDescription className="text-lg">
                      Batch ID: <span className="font-mono font-bold">{batchInfo.batchId}</span>
                    </CardDescription>
                  </div>
                  <div className="text-right space-y-2">
                    <TrustBadge level={batchInfo.labTest.trustBadge} />
                    {batchInfo.globalReady && (
                      <Badge className="bg-accent text-accent-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Global Ready
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Provenance Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Provenance Timeline</CardTitle>
                  <CardDescription>
                    Complete journey from farm to your hands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {timelineSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary-foreground" />
                            </div>
                            {index < timelineSteps.length - 1 && (
                              <div className="w-0.5 h-12 bg-border mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold">{step.title}</h3>
                              <span className="text-sm text-muted-foreground">{step.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{step.location}</p>
                            <p className="text-sm">{step.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Farm Origin & Quality Details */}
              <div className="space-y-6">
                {/* Farm Origin */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Farm Origin
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Farmer:</span>
                        <span className="font-semibold">{batchInfo.farmer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-semibold">{batchInfo.farmer.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harvest Date:</span>
                        <span className="font-semibold">
                          {new Date(batchInfo.harvestDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Mock Mini Map */}
                    <div className="mt-4 h-32 bg-muted rounded-lg flex items-center justify-center border">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Farm Location Map</p>
                        <p className="text-xs">Kerala, India</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-trust-green" />
                      Quality Assurance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Moisture Level</p>
                          <p className="text-xl font-semibold text-primary">
                            {batchInfo.labTest.moistureLevel}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Pesticide Test</p>
                          <p className="text-xl font-semibold text-trust-green">
                            {batchInfo.labTest.pesticideResult}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-trust-green/10 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-1">Lab Tested</p>
                        <p className="font-semibold">
                          {new Date(batchInfo.labTest.date).toLocaleDateString()}
                        </p>
                        <TrustBadge level={batchInfo.labTest.trustBadge} className="justify-center mt-2" />
                      </div>

                      {batchInfo.globalReady && (
                        <div className="p-3 bg-accent/10 rounded-lg text-center">
                          <Badge className="bg-accent text-accent-foreground mb-2">
                            <Globe className="h-4 w-4 mr-1" />
                            Export Quality Certified
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            This product meets international export standards
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Processing Steps Completed:</h4>
                    <div className="space-y-2">
                      {batchInfo.processing.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-trust-green" />
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Processor Details:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Facility:</strong> {batchInfo.processing.processor}</p>
                      <p><strong>Processing Date:</strong> {new Date(batchInfo.processing.date).toLocaleDateString()}</p>
                      <p><strong>QR Generated:</strong> {new Date(batchInfo.qrGenerated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions when no data */}
        {!batchInfo && (
          <Card>
            <CardContent className="text-center py-12">
              <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Verify Your Product</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Enter the batch ID from your product packaging or scan the QR code to view complete 
                traceability information, quality certificates, and farm origin details.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Try sample batch ID: <code className="bg-muted px-2 py-1 rounded">AYR-XYZ789</code></p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ConsumerPortal;