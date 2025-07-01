import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Shield, AlertTriangle, School, Home, ShoppingCart, Users, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface SafeZone {
  id: number;
  name: string;
  type: 'safe' | 'danger';
  latitude: number;
  longitude: number;
  radius: number;
  isActive: boolean;
}

interface FamilyLocation {
  memberId: number;
  memberName: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  insideZones: string[];
  batteryLevel?: number;
}

export default function MapTracking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [newZone, setNewZone] = useState({
    name: '',
    type: 'safe' as 'safe' | 'danger',
    latitude: '',
    longitude: '',
    radius: '100'
  });

  // Mock GPS locations for demo
  const mockLocations: FamilyLocation[] = [
    {
      memberId: 1,
      memberName: "Emma",
      latitude: 40.7589,
      longitude: -73.9851,
      accuracy: 5,
      timestamp: new Date(),
      insideZones: ["Home Safe Zone"],
      batteryLevel: 85
    },
    {
      memberId: 2,
      memberName: "Jake",
      latitude: 40.7614,
      longitude: -73.9776,
      accuracy: 8,
      timestamp: new Date(),
      insideZones: ["School Safe Zone"],
      batteryLevel: 42
    }
  ];

  // Mock safe zones for demo
  const mockSafeZones: SafeZone[] = [
    { id: 1, name: "Home Safe Zone", type: "safe", latitude: 40.7589, longitude: -73.9851, radius: 200, isActive: true },
    { id: 2, name: "School Safe Zone", type: "safe", latitude: 40.7614, longitude: -73.9776, radius: 150, isActive: true },
    { id: 3, name: "Grandma's House", type: "safe", latitude: 40.7505, longitude: -73.9934, radius: 100, isActive: true },
    { id: 4, name: "Construction Site", type: "danger", latitude: 40.7648, longitude: -73.9808, radius: 300, isActive: true },
    { id: 5, name: "Restricted Area", type: "danger", latitude: 40.7505, longitude: -73.9800, radius: 250, isActive: true }
  ];

  const createZoneMutation = useMutation({
    mutationFn: (zone: any) => apiRequest('POST', '/api/zones', zone),
    onSuccess: () => {
      toast({
        title: "Zone Created",
        description: "Safe zone has been added successfully",
      });
      setNewZone({ name: '', type: 'safe', latitude: '', longitude: '', radius: '100' });
      queryClient.invalidateQueries({ queryKey: ['/api/zones'] });
    }
  });

  const deleteZoneMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/zones/${id}`),
    onSuccess: () => {
      toast({
        title: "Zone Deleted",
        description: "Zone has been removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zones'] });
    }
  });

  // Simulate location alerts
  useEffect(() => {
    const checkZoneViolations = () => {
      const alerts = [
        "Emma entered Construction Site danger zone - Alert sent!",
        "Jake left School Safe Zone - Parent notification sent",
        "Emma approaching Restricted Area - Monitoring closely"
      ];
      
      if (Math.random() > 0.8) {
        toast({
          title: "Zone Alert",
          description: alerts[Math.floor(Math.random() * alerts.length)],
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkZoneViolations, 15000);
    return () => clearInterval(interval);
  }, [toast]);

  const getZoneTypeColor = (type: string) => {
    return type === 'safe' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
  };

  const getMemberStatusColor = (member: FamilyLocation) => {
    const inDangerZone = member.insideZones.some(zone => 
      mockSafeZones.find(z => z.name === zone && z.type === 'danger')
    );
    if (inDangerZone) return 'text-red-600';
    if (member.insideZones.length > 0) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GPS Tracking & Zone Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor family locations and manage safe/danger zones</p>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <MapPin className="h-3 w-3 mr-1" />
            Live Tracking Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Map Simulation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Live Family Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-8 min-h-[400px] relative border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-lg font-semibold">Interactive GPS Map</p>
                    <p className="text-sm">Real-time family member locations with zone overlays</p>
                  </div>
                  
                  {/* Mock location markers */}
                  <div className="absolute top-20 left-20">
                    <div className="bg-green-500 text-white rounded-full p-2 text-xs font-bold shadow-lg">
                      Emma
                      <div className="bg-green-600 text-xs px-2 py-1 rounded mt-1">Home Safe Zone</div>
                    </div>
                  </div>
                  <div className="absolute top-32 right-24">
                    <div className="bg-blue-500 text-white rounded-full p-2 text-xs font-bold shadow-lg">
                      Jake
                      <div className="bg-blue-600 text-xs px-2 py-1 rounded mt-1">School Safe Zone</div>
                    </div>
                  </div>
                  
                  {/* Zone indicators */}
                  <div className="absolute bottom-20 left-16">
                    <div className="bg-red-500/20 border-2 border-red-500 rounded-full w-16 h-16 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-xs text-red-600 text-center mt-1">Danger Zone</p>
                  </div>
                  <div className="absolute bottom-32 right-20">
                    <div className="bg-green-500/20 border-2 border-green-500 rounded-full w-12 h-12 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 text-center mt-1">Safe Zone</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Family Status Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Family Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockLocations.map((member) => (
                  <div key={member.memberId} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{member.memberName}</span>
                      <Badge className={getMemberStatusColor(member)}>
                        {member.insideZones.length > 0 ? 'Safe' : 'Monitoring'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <div>Battery: {member.batteryLevel}%</div>
                      <div>Accuracy: {member.accuracy}m</div>
                      <div>Updated: {member.timestamp.toLocaleTimeString()}</div>
                      {member.insideZones.length > 0 && (
                        <div className="text-green-600">
                          Inside: {member.insideZones.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Locate All Family
                </Button>
                <Button className="w-full" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Check-In Request
                </Button>
                <Button className="w-full" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Locate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Zone Management */}
        <Tabs defaultValue="zones" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="zones">Zone Management</TabsTrigger>
            <TabsTrigger value="alerts">Zone Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="zones" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Zones */}
              <Card>
                <CardHeader>
                  <CardTitle>Safe & Danger Zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSafeZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {zone.type === 'safe' ? (
                          <Shield className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-semibold">{zone.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Radius: {zone.radius}m • {zone.type === 'safe' ? 'Safe Zone' : 'Danger Zone'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getZoneTypeColor(zone.type)}>
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Zone</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{zone.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteZoneMutation.mutate(zone.id)}>
                                Delete Zone
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Create New Zone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create New Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">Zone Name</Label>
                    <Input
                      id="zoneName"
                      value={newZone.name}
                      onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                      placeholder="e.g., School, Park, Library"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Zone Type</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={newZone.type === 'safe' ? 'default' : 'outline'}
                        onClick={() => setNewZone({ ...newZone, type: 'safe' })}
                        className="flex-1"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Safe Zone
                      </Button>
                      <Button
                        variant={newZone.type === 'danger' ? 'default' : 'outline'}
                        onClick={() => setNewZone({ ...newZone, type: 'danger' })}
                        className="flex-1"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Danger Zone
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={newZone.latitude}
                        onChange={(e) => setNewZone({ ...newZone, latitude: e.target.value })}
                        placeholder="40.7589"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={newZone.longitude}
                        onChange={(e) => setNewZone({ ...newZone, longitude: e.target.value })}
                        placeholder="-73.9851"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      value={newZone.radius}
                      onChange={(e) => setNewZone({ ...newZone, radius: e.target.value })}
                      placeholder="100"
                    />
                  </div>

                  <Button 
                    onClick={() => createZoneMutation.mutate(newZone)}
                    disabled={!newZone.name || !newZone.latitude || !newZone.longitude}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Zone
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Zone Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-red-800 dark:text-red-200">Emma entered Construction Site</div>
                      <div className="text-xs text-red-600">2 minutes ago - Danger zone violation</div>
                    </div>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-yellow-800 dark:text-yellow-200">Jake left School Safe Zone</div>
                      <div className="text-xs text-yellow-600">15 minutes ago - Expected departure time</div>
                    </div>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="font-semibold text-green-800 dark:text-green-200">Emma arrived at Home Safe Zone</div>
                      <div className="text-xs text-green-600">1 hour ago - Arrived safely</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Safe</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}