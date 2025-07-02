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
    <div className="bottom-nav">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`bottom-nav-item ${isActive ? 'active' : 'inactive'}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
