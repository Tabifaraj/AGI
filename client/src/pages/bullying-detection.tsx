import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Heart, Activity, MessageSquare, Frown, TrendingUp, Shield, Brain, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BiometricReading {
  id: number;
  memberId: number;
  memberName: string;
  timestamp: Date;
  heartRate: number;
  stressLevel: number; // 1-10 scale
  activityLevel: number; // 1-10 scale
  voiceStressIndicators: number; // 1-10 scale
  socialInteractionScore: number; // 1-10 scale (lower = concerning)
  anomalyScore: number; // AI calculated risk score
}

interface DiscomfortAlert {
  id: number;
  memberId: number;
  memberName: string;
  alertType: 'high_stress' | 'social_isolation' | 'unusual_behavior' | 'voice_distress';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export default function BullyingDetection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState("Emma");

  // Mock biometric data for demonstration
  const mockBiometricReadings: BiometricReading[] = [
    {
      id: 1,
      memberId: 1,
      memberName: "Emma",
      timestamp: new Date(Date.now() - 5 * 60000),
      heartRate: 105,
      stressLevel: 8,
      activityLevel: 3,
      voiceStressIndicators: 7,
      socialInteractionScore: 3,
      anomalyScore: 85 // High risk
    },
    {
      id: 2,
      memberId: 1,
      memberName: "Emma",
      timestamp: new Date(Date.now() - 35 * 60000),
      heartRate: 78,
      stressLevel: 4,
      activityLevel: 6,
      voiceStressIndicators: 3,
      socialInteractionScore: 7,
      anomalyScore: 25 // Normal
    },
    {
      id: 3,
      memberId: 2,
      memberName: "Jake",
      timestamp: new Date(Date.now() - 10 * 60000),
      heartRate: 88,
      stressLevel: 5,
      activityLevel: 8,
      voiceStressIndicators: 2,
      socialInteractionScore: 8,
      anomalyScore: 15 // Normal
    }
  ];

  const mockDiscomfortAlerts: DiscomfortAlert[] = [
    {
      id: 1,
      memberId: 1,
      memberName: "Emma",
      alertType: 'high_stress',
      severity: 'high',
      description: 'Elevated heart rate (105 BPM) and high stress indicators detected during school hours',
      timestamp: new Date(Date.now() - 5 * 60000),
      resolved: false
    },
    {
      id: 2,
      memberId: 1,
      memberName: "Emma",
      alertType: 'social_isolation',
      severity: 'medium',
      description: 'Decreased social interaction score (3/10) detected over past 2 hours',
      timestamp: new Date(Date.now() - 45 * 60000),
      resolved: false
    },
    {
      id: 3,
      memberId: 1,
      memberName: "Emma",
      alertType: 'voice_distress',
      severity: 'high',
      description: 'Voice pattern analysis detected stress indicators in recent phone conversations',
      timestamp: new Date(Date.now() - 25 * 60000),
      resolved: false
    }
  ];

  // Simulate real-time biometric monitoring
  useEffect(() => {
    const simulateRealtimeMonitoring = () => {
      // Randomly trigger concerning readings
      if (Math.random() > 0.7) {
        const alerts = [
          "Emma's heart rate elevated to 110 BPM - potential distress detected",
          "Unusual behavior pattern detected in Emma's device usage",
          "Social interaction score dropped significantly for Emma",
          "Voice stress indicators elevated during Emma's last phone call"
        ];
        
        toast({
          title: "Discomfort Alert Detected",
          description: alerts[Math.floor(Math.random() * alerts.length)],
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(simulateRealtimeMonitoring, 20000);
    return () => clearInterval(interval);
  }, [toast]);

  const resolveAlertMutation = useMutation({
    mutationFn: (alertId: number) => apiRequest('PUT', `/api/bullying-detection/alerts/${alertId}/resolve`),
    onSuccess: () => {
      toast({
        title: "Alert Resolved",
        description: "Discomfort alert has been marked as resolved",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bullying-detection/alerts'] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getAnomalyScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'high_stress': return <Heart className="h-4 w-4" />;
      case 'social_isolation': return <MessageSquare className="h-4 w-4" />;
      case 'unusual_behavior': return <Activity className="h-4 w-4" />;
      case 'voice_distress': return <Frown className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const currentReadings = mockBiometricReadings.filter(r => r.memberName === selectedMember);
  const latestReading = currentReadings[0];
  const memberAlerts = mockDiscomfortAlerts.filter(a => a.memberName === selectedMember && !a.resolved);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bullying & Discomfort Detection</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-powered biometric monitoring to detect when children feel uncomfortable or stressed</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              <Brain className="h-3 w-3 mr-1" />
              AI Monitoring Active
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

        {/* Real-time Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</div>
                  <div className="text-2xl font-bold">{latestReading?.heartRate || 72} BPM</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Stress Level</div>
                  <div className="text-2xl font-bold">{latestReading?.stressLevel || 3}/10</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Social Score</div>
                  <div className="text-2xl font-bold">{latestReading?.socialInteractionScore || 7}/10</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Risk Score</div>
                  <div className={`text-2xl font-bold ${getAnomalyScoreColor(latestReading?.anomalyScore || 25)}`}>
                    {latestReading?.anomalyScore || 25}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
            <TabsTrigger value="biometrics">Biometric Trends</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="settings">Detection Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {memberAlerts.length > 0 ? (
                memberAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                            {getAlertTypeIcon(alert.alertType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{alert.memberName}</h3>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity.toUpperCase()} PRIORITY
                              </Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">{alert.description}</p>
                            <div className="text-xs text-gray-500">
                              {alert.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => resolveAlertMutation.mutate(alert.id)}
                          >
                            Mark as Resolved
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedMember} is showing normal behavioral patterns. AI monitoring continues in the background.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="biometrics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stress Indicators Over Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Heart Rate Variability</span>
                        <span className="text-red-600">Elevated</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Voice Stress Patterns</span>
                        <span className="text-yellow-600">Moderate</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Social Interaction Level</span>
                        <span className="text-red-600">Decreased</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sleep Quality Score</span>
                        <span className="text-yellow-600">Below Average</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Pattern Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-800 dark:text-red-200">Concerning Trend Detected</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Stress levels have increased 40% over the past week during school hours (8AM-3PM).
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800 dark:text-yellow-200">Social Pattern Change</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Decreased communication with friends after 3PM. Normal evening family interaction.
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800 dark:text-blue-200">Movement Pattern</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Physical activity decreased by 25% during lunch break periods at school.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI-Powered Analysis Report</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">
                    ⚠️ High Risk Assessment for {selectedMember}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-red-700 dark:text-red-300">
                      <strong>Primary Concern:</strong> Multiple stress indicators suggest {selectedMember} may be experiencing social difficulties or bullying.
                    </p>
                    <p className="text-red-700 dark:text-red-300">
                      <strong>Key Evidence:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-red-600 dark:text-red-400">
                      <li>Heart rate consistently elevated during school hours (avg 102 BPM vs normal 78 BPM)</li>
                      <li>Voice stress analysis shows 70% increase in anxiety markers</li>
                      <li>Social interaction score dropped from 8/10 to 3/10 over past week</li>
                      <li>Sleep pattern disruption (frequent wake-ups, delayed onset)</li>
                      <li>Decreased physical activity during traditionally social times</li>
                    </ul>
                    <p className="text-red-700 dark:text-red-300">
                      <strong>Recommendation:</strong> Immediate parent intervention recommended. Consider gentle conversation about school experiences.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📊 Predictive Analysis
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Based on current patterns, there's an 85% probability that {selectedMember} will experience increased distress if current situation continues without intervention.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✅ Suggested Actions
                  </h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Schedule a private conversation with {selectedMember} about their day</li>
                    <li>• Contact school counselor to inquire about social dynamics</li>
                    <li>• Monitor for any physical signs of distress</li>
                    <li>• Consider arranging positive social activities outside school</li>
                    <li>• Maintain heightened monitoring for next 48 hours</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Sensitivity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Heart Rate Anomaly Threshold</span>
                      <span>+20% above baseline</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Stress Detection Sensitivity</span>
                      <span>High</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Social Pattern Analysis</span>
                      <span>Enabled</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Voice Stress Detection</span>
                      <span>Medium</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monitoring Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>School Hours (8AM-3PM)</span>
                    <Badge className="bg-red-100 text-red-800">High Sensitivity</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>After School (3PM-6PM)</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium Sensitivity</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Evening (6PM-10PM)</span>
                    <Badge className="bg-green-100 text-green-800">Low Sensitivity</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span>Sleep Hours (10PM-8AM)</span>
                    <Badge className="bg-blue-100 text-blue-800">Sleep Monitoring</Badge>
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