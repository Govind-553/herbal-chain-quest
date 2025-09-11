import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { 
  Sprout, 
  FlaskConical, 
  Package, 
  Shield, 
  Search, 
  BarChart3,
  ArrowRight
} from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

const dashboards = [
  {
    title: "Farmer Dashboard",
    description: "Record harvest data, generate batch IDs, and manage crop information with offline support.",
    path: "/farmer",
    icon: Sprout,
    color: "text-primary"
  },
  {
    title: "Lab Dashboard", 
    description: "Enter test results and auto-compute trust badges for quality assurance.",
    path: "/lab",
    icon: FlaskConical,
    color: "text-trust-green"
  },
  {
    title: "Processor Dashboard",
    description: "Track processing steps, generate QR codes, and finalize batch processing.",
    path: "/processor", 
    icon: Package,
    color: "text-accent"
  },
  {
    title: "Regulator Dashboard",
    description: "Monitor compliance, view trust badges, and track export readiness metrics.",
    path: "/regulator",
    icon: Shield,
    color: "text-trust-yellow"
  },
  {
    title: "Consumer Portal",
    description: "Scan QR codes to view product provenance and quality information.",
    path: "/consumer",
    icon: Search,
    color: "text-secondary-foreground"
  },
  {
    title: "Analytics Dashboard",
    description: "View comprehensive charts, metrics, and national impact statistics.",
    path: "/analytics",
    icon: BarChart3,
    color: "text-trust-red"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-[72px]">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="Agricultural supply chain"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            AyurChain
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete Agricultural Traceability System for Herbal Products
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Track your products from farm to consumer with blockchain-style transparency, 
            quality assurance, and export readiness monitoring.
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Choose Your Dashboard
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              
              return (
                <Card key={dashboard.path} className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 ${dashboard.color}`} />
                      <CardTitle className="text-xl">{dashboard.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-6 leading-relaxed">
                      {dashboard.description}
                    </CardDescription>
                    <Button asChild className="w-full group-hover:bg-primary-light transition-colors">
                      <Link to={dashboard.path} className="flex items-center justify-center gap-2">
                        Access Dashboard
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-trust-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-trust-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust Badge System</h3>
              <p className="text-muted-foreground">Automated quality assessment with green, yellow, and red trust badges.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Readiness</h3>
              <p className="text-muted-foreground">Track national impact metrics and export-quality batch percentages.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Traceability</h3>
              <p className="text-muted-foreground">Complete provenance tracking from farmer to consumer with QR codes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;