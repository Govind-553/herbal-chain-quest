import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { TrustBadge } from "@/components/TrustBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, QrCode, MapPin, Calendar, User, CheckCircle2, Globe, X, FlaskConical, Package, Cloud, HardDrive } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://ayurchain-blockchain-based-traceability.onrender.com";

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
    steps: {
      name: string;
      completed: boolean;
      timestamp: string;
      notes: string;
    }[];
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
    steps: [
      { name: "Drying", completed: true, timestamp: "2025-01-15T10:00:00Z", notes: "Notes for drying" },
      { name: "Cleaning & Sorting", completed: true, timestamp: "2025-01-15T12:00:00Z", notes: "Notes for cleaning" },
      { name: "Processing", completed: true, timestamp: "2025-01-15T14:00:00Z", notes: "Notes for processing" },
      { name: "Packaging", completed: true, timestamp: "2025-01-15T16:00:00Z", notes: "Notes for packaging" },
      { name: "Quality Check", completed: true, timestamp: "2025-01-15T18:00:00Z", notes: "Notes for quality check" },
    ],
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
  const [isLiveMode, setIsLiveMode] = useState(false);

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
    
    try {
      if (isLiveMode) {
        const res = await axios.get(`${API_BASE_URL}/consumer/${query}`);
        const fetchedBatchInfo = res.data.batchInfo;
        
        setBatchInfo({
          ...fetchedBatchInfo,
          globalReady: fetchedBatchInfo.labTest?.trustBadge === "green",
        });

        toast({
          title: "Product Found!",
          description: `Retrieved information for batch ${fetchedBatchInfo.batchId} from live data.`,
        });
      } else {
        if (query.toUpperCase() === mockBatchData.batchId) {
          setBatchInfo(mockBatchData);
          toast({
            title: "Product Found!",
            description: `Retrieved information for batch ${mockBatchData.batchId} from static data.`,
          });
        } else {
          setBatchInfo(null);
          toast({
            title: "Batch Not Found",
            description: "Please check the batch ID and try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error(error);
      setBatchInfo(null);
      toast({
        title: "Search Failed",
        description: "An error occurred while fetching product information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQrScan = () => {
    toast({
      title: "QR Code Scan Initiated",
      description: "Accessing camera to simulate QR scan...",
    });

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

  const toggleLiveMode = () => {
    setIsLiveMode(prev => {
      const newMode = !prev;
      toast({
        title: newMode ? "Live Data Activated" : "Static Data Activated",
        description: newMode ? "Fetching data from the backend." : "Switched to local mock data.",
      });
      setSearchQuery("");
      setBatchInfo(null);
      return newMode;
    });
  };

  const timelineSteps = [
    {
      title: "Harvest",
      date: batchInfo?.harvestDate ? new Date(batchInfo.harvestDate).toLocaleDateString() : 'N/A',
      location: batchInfo?.farmer?.location,
      icon: User,
      details: `Harvested by ${batchInfo?.farmer?.name || 'N/A'}`
    },
    {
      title: "Lab Testing",
      date: batchInfo?.labTest?.date ? new Date(batchInfo.labTest.date).toLocaleDateString() : 'N/A',
      location: "Certified Lab Facility",
      icon: FlaskConical,
      details: `Quality tested - ${batchInfo?.labTest?.pesticideResult || 'N/A'} all standards`
    },
    {
      title: "Processing",
      date: batchInfo?.processing?.date ? new Date(batchInfo.processing.date).toLocaleDateString() : 'N/A',
      location: batchInfo?.processing?.processor,
      icon: Package,
      details: `${batchInfo?.processing?.steps?.length || 0} processing steps completed`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Consumer Portal</h1>
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
                    className="pr-8"
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

        {batchInfo && (
          <div className="space-y-8">
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
                    {batchInfo.labTest?.trustBadge && <TrustBadge level={batchInfo.labTest.trustBadge} />}
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

              <div className="space-y-6">
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
                        <span className="font-semibold">{batchInfo.farmer?.name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-semibold">{batchInfo.farmer?.location || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harvest Date:</span>
                        <span className="font-semibold">
                          {batchInfo.harvestDate ? new Date(batchInfo.harvestDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 h-32 bg-muted rounded-lg flex items-center justify-center border">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Farm Location Map</p>
                        <p className="text-xs">{batchInfo.farmer?.location || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
                            {batchInfo.labTest?.moistureLevel || 'N/A'}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Pesticide Test</p>
                          <p className="text-xl font-semibold text-trust-green">
                            {batchInfo.labTest?.pesticideResult || 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-trust-green/10 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground mb-1">Lab Tested</p>
                        <p className="font-semibold">
                          {batchInfo.labTest?.date ? new Date(batchInfo.labTest.date).toLocaleDateString() : 'N/A'}
                        </p>
                        {batchInfo.labTest?.trustBadge && <TrustBadge level={batchInfo.labTest.trustBadge} className="justify-center mt-2" />}
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

            <Card>
              <CardHeader>
                <CardTitle>Processing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Processing Steps Completed:</h4>
                    <div className="space-y-2">
                      {batchInfo.processing?.steps?.map((step, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-trust-green" />
                          <span className="text-sm">{step.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Processor Details:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Facility:</strong> {batchInfo.processing?.processor || 'N/A'}</p>
                      <p><strong>Processing Date:</strong> {batchInfo.processing?.date ? new Date(batchInfo.processing.date).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>QR Generated:</strong> {batchInfo.qrGenerated ? new Date(batchInfo.qrGenerated).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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