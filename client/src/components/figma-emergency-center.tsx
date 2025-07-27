import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  Instagram,
  Footprints,
  Watch,
  Brain,
  Activity,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Smartphone,
  Laptop,
  Shield,
  Lock,
  Eye,
  Mic,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChildData {
  id: number;
  name: string;
  avatar: string;
  devices: Device[];
  biometrics: BiometricData;
  monitoring: MonitoringData;
}

interface Device {
  type: 'iPhone' | 'MacBook' | 'Apple Watch' | 'Parent Phone';
  name: string;
  status: 'Online' | 'Offline';
  heartRate?: number;
  batteryLevel?: number;
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  emotionalState: 'Good' | 'Fair' | 'Poor';
  lastUpdate: Date;
}

interface MonitoringData {
  voiceMonitoring: 'Active' | 'Inactive';
  biometricAlerts: 'Enabled' | 'Disabled';
  locationTracking: 'Active' | 'Inactive';
  threatDetection: 'Online' | 'Offline';
}

export default function FigmaEmergencyCenter() {
  const [activeTab, setActiveTab] = useState("smart-devices");
  
  const [childrenData, setChildrenData] = useState<ChildData[]>([
    {
      id: 1,
      name: "Emma",
      avatar: "👧",
      devices: [
        { type: 'iPhone', name: "Emma's iPhone", status: 'Online' },
        { type: 'Apple Watch', name: "Emma's Apple Watch", status: 'Online', heartRate: 78 },
        { type: 'MacBook', name: "Alex's MacBook", status: 'Online' },
        { type: 'Parent Phone', name: "Parent Phone", status: 'Online' }
      ],
      biometrics: {
        heartRate: 78,
        stressLevel: 2,
        emotionalState: 'Good',
        lastUpdate: new Date()
      },
      monitoring: {
        voiceMonitoring: 'Active',
        biometricAlerts: 'Enabled',
        locationTracking: 'Active',
        threatDetection: 'Online'
      }
    },
    {
      id: 2,
      name: "Alex",
      avatar: "👦",
      devices: [
        { type: 'MacBook', name: "Alex's MacBook", status: 'Online' },
        { type: 'Parent Phone', name: "Parent Phone", status: 'Online' }
      ],
      biometrics: {
        heartRate: 82,
        stressLevel: 4,
        emotionalState: 'Fair',
        lastUpdate: new Date()
      },
      monitoring: {
        voiceMonitoring: 'Active',
        biometricAlerts: 'Enabled',
        locationTracking: 'Active',
        threatDetection: 'Online'
      }
    }
  ]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setChildrenData(prev => prev.map(child => ({
        ...child,
        biometrics: {
          ...child.biometrics,
          heartRate: 65 + Math.floor(Math.random() * 25),
          stressLevel: Math.floor(Math.random() * 10),
          lastUpdate: new Date()
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHeartRateColor = (rate: number) => {
    if (rate < 70) return 'text-blue-600';
    if (rate < 85) return 'text-green-600';
    if (rate < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHeartRateBadgeColor = (rate: number) => {
    if (rate < 70) return 'bg-blue-100 text-blue-800';
    if (rate < 85) return 'bg-green-100 text-green-800';
    if (rate < 100) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'Online' || status === 'Active' || status === 'Enabled' 
      ? 'text-green-600' 
      : 'text-gray-500';
  };

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 sm:p-6 lg:p-8 border border-red-200 dark:border-red-800 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h2 className="text-xl lg:text-2xl font-semibold text-red-800 dark:text-red-200">Emergency Control Center</h2>
        </div>
        <Badge variant="secondary" className="text-sm self-start sm:self-auto">
          <Shield className="h-4 w-4 mr-2" />
          Monitoring
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6 h-auto">
          <TabsTrigger value="smart-devices" className="flex items-center justify-center space-x-2 p-3 text-sm">
            <Smartphone className="h-5 w-5" />
            <span>Smart Devices</span>
          </TabsTrigger>
          <TabsTrigger value="ai-detection" className="flex items-center justify-center space-x-2 p-3 text-sm">
            <Heart className="h-5 w-5" />
            <span>AI Detection</span>
          </TabsTrigger>
          <TabsTrigger value="what-can-i-put-here-1" className="text-xs p-2 hidden lg:flex">
            What can i put here
          </TabsTrigger>
          <TabsTrigger value="what-can-i-put-here-2" className="text-xs p-2 hidden lg:flex">
            What can i put here
          </TabsTrigger>
          <TabsTrigger value="what-can-i-put-here-3" className="text-xs p-2 hidden lg:flex">
            What can i put here
          </TabsTrigger>
        </TabsList>

        {/* Smart Devices Tab */}
        <TabsContent value="smart-devices" className="space-y-6">
          {childrenData.map(child => (
            <div key={child.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{child.name}'s Devices</h3>
                  <p className="text-base text-gray-500">All devices online</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {child.devices.map((device, index) => (
                  <div key={index} className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        {device.type === 'iPhone' && <Smartphone className="h-5 w-5 text-gray-600" />}
                        {device.type === 'MacBook' && <Laptop className="h-5 w-5 text-gray-600" />}
                        {device.type === 'Apple Watch' && <Watch className="h-5 w-5 text-gray-600" />}
                        {device.type === 'Parent Phone' && <Smartphone className="h-5 w-5 text-gray-600" />}
                        <span className="text-base font-medium text-gray-900 dark:text-white">{device.name}</span>
                      </div>
                      <span className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
                        {device.status}
                      </span>
                    </div>
                    
                    {device.heartRate && (
                      <div className="flex items-center space-x-3 flex-wrap">
                        <Watch className="h-5 w-5 text-gray-500" />
                        <span className="text-base text-gray-600">Heart rate:</span>
                        <span className={`text-base font-bold px-3 py-1 rounded ${getHeartRateBadgeColor(device.heartRate)}`}>
                          {device.heartRate} BPM
                        </span>
                        <span className={`text-base font-medium ${getHeartRateColor(device.heartRate)}`}>
                          Good
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* AI Detection Tab */}
        <TabsContent value="ai-detection" className="space-y-6">
          {childrenData.map(child => (
            <motion.div 
              key={child.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-3xl mx-auto lg:mx-0"
                  animate={{ 
                    boxShadow: child.biometrics.stressLevel > 5 
                      ? ['0 0 0 rgba(239, 68, 68, 0)', '0 0 20px rgba(239, 68, 68, 0.5)', '0 0 0 rgba(239, 68, 68, 0)']
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {child.avatar}
                </motion.div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{child.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Mic className="h-5 w-5 text-gray-500" />
                      <span className="text-base text-gray-600">Voice monitoring:</span>
                      <span className={`text-base font-medium ${getStatusColor(child.monitoring.voiceMonitoring)}`}>
                        {child.monitoring.voiceMonitoring}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Shield className="h-5 w-5 text-gray-500" />
                      <span className="text-base text-gray-600">AI threat detection:</span>
                      <span className={`text-base font-medium ${getStatusColor(child.monitoring.threatDetection)}`}>
                        {child.monitoring.threatDetection}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Heart className="h-5 w-5 text-gray-500" />
                      <span className="text-base text-gray-600">Biometric alerts:</span>
                      <span className={`text-base font-medium ${getStatusColor(child.monitoring.biometricAlerts)}`}>
                        {child.monitoring.biometricAlerts}
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <Navigation className="h-5 w-5 text-gray-500" />
                      <span className="text-base text-gray-600">Location tracking:</span>
                      <span className={`text-base font-medium ${getStatusColor(child.monitoring.locationTracking)}`}>
                        {child.monitoring.locationTracking}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Red progress bar for stress level */}
              {child.biometrics.stressLevel > 5 && (
                <motion.div 
                  className="w-full bg-red-200 rounded-full h-1 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="bg-red-600 h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${child.biometrics.stressLevel * 10}%` }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </TabsContent>

        {/* Placeholder tabs */}
        <TabsContent value="what-can-i-put-here-1" className="text-center py-12">
          <p className="text-gray-500 text-base">Location Tracking & Geofencing features coming soon...</p>
        </TabsContent>
        <TabsContent value="what-can-i-put-here-2" className="text-center py-12">
          <p className="text-gray-500 text-base">Communication Safety features coming soon...</p>
        </TabsContent>
        <TabsContent value="what-can-i-put-here-3" className="text-center py-12">
          <p className="text-gray-500 text-base">Screen Time Control features coming soon...</p>
        </TabsContent>
      </Tabs>

      {/* Emergency Lock Button */}
      <div className="mt-8">
        <Button 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-xl font-semibold"
          size="lg"
        >
          <Lock className="h-6 w-6 mr-3" />
          Emergency Lock All Devices
        </Button>
      </div>

      {/* Test Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
        <Button variant="outline" className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50 py-4 text-base">
          <Heart className="h-5 w-5 mr-2" />
          Test Heart Rate Alert
        </Button>
        <Button variant="outline" className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 py-4 text-base">
          <Mic className="h-5 w-5 mr-2" />
          Test Voice Detection
        </Button>
      </div>
    </div>
  );
}