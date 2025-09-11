import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  FlaskConical, 
  Package, 
  Shield, 
  Search, 
  BarChart3,
  Home,
  Menu,
  X 
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border p-4 shadow-sm fixed top-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* AyurChain Logo & Title */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Sprout className="h-8 w-8" />
          <span className="text-xl">AyurChain</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 z-10 bg-card border-t border-border p-4 shadow-lg transition-all duration-300">
          <div className="flex flex-col gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  className="w-full justify-start"
                  asChild
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                >
                  <Link to={item.path} className="flex items-center gap-4">
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;