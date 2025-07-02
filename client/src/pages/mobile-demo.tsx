import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  WifiOff
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
  
  const [isParentMode, setIsParentMode] = useState(false);
  const [monitoringData, setMonitoringData] = useState({
    heartRate: 72,
    stressLevel: 3,
    voicePattern: 'normal',
    socialScore: 8,
    lastActivity: new Date(),
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
          description: "Device has been locked by parent control",
          variant: "destructive",
        });
        break;
      case 'unlock':
        setDeviceStatus(prev => ({ ...prev, isLocked: false }));
        toast({
          title: "Device Unlocked",
          description: "Device unlocked by parent override",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Mobile App Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">AGI Family Guardian</h1>
            <p className="text-blue-100 text-sm">Mobile Protection Demo</p>
          </div>
          <div className="flex items-center space-x-2">
            <Signal className="h-4 w-4" />
            <div className="flex space-x-0.5">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-white ${i < Math.ceil(deviceStatus.signalStrength / 25) ? 'opacity-100' : 'opacity-30'}`}
                  style={{ height: `${(i + 1) * 2}px` }}
                />
              ))}
            </div>
            <Battery className={`h-4 w-4 ${getBatteryColor(deviceStatus.batteryLevel)}`} />
            <span className="text-xs">{Math.round(deviceStatus.batteryLevel)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg overflow-hidden">
        {/* Device Status */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Device Status</h2>
            <Badge variant={deviceStatus.isConnected ? "default" : "secondary"}>
              {deviceStatus.isConnected ? "Connected" : "Offline"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span>{deviceStatus.deviceName}</span>
            </div>
            <div className="flex items-center space-x-2">
              {deviceStatus.isLocked ? (
                <Lock className="h-4 w-4 text-red-500" />
              ) : (
                <Unlock className="h-4 w-4 text-green-500" />
              )}
              <span>{deviceStatus.isLocked ? "Locked" : "Unlocked"}</span>
            </div>
          </div>

          {deviceStatus.location && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>
                  {deviceStatus.location.latitude.toFixed(4)}, {deviceStatus.location.longitude.toFixed(4)}
                </span>
                <span className="text-gray-500 text-xs">
                  (±{deviceStatus.location.accuracy}m)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Native Permissions */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3">Native Permissions</h2>
          <div className="space-y-3">
            {Object.entries(permissions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {key === 'location' && <MapPin className="h-4 w-4 text-blue-600" />}
                  {key === 'camera' && <Camera className="h-4 w-4 text-green-600" />}
                  {key === 'microphone' && <Mic className="h-4 w-4 text-red-600" />}
                  {key === 'contacts' && <Contact className="h-4 w-4 text-purple-600" />}
                  {key === 'notifications' && <Bell className="h-4 w-4 text-yellow-600" />}
                  {key === 'biometric' && <AlertTriangle className="h-4 w-4 text-indigo-600" />}
                  <span className="text-sm font-medium capitalize">{key}</span>
                </div>
                {value ? (
                  <Badge variant="default" className="text-xs">Granted</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => requestPermission(key as keyof DevicePermissions)}
                    className="text-xs px-2 py-1"
                  >
                    Request
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Monitoring */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3">Real-time Monitoring</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm">Heart Rate</span>
              </div>
              <span className="text-sm font-medium">{monitoringData.heartRate} BPM</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Stress Level</span>
              </div>
              <span className={`text-sm font-medium ${getStressColor(monitoringData.stressLevel)}`}>
                {monitoringData.stressLevel}/10
              </span>
            </div>

            <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-green-500" />
                <span className="text-sm">Voice Pattern</span>
              </div>
              <span className="text-sm font-medium capitalize">{monitoringData.voicePattern}</span>
            </div>

            <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Contact className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Social Score</span>
              </div>
              <span className="text-sm font-medium">{monitoringData.socialScore}/10</span>
            </div>
          </div>
        </div>

        {/* Parent Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Parent Mode</h2>
            <Switch
              checked={isParentMode}
              onCheckedChange={setIsParentMode}
            />
          </div>

          {isParentMode && (
            <div className="space-y-2">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                Parent override controls are now active
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoteCommand('lock')}
                  className="text-xs"
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Lock Device
                </Button>
                
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleRemoteCommand('unlock')}
                  className="text-xs"
                >
                  <Unlock className="h-3 w-3 mr-1" />
                  Unlock Device
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoteCommand('locate')}
                  className="text-xs"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Get Location
                </Button>
                
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoteCommand('emergency')}
                  className="text-xs"
                >
                  🚨 Emergency
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Safety Features */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Safety Features</h2>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={startLocationTracking}
              disabled={!permissions.location}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Share Current Location
            </Button>
            
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => handleRemoteCommand('emergency')}
            >
              🚨 Emergency Alert
            </Button>
            
            <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <strong>Demo Features:</strong> This demonstrates native mobile app functionality including real-time location tracking, voice stress monitoring, remote device control, and emergency response systems. In a real deployment, this would be a native iOS/Android app with full device permissions.
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {deviceStatus.isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {deviceStatus.isConnected ? "Connected to Parent System" : "Connection Lost"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last update: {monitoringData.lastActivity.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}