import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Globe, Sprout, Calendar, Target, Cloud, HardDrive } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; // Corrected: Added the import for Button

const API_BASE_URL = "http://localhost:3000";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const staticAnalyticsData = {
  totalBatches: 347,
  exportReadyPercentage: 92,
  batchesHarvestedData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Batches Harvested",
        data: [45, 52, 38, 65, 42, 58],
        backgroundColor: "hsl(var(--primary))",
        borderColor: "hsl(var(--primary))",
        borderWidth: 1,
      }
    ]
  },
  complianceData: {
    labels: ["Passed", "Under Review", "Failed"],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: [
          "hsl(var(--trust-green))",
          "hsl(var(--trust-yellow))", 
          "hsl(var(--trust-red))"
        ],
        borderWidth: 2,
        borderColor: "#fff"
      }
    ]
  },
  exportReadinessData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Export Ready %",
        data: [78, 82, 85, 88, 92, 86],
        borderColor: "hsl(var(--accent))",
        backgroundColor: "hsl(var(--accent) / 0.1)",
        tension: 0.4,
        fill: true,
      }
    ]
  },
};

const Analytics = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(staticAnalyticsData);
  const { toast } = useToast();

  const fetchLiveAnalyticsData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/dashboard/analytics`);
      const { totalBatches, trustBadgeCounts } = res.data;

      // Update state with live data from the backend
      setAnalyticsData({
        ...staticAnalyticsData, // Keep static chart data for now, or replace it if your API returns it
        totalBatches,
        exportReadyPercentage: totalBatches > 0 ? Math.round((trustBadgeCounts.green / totalBatches) * 100) : 0,
        complianceData: {
          ...staticAnalyticsData.complianceData,
          datasets: [
            {
              ...staticAnalyticsData.complianceData.datasets[0],
              data: [trustBadgeCounts.green || 0, trustBadgeCounts.yellow || 0, trustBadgeCounts.red || 0]
            }
          ]
        }
      });
    } catch (error) {
      console.error("Error fetching live analytics data:", error);
      toast({
        title: "Connection Failed",
        description: "Could not fetch live data. Displaying static data.",
        variant: "destructive",
      });
      setIsLiveMode(false);
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      fetchLiveAnalyticsData();
    } else {
      setAnalyticsData(staticAnalyticsData);
    }
  }, [isLiveMode]);

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* The padding top class 'pt-[72px]' prevents content from being hidden by the fixed header */}
      <div className="container mx-auto p-6 pt-[72px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          
          <div className="flex gap-2">
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
        </div>

        {/* National Impact Banner */}
        <Card className="mb-8 border-2 border-accent bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="py-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                <Globe className="h-8 w-8 text-accent" />
                National Impact Highlights
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">5,000</div>
                  <div className="text-sm text-muted-foreground">Total Herbs This Season (kg)</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-trust-green mb-2">{analyticsData.exportReadyPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Ready for Export</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">Registered Farmers</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm">Active Batches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{analyticsData.totalBatches}</div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-trust-green" />
                <span className="text-sm text-trust-green">+12% vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-trust-green" />
                <CardTitle className="text-sm">Quality Pass Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-trust-green mb-1">{analyticsData.exportReadyPercentage}%</div>
              <div className="text-sm text-muted-foreground">Above industry standard</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" />
                <CardTitle className="text-sm">Export Revenue</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent mb-1">₹2.3M</div>
              <div className="text-sm text-muted-foreground">This quarter</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary-foreground" />
                <CardTitle className="text-sm">Processing Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-foreground mb-1">3.2</div>
              <div className="text-sm text-muted-foreground">Days avg. farm-to-market</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Batches Harvested Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Batches Harvested Over Time</CardTitle>
              <CardDescription>
                Monthly harvest volume showing seasonal trends and growth patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={analyticsData.batchesHarvestedData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Compliance Percentage */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Compliance Distribution</CardTitle>
              <CardDescription>
                Percentage of batches passing compliance checks across all quality metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <Doughnut data={analyticsData.complianceData} options={pieOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Export Readiness Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Export Readiness Metrics</CardTitle>
              <CardDescription>
                Monthly percentage of batches meeting international export quality standards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={analyticsData.exportReadinessData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Species Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Species</CardTitle>
              <CardDescription>
                Species with highest export readiness and quality scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Tulsi (Holy Basil)", batches: 89, exportReady: 95, quality: "Excellent" },
                  { name: "Turmeric", batches: 76, exportReady: 92, quality: "Excellent" },
                  { name: "Ashwagandha", batches: 54, exportReady: 88, quality: "Good" },
                  { name: "Neem", batches: 43, exportReady: 85, quality: "Good" },
                  { name: "Brahmi", batches: 32, exportReady: 90, quality: "Excellent" }
                ].map((species) => (
                  <div key={species.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold">{species.name}</p>
                      <p className="text-sm text-muted-foreground">{species.batches} batches</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-trust-green">{species.exportReady}%</p>
                      <Badge variant={species.quality === "Excellent" ? "default" : "secondary"}>
                        {species.quality}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <CardDescription>
                Export readiness by state and district performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { region: "Kerala - Wayanad", batches: 58, exportReady: 96, revenue: "₹580K" },
                  { region: "Karnataka - Mysore", batches: 45, exportReady: 94, revenue: "₹450K" },
                  { region: "Tamil Nadu - Nilgiris", batches: 39, exportReady: 91, revenue: "₹390K" },
                  { region: "Rajasthan - Jaisalmer", batches: 34, exportReady: 88, revenue: "₹340K" },
                  { region: "Madhya Pradesh - Indore", batches: 28, exportReady: 85, revenue: "₹280K" }
                ].map((region) => (
                  <div key={region.region} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{region.region}</p>
                      <p className="text-xs text-muted-foreground">{region.batches} batches</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-trust-green text-sm">{region.exportReady}%</p>
                      <p className="text-xs text-muted-foreground">{region.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;