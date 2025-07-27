import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Battery, 
  Signal, 
  MapPin, 
  Camera, 
  Mic, 
  Contact, 
  Bell,
  Lock,
  Unlock,
  AlertTriangle,
  Heart,
  Wifi,
  WifiOff,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DevicePermissions {
  location: boolean;
  camera: boolean;
  microphone: boolean;
  contacts: boolean;
  notifications: boolean;
  biometric: boolean;
}

interface DeviceStatus {
  deviceId: string;
  deviceName: string;
  isLocked: boolean;
  batteryLevel: number;
  signalStrength: number;
  isConnected: boolean;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export default function MobileDemo() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<DevicePermissions>({
    location: false,
    camera: false,
    microphone: false,
    contacts: false,
    notifications: false,
    biometric: false,
  });
  
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    deviceId: 'mobile_demo_device',
    deviceName: 'Demo Phone',
    isLocked: false,
    batteryLevel: 78,
    signalStrength: 85,
    isConnected: true,
  });
  
  const [monitoringData, setMonitoringData] = useState({
    heartRate: 72,
    stressLevel: 3,
    voicePattern: 'normal',
    socialScore: 8,
    lastActivity: new Date(),
    isMonitoring: true,
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMonitoringData(prev => ({
        ...prev,
        heartRate: 65 + Math.floor(Math.random() * 20),
        stressLevel: Math.floor(Math.random() * 10),
        lastActivity: new Date(),
      }));
      
      setDeviceStatus(prev => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - Math.random() * 0.5),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const requestPermission = async (permissionType: keyof DevicePermissions) => {
    // Simulate native permission request
    const granted = window.confirm(
      `AGI Family Guardian needs ${permissionType} permission for safety monitoring. Allow access?`
    );
    
    if (granted) {
      setPermissions(prev => ({
        ...prev,
        [permissionType]: true,
      }));
      
      toast({
        title: "Permission Granted",
        description: `${permissionType} access enabled for safety monitoring`,
      });

      // Simulate starting monitoring service
      if (permissionType === 'location') {
        startLocationTracking();
      } else if (permissionType === 'microphone') {
        startVoiceMonitoring();
      }
    } else {
      toast({
        title: "Permission Denied",
        description: `${permissionType} access is required for full safety features`,
        variant: "destructive",
      });
    }
  };

  const startLocationTracking = () => {
    // Simulate getting location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeviceStatus(prev => ({
            ...prev,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
          }));
          
          toast({
            title: "Location Tracking Started",
            description: "Your location is now being shared for safety",
          });
        },
        () => {
          // Use mock location for demo
          setDeviceStatus(prev => ({
            ...prev,
            location: {
              latitude: 40.7589,
              longitude: -73.9851,
              accuracy: 5,
            },
          }));
        }
      );
    }
  };

  const startVoiceMonitoring = () => {
    toast({
      title: "Voice Monitoring Active",
      description: "AI voice stress analysis started for bullying detection",
    });
  };

  const handleRemoteCommand = (command: string) => {
    switch (command) {
      case 'lock':
        setDeviceStatus(prev => ({ ...prev, isLocked: true }));
        toast({
          title: "Device Locked",
          description: "Device has been locked by Guardian control",
          variant: "destructive",
        });
        break;
      case 'unlock':
        setDeviceStatus(prev => ({ ...prev, isLocked: false }));
        toast({
          title: "Device Unlocked",
          description: "Device unlocked by Guardian override",
        });
        break;
      case 'emergency':
        setPermissions(prev => ({
          ...prev,
          location: true,
          notifications: true,
        }));
        toast({
          title: "Emergency Mode",
          description: "Emergency contacts notified. All safety systems active.",
          variant: "destructive",
        });
        break;
      case 'locate':
        startLocationTracking();
        break;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'text-red-600';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStressColor = (level: number) => {
    if (level >= 7) return 'text-red-600';
    if (level >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 pb-20">
      {/* Mobile App Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">AGI Family Guardian</h1>
            <p className="text-blue-100 text-xs truncate">Child Safety Interface</p>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <Signal className="h-3.5 w-3.5" />
            <div className="flex space-x-0.5">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={`w-0.5 bg-white ${i < Math.ceil(deviceStatus.signalStrength / 25) ? 'opacity-100' : 'opacity-30'}`}
                  style={{ height: `${(i + 1) * 2}px` }}
                />
              ))}
            </div>
            <Battery className={`h-3.5 w-3.5 ${getBatteryColor(deviceStatus.batteryLevel)}`} />
            <span className="text-xs">{Math.round(deviceStatus.batteryLevel)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg overflow-hidden">
        {/* Device Status */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">Device Status</h2>
            <Badge variant={deviceStatus.isConnected ? "default" : "secondary"} className="text-xs">
              {deviceStatus.isConnected ? "Connected" : "Offline"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1.5">
              <Smartphone className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
              <span className="truncate">{deviceStatus.deviceName}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {deviceStatus.isLocked ? (
                <Lock className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              ) : (
                <Unlock className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              )}
              <span className="truncate">{deviceStatus.isLocked ? "Locked" : "Unlocked"}</span>
            </div>
          </div>

          {deviceStatus.location && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate">
                  {deviceStatus.location.latitude.toFixed(4)}, {deviceStatus.location.longitude.toFixed(4)}
                </span>
                <span className="text-gray-500 text-xs flex-shrink-0">
                  (±{deviceStatus.location.accuracy}m)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Safety Monitoring */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold">Safety Monitoring</h2>
            <Badge variant="outline" className="text-xs">
              {monitoringData.isMonitoring ? 'Active' : 'Offline'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1.5">
              <Heart className={`h-3.5 w-3.5 ${getStressColor(monitoringData.stressLevel)} flex-shrink-0`} />
              <span className="truncate">Heart Rate: {monitoringData.heartRate} BPM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Mic className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              <span className="truncate">Voice: {monitoringData.voicePattern}</span>
            </div>
          </div>

          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-1.5 text-xs">
              <Eye className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
              <span className="truncate">
                Stress Level: {monitoringData.stressLevel}/10 - Social Score: {monitoringData.socialScore}/10
              </span>
            </div>
          </div>
        </div>

        {/* Permission Controls */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold mb-2">Safety Permissions</h2>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={permissions.location ? "default" : "outline"}
              size="sm"
              onClick={() => requestPermission('location')}
              className="text-xs h-8"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Location
            </Button>
            <Button
              variant={permissions.camera ? "default" : "outline"}
              size="sm"
              onClick={() => requestPermission('camera')}
              className="text-xs h-8"
            >
              <Camera className="h-3 w-3 mr-1" />
              Camera
            </Button>
            <Button
              variant={permissions.microphone ? "default" : "outline"}
              size="sm"
              onClick={() => requestPermission('microphone')}
              className="text-xs h-8"
            >
              <Mic className="h-3 w-3 mr-1" />
              Microphone
            </Button>
            <Button
              variant={permissions.contacts ? "default" : "outline"}
              size="sm"
              onClick={() => requestPermission('contacts')}
              className="text-xs h-8"
            >
              <Contact className="h-3 w-3 mr-1" />
              Contacts
            </Button>
          </div>
        </div>

        {/* Remote Commands Demo */}
        <div className="p-3">
          <h2 className="text-base font-semibold mb-2">Guardian Remote Commands</h2>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoteCommand('lock')}
              className="text-xs h-8"
            >
              <Lock className="h-3 w-3 mr-1" />
              Lock Device
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoteCommand('unlock')}
              className="text-xs h-8"
            >
              <Unlock className="h-3 w-3 mr-1" />
              Unlock Device
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoteCommand('locate')}
              className="text-xs h-8"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Share Location
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoteCommand('emergency')}
              className="text-xs h-8"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Emergency Mode
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}