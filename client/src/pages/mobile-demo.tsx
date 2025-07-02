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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 pb-20">
      {/* Mobile App Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">AGI Family Guardian</h1>
            <p className="text-blue-100 text-xs truncate">Mobile Protection Demo</p>
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

        {/* Emergency Control Center */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-semibold mb-3">Emergency Control Center</h2>
          
          {/* Smart Devices Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Smart Devices</h3>
            <div className="space-y-2">
              {Object.entries(permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                    {key === 'location' && <MapPin className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />}
                    {key === 'camera' && <Camera className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />}
                    {key === 'microphone' && <Mic className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />}
                    {key === 'contacts' && <Contact className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />}
                    {key === 'notifications' && <Bell className="h-3.5 w-3.5 text-yellow-600 flex-shrink-0" />}
                    {key === 'biometric' && <AlertTriangle className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />}
                    <span className="text-xs font-medium capitalize truncate">{key}</span>
                  </div>
                  {value ? (
                    <Badge variant="default" className="text-xs flex-shrink-0 ml-2">ON</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => requestPermission(key as keyof DevicePermissions)}
                      className="text-xs px-2 py-1 h-auto flex-shrink-0 ml-2"
                    >
                      Enable
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Detection Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">AI Detection</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Heart className="h-3 w-3 text-red-500 flex-shrink-0" />
                  <span className="text-xs truncate">Heart Rate</span>
                </div>
                <span className="text-xs font-medium ml-2 flex-shrink-0">{monitoringData.heartRate} BPM</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                  <span className="text-xs truncate">Stress Level</span>
                </div>
                <span className={`text-xs font-medium ml-2 flex-shrink-0 ${getStressColor(monitoringData.stressLevel)}`}>
                  {monitoringData.stressLevel}/10
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Mic className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-xs truncate">Voice Pattern</span>
                </div>
                <span className="text-xs font-medium ml-2 flex-shrink-0 capitalize">{monitoringData.voicePattern}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <Contact className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="text-xs truncate">Social Score</span>
                </div>
                <span className="text-xs font-medium ml-2 flex-shrink-0">{monitoringData.socialScore}/10</span>
              </div>
            </div>
          </div>

          {/* Parent Control Actions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Controls</h3>
              <Switch
                checked={isParentMode}
                onCheckedChange={setIsParentMode}
              />
            </div>

            {isParentMode && (
              <div className="space-y-2">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                  Parent override active
                </p>
                
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoteCommand('lock')}
                    className="text-xs px-2 py-1.5 h-auto"
                  >
                    <Lock className="h-3 w-3 mr-1" />
                    Lock
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleRemoteCommand('unlock')}
                    className="text-xs px-2 py-1.5 h-auto"
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    Unlock
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoteCommand('locate')}
                    className="text-xs px-2 py-1.5 h-auto"
                  >
                    <MapPin className="h-3 w-3 mr-1" />
                    Locate
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoteCommand('emergency')}
                    className="text-xs px-2 py-1.5 h-auto"
                  >
                    🚨 SOS
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Safety Features */}
        <div className="p-3">
          <h2 className="text-base font-semibold mb-2">Safety Features</h2>
          <div className="space-y-2">
            <Button
              className="w-full text-xs py-2"
              size="sm"
              onClick={startLocationTracking}
              disabled={!permissions.location}
            >
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              Share Current Location
            </Button>
            
            <Button
              className="w-full text-xs py-2"
              size="sm"
              variant="destructive"
              onClick={() => handleRemoteCommand('emergency')}
            >
              🚨 Emergency Alert
            </Button>
            
            <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <strong>Demo Features:</strong> Native mobile app with real-time location tracking, voice stress monitoring, remote device control, and emergency response. In production, this would be a native iOS/Android app with full device permissions.
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 flex-1 min-w-0">
            {deviceStatus.isConnected ? (
              <Wifi className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-xs font-medium truncate">
              {deviceStatus.isConnected ? "Connected to Parent System" : "Connection Lost"}
            </span>
          </div>
          <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {monitoringData.lastActivity.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}