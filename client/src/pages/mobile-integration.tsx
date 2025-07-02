import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Download, 
  Shield, 
  MapPin, 
  Camera, 
  Mic, 
  Contact, 
  Bell,
  Battery,
  Signal,
  Lock,
  Unlock,
  AlertTriangle
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MobileDevice {
  deviceId: string;
  deviceName: string;
  platform: 'iOS' | 'Android';
  appVersion: string;
  isConnected: boolean;
  lastSeen: Date;
  batteryLevel: number;
  signalStrength: number;
  permissions: {
    location: boolean;
    camera: boolean;
    microphone: boolean;
    contacts: boolean;
    notifications: boolean;
    biometric: boolean;
  };
  securityStatus: {
    isLocked: boolean;
    schoolModeActive: boolean;
    emergencyModeActive: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
  };
}

export default function MobileIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  // Mock mobile devices data
  const mockDevices: MobileDevice[] = [
    {
      deviceId: "ios_emma_device",
      deviceName: "Emma's iPhone 14",
      platform: "iOS",
      appVersion: "1.2.3",
      isConnected: true,
      lastSeen: new Date(Date.now() - 2 * 60000),
      batteryLevel: 78,
      signalStrength: 85,
      permissions: {
        location: true,
        camera: false,
        microphone: true,
        contacts: true,
        notifications: true,
        biometric: true,
      },
      securityStatus: {
        isLocked: false,
        schoolModeActive: false,
        emergencyModeActive: false,
      },
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        accuracy: 5,
        timestamp: new Date(Date.now() - 30000),
      },
    },
    {
      deviceId: "android_jake_device",
      deviceName: "Jake's Samsung Galaxy",
      platform: "Android",
      appVersion: "1.2.3",
      isConnected: false,
      lastSeen: new Date(Date.now() - 15 * 60000),
      batteryLevel: 23,
      signalStrength: 60,
      permissions: {
        location: true,
        camera: true,
        microphone: true,
        contacts: false,
        notifications: true,
        biometric: false,
      },
      securityStatus: {
        isLocked: true,
        schoolModeActive: true,
        emergencyModeActive: false,
      },
      location: {
        latitude: 40.7614,
        longitude: -73.9776,
        accuracy: 12,
        timestamp: new Date(Date.now() - 15 * 60000),
      },
    },
  ];

  const sendMobileCommand = useMutation({
    mutationFn: ({ deviceId, command }: { deviceId: string; command: any }) =>
      apiRequest('POST', `/api/mobile-command`, { deviceId, command }),
    onSuccess: (_, variables) => {
      toast({
        title: "Command Sent",
        description: `${variables.command.type} command sent to ${variables.deviceId}`,
      });
    },
  });

  const updatePermission = useMutation({
    mutationFn: ({ deviceId, permission, enabled }: { deviceId: string; permission: string; enabled: boolean }) =>
      apiRequest('POST', `/api/mobile-permissions`, { deviceId, permissions: { [permission]: enabled } }),
    onSuccess: () => {
      toast({
        title: "Permission Updated",
        description: "Mobile device permission has been changed",
      });
    },
  });

  const getStatusColor = (device: MobileDevice) => {
    if (!device.isConnected) return 'text-red-600';
    if (device.securityStatus.emergencyModeActive) return 'text-orange-600';
    if (device.securityStatus.isLocked) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'text-red-600';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.ceil(strength / 25);
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 bg-current ${i < bars ? 'opacity-100' : 'opacity-30'}`}
        style={{ height: `${(i + 1) * 3}px` }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mobile App Integration</h1>
            <p className="text-gray-600 dark:text-gray-400">Native device permissions and real-time mobile control</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Smartphone className="h-3 w-3 mr-1" />
              {mockDevices.filter(d => d.isConnected).length} devices online
            </Badge>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download Mobile App
            </Button>
          </div>
        </div>

        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Connected Devices</TabsTrigger>
            <TabsTrigger value="permissions">Native Permissions</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="deployment">App Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockDevices.map((device) => (
                <Card key={device.deviceId} className="border-2 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">{device.deviceName}</div>
                          <div className="text-sm text-gray-500">{device.platform} • v{device.appVersion}</div>
                        </div>
                      </div>
                      <Badge variant={device.isConnected ? "default" : "secondary"}>
                        {device.isConnected ? "Online" : "Offline"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Device Status */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Battery className={`h-4 w-4 ${getBatteryColor(device.batteryLevel)}`} />
                        <span>{device.batteryLevel}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Signal className="h-4 w-4" />
                        <div className="flex items-end space-x-0.5 h-3">
                          {getSignalBars(device.signalStrength)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {device.securityStatus.isLocked ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                        <span>{device.securityStatus.isLocked ? "Locked" : "Unlocked"}</span>
                      </div>
                    </div>

                    {/* Location Info */}
                    {device.location && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span>
                            {device.location.latitude.toFixed(4)}, {device.location.longitude.toFixed(4)}
                          </span>
                          <span className="text-gray-500">
                            (±{device.location.accuracy}m)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last updated: {device.location.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    )}

                    {/* Security Status */}
                    <div className="flex flex-wrap gap-2">
                      {device.securityStatus.schoolModeActive && (
                        <Badge variant="outline" className="text-xs">
                          📚 School Mode
                        </Badge>
                      )}
                      {device.securityStatus.emergencyModeActive && (
                        <Badge variant="destructive" className="text-xs">
                          🚨 Emergency Mode
                        </Badge>
                      )}
                      {!device.isConnected && (
                        <Badge variant="secondary" className="text-xs">
                          Last seen: {device.lastSeen.toLocaleTimeString()}
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant={device.securityStatus.isLocked ? "default" : "destructive"}
                        onClick={() => sendMobileCommand.mutate({
                          deviceId: device.deviceId,
                          command: { type: device.securityStatus.isLocked ? 'unlock_device' : 'lock_device' }
                        })}
                        disabled={!device.isConnected}
                      >
                        {device.securityStatus.isLocked ? (
                          <><Unlock className="h-3 w-3 mr-1" />Unlock</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" />Lock</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendMobileCommand.mutate({
                          deviceId: device.deviceId,
                          command: { type: 'request_location' }
                        })}
                        disabled={!device.isConnected}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Locate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockDevices.map((device) => (
                <Card key={device.deviceId}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Smartphone className="h-5 w-5" />
                      <span>{device.deviceName}</span>
                      <Badge variant={device.isConnected ? "default" : "secondary"} className="text-xs">
                        {device.isConnected ? "Live" : "Offline"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Location Access</span>
                        </div>
                        <Switch
                          checked={device.permissions.location}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'location',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Camera className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Camera Access</span>
                        </div>
                        <Switch
                          checked={device.permissions.camera}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'camera',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mic className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">Microphone Access</span>
                        </div>
                        <Switch
                          checked={device.permissions.microphone}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'microphone',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Contact className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Contacts Access</span>
                        </div>
                        <Switch
                          checked={device.permissions.contacts}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'contacts',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Notifications</span>
                        </div>
                        <Switch
                          checked={device.permissions.notifications}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'notifications',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm font-medium">Biometric Access</span>
                        </div>
                        <Switch
                          checked={device.permissions.biometric}
                          onCheckedChange={(enabled) => updatePermission.mutate({
                            deviceId: device.deviceId,
                            permission: 'biometric',
                            enabled
                          })}
                          disabled={!device.isConnected}
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-xs text-blue-800 dark:text-blue-200">
                          <strong>Native Permissions:</strong> These controls directly manage device-level permissions through the mobile app. Changes take effect immediately and override app-level settings.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Data Streams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Location Updates</span>
                      </div>
                      <span className="text-xs text-green-700 dark:text-green-300">Live • 30s interval</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Voice Stress Analysis</span>
                      </div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">AI Processing</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Contact Patterns</span>
                      </div>
                      <span className="text-xs text-purple-700 dark:text-purple-300">Social Monitoring</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Emergency Sensors</span>
                      </div>
                      <span className="text-xs text-red-700 dark:text-red-300">Always Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Background Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium mb-2">Active Features:</div>
                      <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Continuous GPS tracking with geofencing</li>
                        <li>• Voice pattern analysis for stress detection</li>
                        <li>• App usage monitoring and restrictions</li>
                        <li>• Heart rate monitoring via wearables</li>
                        <li>• Social interaction pattern analysis</li>
                        <li>• Emergency response with auto-lockdown</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div className="text-xs text-yellow-800 dark:text-yellow-200">
                          <strong>Battery Optimization:</strong> The mobile app uses advanced power management to minimize battery drain while maintaining continuous safety monitoring.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile App Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      <Download className="h-4 w-4 mr-2" />
                      Download for iOS (App Store)
                    </Button>
                    
                    <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download for Android (Google Play)
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                      Or scan QR code to download directly
                    </div>

                    <div className="flex justify-center">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">QR Code</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Installation Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-medium mb-1">Step 1: Download & Install</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Download the AGI Family Guardian app from your device's app store
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-1">Step 2: Grant Permissions</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Allow location, camera, microphone, and notification permissions for full functionality
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-1">Step 3: Family Setup</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Link the mobile app to your family account using the provided pairing code
                      </p>
                    </div>

                    <div>
                      <div className="font-medium mb-1">Step 4: Background Setup</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Configure background app refresh and disable battery optimization for continuous monitoring
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-xs text-green-800 dark:text-green-200">
                      <strong>Privacy Note:</strong> All data is encrypted end-to-end and processed locally when possible. Location data is only shared with designated family members.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}