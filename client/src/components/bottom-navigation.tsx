import { Button } from "@/components/ui/button";
import { Home, Users, BarChart3, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/family", icon: Users, label: "Family" },
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
