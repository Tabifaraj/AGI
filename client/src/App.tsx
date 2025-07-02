import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useWebSocket } from "@/hooks/use-websocket";
import Dashboard from "@/pages/dashboard";
import Family from "@/pages/family";
import Activity from "@/pages/activity";
import Settings from "@/pages/settings";
import MapTracking from "@/pages/map-tracking";
import SchoolMode from "@/pages/school-mode";
import BullyingDetection from "@/pages/bullying-detection";
import MobileIntegration from "@/pages/mobile-integration";
import MobileDemo from "@/pages/mobile-demo";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/family" component={Family} />
      <Route path="/activity" component={Activity} />
      <Route path="/settings" component={Settings} />
      <Route path="/map-tracking" component={MapTracking} />
      <Route path="/school-mode" component={SchoolMode} />
      <Route path="/bullying-detection" component={BullyingDetection} />
      <Route path="/mobile-integration" component={MobileIntegration} />
      <Route path="/mobile-demo" component={MobileDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    // Subscribe to WebSocket messages for real-time updates
    const unsubscribeConnection = subscribe('connection', (message) => {
      console.log('WebSocket connected:', message.message);
    });

    const unsubscribeEmergency = subscribe('emergency_lock_activated', (message) => {
      console.log('Emergency lock activated:', message);
      // Handle emergency notifications
    });

    const unsubscribeFamilyUpdates = subscribe('family_member_updated', (message) => {
      console.log('Family member updated:', message);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/family-members'] });
    });

    return () => {
      unsubscribeConnection();
      unsubscribeEmergency();
      unsubscribeFamilyUpdates();
    };
  }, [subscribe]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container bg-white dark:bg-gray-900">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
