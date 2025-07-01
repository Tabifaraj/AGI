import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Laptop, Tablet, Watch, Lock, Unlock, Wifi, WifiOff, Battery, MapPin, Camera, Mic, Volume2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Device {
  id: number;
  deviceName: string;
  deviceType: string;
  ownerId: number;
  ownerName: string;
  isLocked: boolean;
  isOnline: boolean;
  batteryLevel: number;
  lastActivity: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  permissions: {
    camera: boolean;
    microphone: boolean;
    location: boolean;
    internet: boolean;
  };
}

export default function DeviceControl() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState("Emma");

  // Mock device data for demonstration
  const mockDevices: Device[] = [
    {
      id: 1,
      deviceName: "Emma's iPhone",
      deviceType: "smartphone",
      ownerId: 1,
      ownerName: "Emma",
      isLocked: false,
      isOnline: true,
      batteryLevel: 78,
      lastActivity: new Date(Date.now() - 5 * 60000),
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: "Central Park, NYC"
      },
      permissions: {
        camera: true,
        microphone: true,
        location: true,
        internet: true
      }
    },
    {
      id: 2,
      deviceName: "Emma's MacBook",
      deviceType: "laptop",
      ownerId: 1,
      ownerName: "Emma",
      isLocked: true,
      isOnline: false,
      batteryLevel: 45,
      lastActivity: new Date(Date.now() - 2 * 60 * 60000),
      permissions: {
        camera: false,
        microphone: false,
        location: false,
        internet: false
      }
    },
    {
      id: 3,
      deviceName: "Emma's Apple Watch",
      deviceType: "smartwatch",
      ownerId: 1,
      ownerName: "Emma",
      isLocked: false,
      isOnline: true,
      batteryLevel: 92,
      lastActivity: new Date(Date.now() - 1 * 60000),
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: "Central Park, NYC"
      },
      permissions: {
        camera: false,
        microphone: true,
        location: true,
        internet: true
      }
    },
    {
      id: 4,
      deviceName: "Jake's Android",
      deviceType: "smartphone",
      ownerId: 2,
      ownerName: "Jake",
      isLocked: false,
      isOnline: true,
      batteryLevel: 23,
      lastActivity: new Date(Date.now() - 3 * 60000),
      location: {
        lat: 40.7614,
        lng: -73.9776,
        address: "Times Square, NYC"
      },
      permissions: {
        camera: true,
        microphone: true,
        location: true,
        internet: true
      }
    }
  ];

  const deviceControlMutation = useMutation({
    mutationFn: ({ deviceId, action }: { deviceId: number; action: string }) => 
      apiRequest('POST', `/api/devices/${deviceId}/control`, { action }),
    onSuccess: (_, variables) => {
      toast({
        title: "Device Control",
        description: `${variables.action} command sent successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    }
  });

  const permissionMutation = useMutation({
    mutationFn: ({ deviceId, permission, enabled }: { deviceId: number; permission: string; enabled: boolean }) => 
      apiRequest('PUT', `/api/devices/${deviceId}/permissions`, { [permission]: enabled }),
    onSuccess: () => {
      toast({
        title: "Permission Updated",
        description: "Device permission has been changed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
    }
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartphone': return <Smartphone className="h-5 w-5" />;
      case 'laptop': return <Laptop className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      case 'smartwatch': return <Watch className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level <= 20) return 'text-red-600';
    if (level <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const memberDevices = mockDevices.filter(device => device.ownerName === selectedMember);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Device Control Center</h1>
            <p className="text-gray-600 dark:text-gray-400">Remote control and monitoring of all family devices</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800 border-green-300">
              <Smartphone className="h-3 w-3 mr-1" />
              {mockDevices.filter(d => d.isOnline).length} devices online
            </Badge>
            <select 
              value={selectedMember} 
              onChange={(e) => setSelectedMember(e.target.value)}
              className="px-3 py-1 border rounded-lg"
            >
              <option value="Emma">Emma</option>
              <option value="Jake">Jake</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="devices">Device Overview</TabsTrigger>
            <TabsTrigger value="remote">Remote Control</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberDevices.map((device) => (
                <Card key={device.id} className={`${device.isLocked ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'} dark:border-gray-700`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.deviceType)}
                        <span className="text-sm">{device.deviceName}</span>
                      </div>
                      <Badge variant={device.isOnline ? "default" : "secondary"}>
                        {device.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Battery Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Battery className="h-4 w-4" />
                          <span>Battery</span>
                        </div>
                        <span className={getBatteryColor(device.batteryLevel)}>
                          {device.batteryLevel}%
                        </span>
                      </div>
                      <Progress value={device.batteryLevel} className="h-2" />
                    </div>

                    {/* Location */}
                    {device.location && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{device.location.address}</span>
                        </div>
                      </div>
                    )}

                    {/* Last Activity */}
                    <div className="text-xs text-gray-500">
                      Last active: {device.lastActivity.toLocaleTimeString()}
                    </div>

                    {/* Device Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Device Lock</span>
                      <div className="flex items-center space-x-2">
                        {device.isLocked ? (
                          <Lock className="h-4 w-4 text-red-500" />
                        ) : (
                          <Unlock className="h-4 w-4 text-green-500" />
                        )}
                        <Badge variant={device.isLocked ? "destructive" : "default"}>
                          {device.isLocked ? "Locked" : "Unlocked"}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick Controls */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant={device.isLocked ? "default" : "destructive"}
                        onClick={() => deviceControlMutation.mutate({
                          deviceId: device.id, 
                          action: device.isLocked ? 'unlock' : 'lock'
                        })}
                        disabled={!device.isOnline}
                      >
                        {device.isLocked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                        {device.isLocked ? 'Unlock' : 'Lock'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deviceControlMutation.mutate({
                          deviceId: device.id, 
                          action: 'locate'
                        })}
                        disabled={!device.isOnline}
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

          <TabsContent value="remote" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {memberDevices.map((device) => (
                    <div key={device.id} className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        {getDeviceIcon(device.deviceType)}
                        <span className="font-medium">{device.deviceName}</span>
                        <Badge variant={device.isOnline ? "default" : "secondary"} className="text-xs">
                          {device.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Camera className="h-4 w-4" />
                            <span className="text-sm">Camera</span>
                          </div>
                          <Switch 
                            checked={device.permissions.camera}
                            onCheckedChange={(enabled) => permissionMutation.mutate({
                              deviceId: device.id,
                              permission: 'camera',
                              enabled
                            })}
                            disabled={!device.isOnline}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mic className="h-4 w-4" />
                            <span className="text-sm">Microphone</span>
                          </div>
                          <Switch 
                            checked={device.permissions.microphone}
                            onCheckedChange={(enabled) => permissionMutation.mutate({
                              deviceId: device.id,
                              permission: 'microphone',
                              enabled
                            })}
                            disabled={!device.isOnline}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">Location</span>
                          </div>
                          <Switch 
                            checked={device.permissions.location}
                            onCheckedChange={(enabled) => permissionMutation.mutate({
                              deviceId: device.id,
                              permission: 'location',
                              enabled
                            })}
                            disabled={!device.isOnline}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {device.permissions.internet ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                            <span className="text-sm">Internet</span>
                          </div>
                          <Switch 
                            checked={device.permissions.internet}
                            onCheckedChange={(enabled) => permissionMutation.mutate({
                              deviceId: device.id,
                              permission: 'internet',
                              enabled
                            })}
                            disabled={!device.isOnline}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Remote Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => {
                        memberDevices.forEach(device => {
                          if (device.isOnline) {
                            deviceControlMutation.mutate({
                              deviceId: device.id,
                              action: 'lock'
                            });
                          }
                        });
                      }}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Lock All Devices
                    </Button>
                    
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => {
                        memberDevices.forEach(device => {
                          if (device.isOnline) {
                            deviceControlMutation.mutate({
                              deviceId: device.id,
                              action: 'unlock'
                            });
                          }
                        });
                      }}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock All Devices
                    </Button>

                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        memberDevices.forEach(device => {
                          if (device.isOnline) {
                            deviceControlMutation.mutate({
                              deviceId: device.id,
                              action: 'locate'
                            });
                          }
                        });
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Locate All Devices
                    </Button>

                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        memberDevices.forEach(device => {
                          if (device.isOnline) {
                            deviceControlMutation.mutate({
                              deviceId: device.id,
                              action: 'sound_alarm'
                            });
                          }
                        });
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Sound Alarm
                    </Button>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> All device controls require active internet connection. 
                      Emergency override capabilities are always available to parents.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Device Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {memberDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(device.deviceType)}
                        <div>
                          <div className="font-medium text-sm">{device.deviceName}</div>
                          <div className="text-xs text-gray-500">
                            {device.isOnline ? 'Active now' : `Last seen ${device.lastActivity.toLocaleTimeString()}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={device.isOnline ? "default" : "secondary"} className="text-xs">
                          {device.isOnline ? "Live" : "Offline"}
                        </Badge>
                        <div className={`text-xs mt-1 ${getBatteryColor(device.batteryLevel)}`}>
                          {device.batteryLevel}% battery
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Activity Monitor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                      📱 Emma's iPhone: Currently using Khan Academy (Educational app)
                    </div>
                    <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                      ⌚ Emma's Apple Watch: Heart rate monitoring active (78 BPM)
                    </div>
                    <div className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                      💻 Emma's MacBook: Locked - Last used 2 hours ago
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