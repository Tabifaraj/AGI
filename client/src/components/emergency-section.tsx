import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AIChildAvatar from "./ai-child-avatar";
import { 
  AlertTriangle, 
  Lock, 
  Shield, 
  Unlock, 
  Heart, 
  Watch, 
  Smartphone, 
  Camera, 
  Mic, 
  MapPin, 
  Contact, 
  Eye,
  Battery,
  Signal,
  Wifi,
  WifiOff
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function EmergencySection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emergencyStatus, setEmergencyStatus] = useState({
    isActive: false,
    activatedBy: null as string | null,
    activatedAt: null as Date | null,
    reason: null as string | null
  });

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
  
  const [activeTab, setActiveTab] = useState('devices');
  const [monitoringData, setMonitoringData] = useState({
    heartRate: 72,
    stressLevel: 3,
    voicePattern: 'normal',
    socialScore: 8,
    lastActivity: new Date(),
    isMonitoring: true,
  });

  // Query for active emergency events
  const { data: activeEmergencies } = useQuery({
    queryKey: ['/api/emergency/active'],
    refetchInterval: 5000 // Check every 5 seconds
  });

  // Simulate smart device monitoring
  useEffect(() => {
    const checkBiometrics = async () => {
      // Simulate smartwatch heart rate monitoring
      const heartRate = Math.floor(Math.random() * 40) + 60; // 60-100 BPM
      
      if (heartRate > 95) {
        toast({
          title: "Elevated Heart Rate Detected",
          description: `Emma's heart rate: ${heartRate} BPM - Monitoring for emergency`,
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkBiometrics, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [toast]);

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

  const emergencyLockMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency/lock-all'),
    onSuccess: () => {
      setEmergencyStatus({
        isActive: true,
        activatedBy: 'Guardian' as string,
        activatedAt: new Date() as Date,
        reason: 'Manual activation' as string
      });
      toast({
        title: "Emergency Protocol Activated",
        description: "All devices locked, GPS tracking enabled, emergency contacts notified.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-events'] });
    }
  });

  const unlockAllMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency/unlock-all'),
    onSuccess: () => {
      setEmergencyStatus({
        isActive: false,
        activatedBy: null,
        activatedAt: null,
        reason: null
      });
      toast({
        title: "Emergency Lock Disabled",
        description: "All devices unlocked. Emergency monitoring continues.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-events'] });
    }
  });

  const emergencyOverrideMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency/parent-override'),
    onSuccess: () => {
      toast({
        title: "Guardian Override Activated",
        description: "Emergency protocols disabled. Full control restored.",
      });
    }
  });

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Guardian Control Center</h2>
        </div>
        <Badge variant={emergencyStatus.isActive ? "destructive" : "secondary"} className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          {emergencyStatus.isActive ? 'EMERGENCY ACTIVE' : 'AI Monitoring Active'}
        </Badge>
      </div>

      {/* AI Child Avatars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AIChildAvatar childName="Emma" childAge={12} />
        <AIChildAvatar childName="Alex" childAge={9} />
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
              ].map((person) => (
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
                      <span className="text-green-600 font-medium">Normal</span>
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
              <MapPin className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Location Tracking</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-lg">👧</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">📍 Emma's Location</span>
                    <span className="text-green-600 font-medium">Safe Zone</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    School Campus - Last updated: 2 min ago
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">👦</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">📍 Alex's Location</span>
                    <span className="text-green-600 font-medium">Safe Zone</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Home - Last updated: 1 min ago
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Contact className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Communication Safety</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-lg">👧</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">📱 Messages monitored</span>
                    <span className="text-green-600 font-medium">Clean</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    No concerning communications detected
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">👦</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">📱 Contact restrictions</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Only approved contacts allowed
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screen' && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="h-4 w-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Screen Time Control</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-lg">👧</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">📱 Daily usage</span>
                    <span className="text-green-600 font-medium">2h 15m</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    3h 45m remaining today
                  </div>
                  <Progress value={37} className="h-1 mt-1" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">👦</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 dark:text-gray-400">💻 Study time</span>
                    <span className="text-green-600 font-medium">1h 30m</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Homework apps active
                  </div>
                  <Progress value={60} className="h-1 mt-1" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Control Section */}
      {emergencyStatus.isActive ? (
        <div className="space-y-3">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 border border-red-300">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-red-800 dark:text-red-200">EMERGENCY ACTIVE</span>
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Activated by: {emergencyStatus.activatedBy}<br/>
              Time: {emergencyStatus.activatedAt?.toLocaleTimeString()}<br/>
              Reason: {emergencyStatus.reason}
            </div>
            <div className="mt-2 flex items-center space-x-2 text-xs text-red-600">
              <Camera className="h-3 w-3" />
              <span>Live monitoring active</span>
              <Mic className="h-3 w-3 ml-2" />
              <span>Audio recording</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Unlock className="h-4 w-4 mr-2" />
                  Guardian Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Guardian Override Confirmation</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately disable all emergency protocols and restore normal device operation. 
                    Are you sure the emergency situation has been resolved?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => unlockAllMutation.mutate()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Disable Emergency Mode
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                className="emergency-button w-full"
                disabled={emergencyLockMutation.isPending}
              >
                <Lock className="h-4 w-4 mr-2" />
                {emergencyLockMutation.isPending ? 'Activating Emergency Protocol...' : 'Emergency Lock All Devices'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Emergency Protocol Activation</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately:
                  • Lock all family devices and prevent access
                  • Activate GPS tracking and live location sharing
                  • Begin real-time photo and audio monitoring
                  • Send alerts to all emergency contacts
                  • Create secure evidence trail for authorities
                  
                  Parent override will remain available. Continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => emergencyLockMutation.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Activate Emergency Protocol
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-orange-600"
              onClick={() => {
                toast({
                  title: "Heart Rate Alert Triggered",
                  description: "Simulating elevated heart rate (105 BPM) - Emergency protocols ready",
                  variant: "destructive",
                });
              }}
            >
              <Heart className="h-3 w-3 mr-1" />
              Test Heart Rate Alert
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-purple-600"
              onClick={() => {
                toast({
                  title: "Voice Alert Detected",
                  description: "AI detected distress keywords - 'Help me!' - Emergency protocols ready",
                  variant: "destructive",
                });
              }}
            >
              <Mic className="h-3 w-3 mr-1" />
              Test Voice Detection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
