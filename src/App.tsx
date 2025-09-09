import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FarmerDashboard from "./pages/FarmerDashboard";
import LabDashboard from "./pages/LabDashboard";
import ProcessorDashboard from "./pages/ProcessorDashboard";
import RegulatorDashboard from "./pages/RegulatorDashboard";
import ConsumerPortal from "./pages/ConsumerPortal";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/processor" element={<ProcessorDashboard />} />
          <Route path="/regulator" element={<RegulatorDashboard />} />
          <Route path="/consumer" element={<ConsumerPortal />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
