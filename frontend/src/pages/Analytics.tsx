import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Globe, Sprout, Calendar, Target } from "lucide-react";
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

const Analytics = () => {
  // Mock data for charts
  const batchesHarvestedData = {
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
  };

  const complianceData = {
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
  };

  const exportReadinessData = {
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
      
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="2024">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
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
                  <div className="text-4xl font-bold text-trust-green mb-2">92%</div>
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
              <div className="text-3xl font-bold text-foreground mb-1">347</div>
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
              <div className="text-3xl font-bold text-trust-green mb-1">94%</div>
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
                <Bar data={batchesHarvestedData} options={chartOptions} />
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
                <Doughnut data={complianceData} options={pieOptions} />
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
                <Line data={exportReadinessData} options={chartOptions} />
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