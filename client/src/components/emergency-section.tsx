import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartPulse, Smartphone, Laptop, Phone, Mic, ShieldAlert, MapPin, AlertTriangle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmergencySection() {
  const { toast } = useToast();
  const [emergencyActive, setEmergencyActive] = useState(false);

  const devices = [
    { name: "Emma's iPhone", status: "ONLINE", icon: <Smartphone className="h-4 w-4 text-blue-500" /> },
    { name: "Emma's Apple Watch", status: "78.89 BPM", health: "Good", icon: <HeartPulse className="h-4 w-4 text-green-500" /> },
    { name: "Alex's MacBook", status: "Online", icon: <Laptop className="h-4 w-4 text-purple-500" /> },
    { name: "Parent Phone", status: "Online", icon: <Phone className="h-4 w-4 text-orange-500" /> }
  ];

  const detections = [
    { name: "Voice monitoring", status: "Active", icon: <Mic className="h-4 w-4 text-pink-500" /> },
    { name: "AI threat detection", status: "Online", icon: <ShieldAlert className="h-4 w-4 text-red-500" /> },
    { name: "Biometric alerts", status: "Enabled", icon: <HeartPulse className="h-4 w-4 text-green-500" /> },
    { name: "Location tracking", status: "Active", icon: <MapPin className="h-4 w-4 text-blue-500" /> }
  ];

  const handleEmergencyLock = () => {
    setEmergencyActive(true);
    toast({
      title: "Emergency Lock Activated",
      description: "All devices locked and emergency protocols initiated",
      variant: "destructive",
    });
  };

  const handleUnlock = () => {
    setEmergencyActive(false);
    toast({
      title: "Emergency Lock Disabled",
      description: "All devices unlocked and normal operations resumed",
    });
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast({
            title: "Location Shared",
            description: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
            variant: "default",
          });
          console.log(`Location: ${latitude}, ${longitude}`);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: `Unable to get location: ${error.message}`,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  const handleEmergencyAlert = () => {
    const phoneNumber = "+9613136910";

    // Try to initiate a phone call
    if (navigator.userAgent.includes('Mobile') || navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone')) {
      // For mobile devices, use tel: protocol
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // For desktop, try to open a calling app or show instructions
      toast({
        title: "Emergency Alert",
        description: `Calling ${phoneNumber}. If no call is initiated, please dial manually.`,
        variant: "destructive",
      });

      // Try to open calling apps
      const callLinks = [
        `tel:${phoneNumber}`,
        `skype:${phoneNumber}?call`,
        `facetime:${phoneNumber}`,
        `whatsapp://send?phone=${phoneNumber.replace('+', '')}`
      ];

      // Try the first available method
      try {
        window.open(callLinks[0], '_blank');
      } catch (error) {
        console.log('Could not initiate call automatically');
      }
    }

    toast({
      title: "Emergency Alert Activated",
      description: `Initiating call to ${phoneNumber}`,
      variant: "destructive",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Emergency Control Center
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs flex items-center ${emergencyActive ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
          <ShieldAlert className="h-3 w-3 mr-1" />
          {emergencyActive ? 'EMERGENCY ACTIVE' : 'Monitoring'}
        </div>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Smart Devices</span>
          </TabsTrigger>
          <TabsTrigger value="detection" className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4" />
            <span>AI Detection</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-center space-x-3">
                  {device.icon}
                  <span className="text-sm font-medium">{device.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {device.health && (
                    <span className={`text-xs px-2 py-1 rounded-full ${device.health === 'Good' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
                      {device.health}
                    </span>
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-300">{device.status}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detection">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2">
            {detections.map((detection, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-center space-x-3">
                  {detection.icon}
                  <span className="text-sm font-medium">{detection.name}</span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{detection.status}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 space-y-3">
        <Button 
          onClick={emergencyActive ? handleUnlock : handleEmergencyLock}
          className={`w-full ${emergencyActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          <Lock className="h-4 w-4 mr-2" />
          {emergencyActive ? 'Unlock All Devices' : 'Emergency Lock All Devices'}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300"
            onClick={handleShareLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Share Location
          </Button>
          <Button 
            variant="outline" 
            className="bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300"
            onClick={handleEmergencyAlert}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Demo Features: Native mobile app with real-time location tracking, voice stress monitoring, remote device control, and emergency response. In production, this would be a native iOS/Android app with full device permissions.</p>
      </div>
    </div>
  );
}