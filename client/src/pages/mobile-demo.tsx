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
  WifiOff,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
d
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
  const [activeTab, setActiveTab] = useState('devices');
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
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Emergency Control Center</h2>
            </div>
            <Badge variant="outline" className="text-xs border-gray-400 text-gray-600">
              {monitoringData.isMonitoring ? 'Monitoring' : 'Offline'}
            </Badge>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4">
            <Button
              size="sm"
              variant={activeTab === 'devices' ? 'default' : 'outline'}
              onClick={() => setActiveTab('devices')}
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Smartphone className="h-3 w-3" />
              <span>Smart Devices</span>
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'ai' ? 'default' : 'outline'}
              onClick={() => setActiveTab('ai')}
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Heart className="h-3 w-3" />
              <span>AI Detection</span>
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'location' ? 'default' : 'outline'}
              onClick={() => setActiveTab('location')}
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <MapPin className="h-3 w-3" />
              <span>Location</span>
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'communication' ? 'default' : 'outline'}
              onClick={() => setActiveTab('communication')}
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Contact className="h-3 w-3" />
              <span>Communication</span>
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'screen' ? 'default' : 'outline'}
              onClick={() => setActiveTab('screen')}
              className="flex items-center space-x-1 text-xs px-2 py-1"
            >
              <Eye className="h-3 w-3" />
              <span>Screen Time</span>
            </Button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 mb-4">
            {activeTab === 'devices' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Smart Devices</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-lg">👧</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">📱 Emma's iPhone</span>
                        <span className="text-green-600 font-medium">ONLINE</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">⌚ Emma's Apple Watch - Heart rate:</span>
                        <div className="flex items-center space-x-1">
                          <Badge className="bg-green-100 text-green-800 text-xs">78 BPM</Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs">Good</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg">👦</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">💻 Alex's MacBook</span>
                        <span className="text-green-600 font-medium">Online</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">📱 Parent Phone</span>
                        <span className="text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">AI Detection</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: 'Emma', avatar: '👧', color: 'pink' },
                    { name: 'Alex', avatar: '👦', color: 'blue' },
                    { name: 'Mom', avatar: '👩', color: 'purple' }
                  ].map((person, index) => (
                    <div key={person.name} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-${person.color}-100 flex items-center justify-center`}>
                        <span className="text-lg">{person.avatar}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Mic className="h-3 w-3 text-green-500" />
                            <span className="text-gray-600 dark:text-gray-400">Voice monitoring:</span>
                          </div>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-purple-500" />
                            <span className="text-gray-600 dark:text-gray-400">AI threat detection:</span>
                          </div>
                          <span className="text-green-600 font-medium">Online</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span className="text-gray-600 dark:text-gray-400">Biometric alerts:</span>
                          </div>
                          <span className="text-green-600 font-medium">Enabled</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-400">Location tracking:</span>
                          </div>
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Location Tracking</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🏠 Emma at Home</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Safe Zone</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🏫 Alex at School</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Safe Zone</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🚗 Mom Driving</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">In Transit</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">📍 Geofence Alerts</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">⚠️ Danger Zone Alerts</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Contact className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Communication Safety</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">📱 Text Message Scanning</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🚫 Cyberbullying Detection</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">👥 Stranger Contact Alerts</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🔒 Inappropriate Content Block</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">📞 Emergency Contacts</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">5 Active</Badge>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'screen' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Screen Time Control</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">📱 Daily Screen Limit</span>
                    <Badge className="bg-orange-100 text-orange-800 text-xs">2h 45m / 4h</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🎮 App Usage Monitoring</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🚫 Inappropriate App Block</span>
                    <Badge className="bg-red-100 text-red-800 text-xs">3 Blocked</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">🕐 Bedtime Mode</span>
                    <span className="text-blue-600 font-medium">9:00 PM - 7:00 AM</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">📚 Educational Apps</span>
                    <span className="text-green-600 font-medium">Unlimited</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Lock Button */}
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mb-3"
            onClick={() => handleRemoteCommand('emergency')}
          >
            <Lock className="h-4 w-4 mr-2" />
            Emergency Lock All Devices
          </Button>

          {/* Test Buttons */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-orange-600 border-orange-300 hover:bg-orange-50"
              onClick={() => {
                // Test heart rate alert
                console.log('Testing heart rate alert...');
              }}
            >
              <Heart className="h-3 w-3 mr-1" />
              Test Heart Rate Alert
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-purple-600 border-purple-300 hover:bg-purple-50"
              onClick={() => {
                // Test voice detection
                console.log('Testing voice detection...');
              }}
            >
              <Mic className="h-3 w-3 mr-1" />
              Test Voice Detection
            </Button>
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