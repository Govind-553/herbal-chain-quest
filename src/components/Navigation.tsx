import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  FlaskConical, 
  Package, 
  Shield, 
  Search, 
  BarChart3,
  Home
} from "lucide-react";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/farmer", label: "Farmer", icon: Sprout },
  { path: "/lab", label: "Lab", icon: FlaskConical },
  { path: "/processor", label: "Processor", icon: Package },
  { path: "/regulator", label: "Regulator", icon: Shield },
  { path: "/consumer", label: "Consumer", icon: Search },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Sprout className="h-8 w-8" />
            AyurChain
          </Link>
          
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};