import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Smartphone, 
  Wifi, 
  Bell, 
  Brain,
  ScanFace,
  Fingerprint,
  Mic,
  Users,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import type { SecuritySettings, User } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  const { data: securitySettings, isLoading } = useQuery<SecuritySettings>({
    queryKey: ['/api/security-settings']
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updates: Partial<SecuritySettings>) => 
      apiRequest('PUT', '/api/security-settings', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/security-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your security settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggleSetting = (setting: keyof SecuritySettings, value: boolean) => {
    updateSettingsMutation.mutate({ [setting]: value });
  };

  const settingSections = [
    {
      title: "Biometric Authentication",
      icon: Shield,
      settings: [
        {
          key: 'faceIdEnabled' as keyof SecuritySettings,
          title: "Face ID",
          description: "Use facial recognition for device authentication",
          icon: ScanFace,
          value: securitySettings?.faceIdEnabled || false
        },
        {
          key: 'touchIdEnabled' as keyof SecuritySettings,
          title: "Touch ID",
          description: "Use fingerprint authentication",
          icon: Fingerprint,
          value: securitySettings?.touchIdEnabled || false
        },
        {
          key: 'voiceIdEnabled' as keyof SecuritySettings,
          title: "Voice ID",
          description: "Use voice recognition for authentication",
          icon: Mic,
          value: securitySettings?.voiceIdEnabled || false
        }
      ]
    },
    {
      title: "Device Control",
      icon: Smartphone,
      settings: [
        {
          key: 'networkControlEnabled' as keyof SecuritySettings,
          title: "Network Control",
          description: "Prevent disabling WiFi and mobile data",
          icon: Wifi,
          value: securitySettings?.networkControlEnabled || false
        }
      ]
    },
    {
      title: "AI Assistant",
      icon: Brain,
      settings: [
        {
          key: 'aiAssistantEnabled' as keyof SecuritySettings,
          title: "AI Assistant",
          description: "Enable voice commands and smart recommendations",
          icon: Brain,
          value: securitySettings?.aiAssistantEnabled || false
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="p-6">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-32 rounded-lg" />
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

        {/* User Profile Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-trust-blue rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.fullName || 'User'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                <Badge variant="secondary" className="mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {user?.role === 'parent' ? 'Parent Account' : 'User Account'}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <section.icon className="h-5 w-5 text-trust-blue" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <div key={settingIndex}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <setting.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {setting.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={setting.value}
                          onCheckedChange={(checked) => 
                            handleToggleSetting(setting.key, checked)
                          }
                          disabled={updateSettingsMutation.isPending}
                        />
                      </div>
                      {settingIndex < section.settings.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contacts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securitySettings?.emergencyContacts?.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">{contact}</span>
                  <Badge variant="secondary" className="text-xs">Emergency</Badge>
                </div>
              )) || (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No emergency contacts configured
                </p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-3" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Manage Emergency Contacts
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-trust-blue rounded-lg flex items-center justify-center mx-auto mb-3">
                <SettingsIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AGI Control System</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Version 1.0.0</p>
              <Badge variant="secondary" className="text-xs">
                Advanced Security Platform
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}
