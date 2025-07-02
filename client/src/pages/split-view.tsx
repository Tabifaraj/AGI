import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  MapPin, 
  Activity, 
  Users, 
  Settings, 
  Calendar, 
  Eye, 
  Smartphone,
  Camera,
  Mic,
  Contact,
  Bell,
  AlertTriangle,
  Heart,
  Lock,
  Unlock,
  Wifi,
  WifiOff
} from "lucide-react";
import { Link } from "wouter";

// Import the mobile demo content
import MobileDemo from "./mobile-demo";

interface FamilyMember {
  id: number;
  name: string;
  age: number;
  status: 'safe' | 'at_risk' | 'emergency';
  location: string;
  lastSeen: Date;
  deviceStatus: 'online' | 'offline';
  schoolMode: boolean;
  emergencyAlerts: number;
}

interface SecurityAlert {
  id: number;
  type: 'high_stress' | 'location_alert' | 'suspicious_activity' | 'device_issue';
  member: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export default function SplitView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'family' | 'activity' | 'settings'>('dashboard');

  // Fetch data for the web interface
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: emergencyEvents = [] } = useQuery<SecurityAlert[]>({
    queryKey: ['/api/emergency/active'],
  });

  const { data: user } = useQuery<{ username: string }>({
    queryKey: ['/api/user'],
  });

  const { data: securitySettings } = useQuery<{ 
    faceIdEnabled: boolean; 
    emergencyAlertsEnabled: boolean; 
    locationTrackingEnabled: boolean; 
  }>({
    queryKey: ['/api/security-settings'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'at_risk': return 'bg-yellow-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const WebInterface = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AGI Family Guardian</h1>
            <p className="text-blue-100">Advanced Family Safety Control System</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{(user as any)?.username || 'Parent'}</p>
              <p className="text-xs text-blue-200">System Administrator</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8 px-4">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: Shield },
            { key: 'family', label: 'Family', icon: Users },
            { key: 'activity', label: 'Activity', icon: Activity },
            { key: 'settings', label: 'Settings', icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center space-x-2 py-3 px-2 border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Family Members</p>
                      <p className="text-2xl font-bold">{familyMembers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Safe</p>
                      <p className="text-2xl font-bold text-green-600">
                        {familyMembers.filter(m => m.status === 'safe').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">At Risk</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {familyMembers.filter(m => m.status === 'at_risk').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active Alerts</p>
                      <p className="text-2xl font-bold text-purple-600">{emergencyEvents.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Family Members */}
            <Card>
              <CardHeader>
                <CardTitle>Family Members Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`} />
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.location} • {member.lastSeen ? new Date(member.lastSeen).toLocaleTimeString() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={member.deviceStatus === 'online' ? 'default' : 'secondary'}>
                          {member.deviceStatus}
                        </Badge>
                        {member.schoolMode && (
                          <Badge variant="outline">School Mode</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            {emergencyEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emergencyEvents.slice(0, 5).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{alert.member}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'family' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Age: {member.age}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Location: {member.location}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4 mr-1" />
                              Track
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Location Update</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Emma arrived at school</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Safety Check</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">All family members are safe</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">School Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">School mode activated for Alex</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Face ID Authentication</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable biometric authentication</p>
                    </div>
                    <Switch checked={(securitySettings as any)?.faceIdEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Emergency Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Send emergency notifications</p>
                    </div>
                    <Switch checked={(securitySettings as any)?.emergencyAlertsEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Tracking</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track family member locations</p>
                    </div>
                    <Switch checked={(securitySettings as any)?.locationTrackingEnabled} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Web Interface - Left Side */}
      <div className="w-1/2 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <WebInterface />
      </div>

      {/* Mobile Demo - Right Side */}
      <div className="w-1/2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Mobile App Demo</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Child's Device Interface</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <MobileDemo />
          </div>
        </div>
      </div>
    </div>
  );
}