import { Button } from "@/components/ui/button";
import { Home, Users, BarChart3, Settings, MapPin, School, Shield, Smartphone } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/family", icon: Users, label: "Family" },
  { path: "/map-tracking", icon: MapPin, label: "GPS" },
  { path: "/school-mode", icon: School, label: "School" },
  { path: "/bullying-detection", icon: Shield, label: "Safety" },
  { path: "/mobile-integration", icon: Smartphone, label: "Mobile" },
  { path: "/activity", icon: BarChart3, label: "Activity" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-8 items-center py-1 px-0.5 max-w-full overflow-hidden">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path} className="col-span-1">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-0.5 h-auto py-1 px-0.5 w-full text-center ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-xs truncate max-w-full leading-tight">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
