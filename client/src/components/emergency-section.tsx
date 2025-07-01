import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lock, Shield, Unlock, Heart, Watch, Smartphone, Camera, Mic } from "lucide-react";
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

export default function EmergencySection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [emergencyStatus, setEmergencyStatus] = useState({
    isActive: false,
    activatedBy: null as string | null,
    activatedAt: null as Date | null,
    reason: null as string | null
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

  const emergencyLockMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency/lock-all'),
    onSuccess: () => {
      setEmergencyStatus({
        isActive: true,
        activatedBy: 'Parent' as string,
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
        title: "Parent Override Activated",
        description: "Emergency protocols disabled. Full control restored.",
      });
    }
  });

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-alert-red" />
          <h3 className="font-semibold text-red-800 dark:text-red-200">Emergency Control Center</h3>
        </div>
        <Badge variant={emergencyStatus.isActive ? "destructive" : "secondary"} className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          {emergencyStatus.isActive ? 'EMERGENCY ACTIVE' : 'Monitoring'}
        </Badge>
      </div>

      {/* Smart Device Status */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <Watch className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Smart Devices</span>
          </div>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div>📱 Emma's iPhone - Online</div>
            <div>⌚ Emma's Apple Watch - Heart rate: 78 BPM</div>
            <div>💻 Alex's MacBook - Online</div>
            <div>📱 Parent Phone - Online</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">AI Detection</span>
          </div>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div>🎤 Voice monitoring: Active</div>
            <div>💓 Biometric alerts: Enabled</div>
            <div>📍 Location tracking: Active</div>
            <div>🤖 AI threat detection: Online</div>
          </div>
        </div>
      </div>

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
                  Parent Override
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Parent Override Confirmation</AlertDialogTitle>
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
