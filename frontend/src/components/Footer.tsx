import { Link } from "react-router-dom";
import { Sprout, Mail, Github, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className={cn("bg-card border-t border-border py-12")}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-center">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 text-2xl font-bold text-primary">
              <Sprout className="h-8 w-8" />
              <span>AyurChain</span>
            </Link>
            <p className="text-center text-muted-foreground">
              AyurChain is a blockchain-based platform designed to create a transparent and trusted supply chain for Ayurvedic herbs. Our system ensures the authenticity and quality of products from the farm to the consumer.
            </p>
            <p className="flex items-center justify-center md:justify-start text-sm text-muted-foreground">
              © 2025 AyurChain. All rights reserved.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/farmer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/lab" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Lab Dashboard
                </Link>
              </li>
              <li>
                <Link to="/processor" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Processor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/regulator" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Regulator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/consumer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Consumer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@ayurchain.com" className="hover:text-primary transition-colors">
                  info@ayurchain.com
                </a>
              </li>
            </ul>
            <div className="flex justify-center md:justify-center gap-4">
              <a href="https://github.com/Govind-553/AyurChain-Blockchain-based-Traceability-of-Herbal-Products" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;