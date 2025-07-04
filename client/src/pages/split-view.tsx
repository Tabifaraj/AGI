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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'family' | 'activity' | 'settings' | 'devices' | 'ai' | 'location' | 'communication' | 'screen'>('devices');

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

      {/* Emergency Control Center Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2 px-4 py-2 overflow-x-auto">
          {[
            { key: 'devices', label: 'Smart Devices', icon: Smartphone },
            { key: 'ai', label: 'AI Detection', icon: Heart },
            { key: 'location', label: 'Location Tracking', icon: MapPin },
            { key: 'communication', label: 'Communication Safety', icon: Contact },
            { key: 'screen', label: 'Screen Time Control', icon: Eye }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              size="sm"
              variant={activeTab === key ? 'default' : 'outline'}
              onClick={() => setActiveTab(key as any)}
              className="flex items-center space-x-2 text-sm px-3 py-2 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Emergency Control Center Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Emergency Control Center</h2>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive family safety monitoring system</p>
          </div>

          {/* Family Member Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Family Status</h3>
              <Badge className="bg-green-100 text-green-800 text-sm">
                All Safe
              </Badge>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Emma', avatar: '👧', status: 'Online', location: 'Home', color: 'pink' },
                { name: 'Alex', avatar: '👦', status: 'Online', location: 'School', color: 'blue' },
                { name: 'Mom', avatar: '👩', status: 'Online', location: 'Work', color: 'purple' }
              ].map((person, index) => (
                <div key={person.name} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-${person.color}-100 flex items-center justify-center`}>
                    <span className="text-2xl">{person.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{person.name}</h4>
                      <span className="text-green-600 font-medium text-sm">{person.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">📍 {person.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Smart Devices</h3>
            </div>
            
            <div className="space-y-6">
              {[
                { name: 'Emma', avatar: '👧', color: 'pink' },
                { name: 'Alex', avatar: '👦', color: 'blue' },
                { name: 'Mom', avatar: '👩', color: 'purple' }
              ].map((person, index) => (
                <div key={person.name} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full bg-${person.color}-100 flex items-center justify-center`}>
                    <span className="text-2xl">{person.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">📱 {person.name}'s iPhone</span>
                      <span className="text-green-600 font-medium">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">⌚ {person.name}'s Apple Watch - Heart rate:</span>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">78 BPM</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs">Good</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Button className="bg-red-600 hover:bg-red-700 text-white p-4 h-auto">
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Test Heart Rate Alert</div>
                <div className="text-sm opacity-90">Simulate emergency biometric detection</div>
              </div>
            </Button>
            
            <Button className="bg-orange-600 hover:bg-orange-700 text-white p-4 h-auto">
              <div className="text-center">
                <Mic className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Test Voice Detection</div>
                <div className="text-sm opacity-90">Simulate voice stress analysis</div>
              </div>
            </Button>
          </div>
        </div>
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