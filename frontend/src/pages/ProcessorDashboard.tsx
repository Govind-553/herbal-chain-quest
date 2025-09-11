import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Package, QrCode, CheckCircle, Clock, Download, X } from "lucide-react";
import QRCode from "react-qr-code";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

interface ProcessingStep {
  id: string;
  name: string;
  completed: boolean;
  timestamp?: string;
  notes?: string;
}

// Corrected interface to match the data being used in the JSX
interface ProcessedBatch {
  id: string;
  status: "Complete" | "In Progress" | "Not Ready";
  date: string;
}

const ProcessorDashboard = () => {
  const { toast } = useToast();
  const [batchId, setBatchId] = useState("");
  const [qrCodeData, setQrCodeData] = useState("");
  const [isFinalized, setIsFinalized] = useState(false);
  const [recentBatches, setRecentBatches] = useState<ProcessedBatch[]>([]);
  const qrCodeRef = useRef(null);

  const initialProcessingSteps: ProcessingStep[] = [
    { id: "drying", name: "Drying", completed: false },
    { id: "cleaning", name: "Cleaning & Sorting", completed: false },
    { id: "grinding", name: "Grinding/Processing", completed: false },
    { id: "packaging", name: "Packaging", completed: false },
    { id: "labeling", name: "Labeling", completed: false },
    { id: "quality_check", name: "Final Quality Check", completed: false }
  ];
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>(initialProcessingSteps);

  useEffect(() => {
    const fetchRecentBatches = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/regulator`);
        const processed = res.data.batches
          .filter((b: any) => b.isFinalized)
          .map((b: any) => ({
            id: b.batchId,
            status: "Complete",
            date: b.qrGenerated ? new Date(b.qrGenerated).toLocaleDateString() : 'N/A'
          }));
        setRecentBatches(processed);
      } catch (error) {
        console.error("Error fetching recent batches:", error);
        setRecentBatches([]);
      }
    };

    fetchRecentBatches();
  }, [isFinalized]);

  const toggleStep = async (stepId: string) => {
    const stepToUpdate = processingSteps.find(step => step.id === stepId);
    if (!stepToUpdate) return;
    
    const updatedCompletedState = !stepToUpdate.completed;
    const updatedSteps = processingSteps.map(step => 
      step.id === stepId ? { ...step, completed: updatedCompletedState, timestamp: updatedCompletedState ? new Date().toISOString() : undefined } : step
    );
    
    setProcessingSteps(updatedSteps);

    try {
      await axios.post(`${API_BASE_URL}/processor`, {
        batchId,
        stepName: stepToUpdate.name,
        completed: updatedCompletedState,
      });
      
      toast({
        title: "Processing Step Updated",
        description: `Step '${stepToUpdate.name}' has been marked as ${updatedCompletedState ? 'completed' : 'incomplete'}.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not update the processing step on the server.",
        variant: "destructive"
      });
    }
  };

  const addStepNotes = async (stepId: string, notes: string) => {
    const updatedSteps = processingSteps.map(step =>
      step.id === stepId ? { ...step, notes } : step
    );
    setProcessingSteps(updatedSteps);

    try {
      const stepToUpdate = updatedSteps.find(step => step.id === stepId);
      await axios.post(`${API_BASE_URL}/processor`, {
        batchId,
        stepName: stepToUpdate?.name,
        notes,
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Notes Update Failed",
        description: "Could not save notes to the server.",
        variant: "destructive"
      });
    }
  };

  const generateQRCode = async () => {
    if (!batchId) {
      toast({
        title: "Missing Batch ID",
        description: "Please enter a batch ID before generating QR code.",
        variant: "destructive"
      });
      return;
    }

    const completedSteps = processingSteps.filter(step => step.completed).length;
    if (completedSteps < processingSteps.length) {
      toast({
        title: "Processing Incomplete",
        description: `Complete all ${processingSteps.length} processing steps before finalizing.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/processor/qrcode`, { batchId });
      
      const qrData = JSON.stringify(res.data.qrData);
      setQrCodeData(qrData);
      setIsFinalized(true);
      
      toast({
        title: "QR Code Generated Successfully",
        description: `QR code for batch ${batchId} is ready for scanning.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "QR Code Generation Failed",
        description: "An error occurred during QR code generation.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) {
      toast({
        title: "Download Failed",
        description: "QR code not available for download.",
        variant: "destructive"
      });
      return;
    }
    
    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) {
        toast({
            title: "Download Failed",
            description: "QR code SVG element not found.",
            variant: "destructive"
        });
        return;
    }

    const canvas = document.createElement('canvas');
    const svgWidth = svgElement.width.baseVal.value;
    const svgHeight = svgElement.height.baseVal.value;
    canvas.width = svgWidth;
    canvas.height = svgHeight;

    const ctx = canvas.getContext('2d');
    const img = new Image();

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${batchId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast({
        title: "Download Initiated",
        description: `Downloading QR code for batch ${batchId}.`,
      });
    };
    img.src = url;
  };
  
  const handleClear = () => {
    setBatchId("");
    setQrCodeData("");
    setIsFinalized(false);
    setProcessingSteps(initialProcessingSteps);
  };

  const completedSteps = processingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / processingSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Processor Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>
                  Enter batch ID and track processing steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="batchId">Batch ID</Label>
                  <div className="relative flex items-center">
                    <Input
                      id="batchId"
                      placeholder="e.g., AYR-ABC123"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="pr-8"
                    />
                    {batchId && (
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Processing Progress</Label>
                    <Badge variant="secondary">
                      {completedSteps}/{processingSteps.length} Steps
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Steps</CardTitle>
                <CardDescription>
                  Check off each step as you complete the processing workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {processingSteps.map((step) => (
                    <div key={step.id} className="border border-border rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Button
                          variant={step.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleStep(step.id)}
                          className="flex items-center gap-2"
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                          {step.completed ? "Completed" : "Mark Complete"}
                        </Button>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{step.name}</p>
                          {step.timestamp && (
                            <p className="text-xs text-muted-foreground">
                              Completed: {step.timestamp}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Textarea
                          placeholder="Add notes about this step..."
                          value={step.notes || ""}
                          onChange={(e) => addStepNotes(step.id, e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {qrCodeData ? (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-trust-green">
                    <QrCode className="h-6 w-6" />
                    QR Code Generated
                  </CardTitle>
                  <CardDescription>
                    Scan this QR code to view the complete batch information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-card p-6 rounded-lg border-2 border-dashed border-border inline-block" ref={qrCodeRef}>
                    <QRCode
                      value={qrCodeData}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox="0 0 256 256"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Batch: {batchId}</p>
                    <p className="text-sm text-muted-foreground">
                      QR Code contains batch verification data and consumer portal link
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleDownloadQR} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Finalize & Generate QR Code</CardTitle>
                  <CardDescription>
                    Complete all processing steps to generate the QR code for consumer scanning.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="bg-muted/50 p-8 rounded-lg border-2 border-dashed border-border">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">QR Code will appear here</p>
                  </div>
                  
                  <Button 
                    onClick={generateQRCode}
                    disabled={completedSteps < processingSteps.length || !batchId}
                    className="w-full"
                  >
                    {completedSteps < processingSteps.length 
                      ? `Complete ${processingSteps.length - completedSteps} more steps`
                      : "Generate QR Code"
                    }
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Processing Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Complete all processing steps in the correct order</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Add detailed notes for each step for quality assurance</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>QR code will contain batch traceability information</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Ensure batch ID matches the one from lab testing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Processed Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBatches.map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-3 border border-border rounded">
                      <div>
                        <p className="font-semibold text-sm">{batch.id}</p>
                        <p className="text-xs text-muted-foreground">{batch.date}</p>
                      </div>
                      <Badge variant={batch.status === "Complete" ? "default" : "secondary"}>
                        {batch.status}
                      </Badge>
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

export default ProcessorDashboard;