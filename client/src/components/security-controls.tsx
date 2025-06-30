import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Smartphone, Wifi, Users, Clock, MapPin } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SecuritySettings } from "@shared/schema";

interface SecurityControlsProps {
  onOpenControl: (controlType: string) => void;
}

export default function SecurityControls({ onOpenControl }: SecurityControlsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: securitySettings } = useQuery<SecuritySettings>({
    queryKey: ['/api/security-settings']
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updates: Partial<SecuritySettings>) => 
      apiRequest('PUT', '/api/security-settings', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/security-settings'] });
      toast({
        title: "Settings Updated",
        description: "Security settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggleNetworkControl = (enabled: boolean) => {
    updateSettingsMutation.mutate({ networkControlEnabled: enabled });
  };

  const securityControlItems = [
    {
      icon: Smartphone,
      title: "App Access Control",
      description: "Manage which apps can be opened by each user",
      action: () => onOpenControl('app-control'),
      hasToggle: false
    },
    {
      icon: Wifi,
      title: "Network Control",
      description: "Prevent disabling WiFi/mobile data",
      action: () => {},
      hasToggle: true,
      toggleValue: securitySettings?.networkControlEnabled || false,
      onToggle: handleToggleNetworkControl
    },
    {
      icon: Users,
      title: "Contact Filtering",
      description: "Control who can be contacted via messaging apps",
      action: () => onOpenControl('contact-filter'),
      hasToggle: false
    },
    {
      icon: Clock,
      title: "Screen Time Limits",
      description: "Set daily usage limits for apps and categories",
      action: () => onOpenControl('screen-time'),
      hasToggle: false
    },
    {
      icon: MapPin,
      title: "Location-Based Rules",
      description: "Apply different restrictions based on location",
      action: () => onOpenControl('geofencing'),
      hasToggle: false
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Security Controls</h3>
      
      <div className="space-y-4">
        {securityControlItems.map((item, index) => (
          <div key={index} className="security-control-item">
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5 text-trust-blue" />
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
            </div>
            
            {item.hasToggle ? (
              <Switch
                checked={item.toggleValue}
                onCheckedChange={item.onToggle}
                disabled={updateSettingsMutation.isPending}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={item.action}
                className="text-trust-blue hover:text-deep-blue"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
