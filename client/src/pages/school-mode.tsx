import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { School, Clock, Smartphone, Calendar, Plus, Trash2, BookOpen, GamepadIcon, MessageSquare } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AppRule {
  id: number;
  appName: string;
  category: string;
  schoolHours: 'blocked' | 'allowed' | 'time-limited';
  afterSchool: 'blocked' | 'allowed' | 'time-limited';
  timeLimit?: number; // minutes per day
  icon: string;
}

interface ScheduleRule {
  id: number;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function SchoolMode() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMember, setSelectedMember] = useState("Emma");
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    days: [] as string[],
    startTime: '08:00',
    endTime: '15:00'
  });

  // Mock app rules for demo
  const [appRules, setAppRules] = useState<AppRule[]>([
    { id: 1, appName: "Calculator", category: "Education", schoolHours: 'allowed', afterSchool: 'allowed', icon: "📱" },
    { id: 2, appName: "Khan Academy", category: "Education", schoolHours: 'allowed', afterSchool: 'allowed', icon: "📚" },
    { id: 3, appName: "TikTok", category: "Social", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 60, icon: "🎵" },
    { id: 4, appName: "Instagram", category: "Social", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 45, icon: "📸" },
    { id: 5, appName: "YouTube", category: "Entertainment", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 120, icon: "🎥" },
    { id: 6, appName: "WhatsApp", category: "Communication", schoolHours: 'allowed', afterSchool: 'allowed', icon: "💬" },
    { id: 7, appName: "Spotify", category: "Entertainment", schoolHours: 'blocked', afterSchool: 'allowed', icon: "🎧" },
    { id: 8, appName: "Duolingo", category: "Education", schoolHours: 'allowed', afterSchool: 'allowed', icon: "🦆" },
    { id: 9, appName: "Roblox", category: "Gaming", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 90, icon: "🎮" },
    { id: 10, appName: "Minecraft", category: "Gaming", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 60, icon: "⛏️" }
  ]);

  // Mock schedule rules
  const [scheduleRules, setScheduleRules] = useState<ScheduleRule[]>([
    { id: 1, name: "School Hours", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], startTime: "08:00", endTime: "15:00", isActive: true },
    { id: 2, name: "Study Time", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], startTime: "19:00", endTime: "21:00", isActive: true },
    { id: 3, name: "Weekend Restrictions", days: ["Saturday", "Sunday"], startTime: "22:00", endTime: "08:00", isActive: true }
  ]);

  const updateAppRule = (appId: number, field: keyof AppRule, value: any) => {
    setAppRules(rules => rules.map(rule => 
      rule.id === appId ? { ...rule, [field]: value } : rule
    ));
    toast({
      title: "App Rule Updated",
      description: "School mode settings have been updated",
    });
  };

  const saveScheduleMutation = useMutation({
    mutationFn: (schedule: any) => apiRequest('POST', '/api/school-mode/schedule', schedule),
    onSuccess: () => {
      toast({
        title: "Schedule Saved",
        description: "School mode schedule has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/school-mode'] });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allowed': return 'bg-green-100 text-green-800 border-green-300';
      case 'blocked': return 'bg-red-100 text-red-800 border-red-300';
      case 'time-limited': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education': return <BookOpen className="h-4 w-4" />;
      case 'Gaming': return <GamepadIcon className="h-4 w-4" />;
      case 'Communication': return <MessageSquare className="h-4 w-4" />;
      default: return <Smartphone className="h-4 w-4" />;
    }
  };

  const getCurrentMode = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    const activeSchedule = scheduleRules.find(rule => {
      if (!rule.isActive) return false;
      if (!rule.days.includes(currentDay)) return false;
      
      const [startHour] = rule.startTime.split(':').map(Number);
      const [endHour] = rule.endTime.split(':').map(Number);
      
      return currentHour >= startHour && currentHour < endHour;
    });

    return activeSchedule ? activeSchedule.name : 'Free Time';
  };

  const toggleScheduleDay = (day: string) => {
    setNewSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">School Mode & App Control</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage app access during school hours and after-school time</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Clock className="h-3 w-3 mr-1" />
              Current Mode: {getCurrentMode()}
            </Badge>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emma">Emma</SelectItem>
                <SelectItem value="Jake">Jake</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="apps" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apps">App Control</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Rules</TabsTrigger>
            <TabsTrigger value="reports">Usage Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="apps" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>App Access Control for {selectedMember}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      appRules.reduce((acc, app) => {
                        if (!acc[app.category]) acc[app.category] = [];
                        acc[app.category].push(app);
                        return acc;
                      }, {} as Record<string, AppRule[]>)
                    ).map(([category, apps]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center space-x-2 pb-2 border-b">
                          {getCategoryIcon(category)}
                          <h3 className="font-semibold text-lg">{category}</h3>
                          <Badge variant="outline">{apps.length} apps</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {apps.map((app) => (
                            <div key={app.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{app.icon}</span>
                                <div>
                                  <div className="font-semibold">{app.appName}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">{app.category}</div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <Label className="text-xs">School Hours (8AM-3PM)</Label>
                                  <Select 
                                    value={app.schoolHours} 
                                    onValueChange={(value) => updateAppRule(app.id, 'schoolHours', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="allowed">✅ Allowed</SelectItem>
                                      <SelectItem value="blocked">❌ Blocked</SelectItem>
                                      <SelectItem value="time-limited">⏰ Time Limited</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-xs">After School Hours</Label>
                                  <Select 
                                    value={app.afterSchool} 
                                    onValueChange={(value) => updateAppRule(app.id, 'afterSchool', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="allowed">✅ Allowed</SelectItem>
                                      <SelectItem value="blocked">❌ Blocked</SelectItem>
                                      <SelectItem value="time-limited">⏰ Time Limited</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {(app.schoolHours === 'time-limited' || app.afterSchool === 'time-limited') && (
                                  <div>
                                    <Label className="text-xs">Daily Time Limit (minutes)</Label>
                                    <Input
                                      type="number"
                                      value={app.timeLimit || 60}
                                      onChange={(e) => updateAppRule(app.id, 'timeLimit', parseInt(e.target.value))}
                                      className="h-8"
                                      min="5"
                                      max="480"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Schedules */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Schedules</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduleRules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <School className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold">{schedule.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {schedule.startTime} - {schedule.endTime} • {schedule.days.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch checked={schedule.isActive} />
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Create New Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create New Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduleName">Schedule Name</Label>
                    <Input
                      id="scheduleName"
                      value={newSchedule.name}
                      onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                      placeholder="e.g., Homework Time, Sleep Mode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Days of Week</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <Button
                          key={day}
                          variant={newSchedule.days.includes(day) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleScheduleDay(day)}
                        >
                          {day.substring(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newSchedule.startTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newSchedule.endTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => saveScheduleMutation.mutate(newSchedule)}
                    disabled={!newSchedule.name || newSchedule.days.length === 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's App Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🎵</span>
                        <span className="font-semibold">TikTok</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">65/60 min</div>
                        <div className="text-xs text-red-500">Over limit</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🎥</span>
                        <span className="font-semibold">YouTube</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-yellow-600">95/120 min</div>
                        <div className="text-xs text-yellow-500">25 min left</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">📚</span>
                        <span className="font-semibold">Khan Academy</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">45 min</div>
                        <div className="text-xs text-green-500">Educational</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>School Mode Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {getCurrentMode()}
                    </div>
                    <div className="text-sm text-blue-500">
                      Currently Active Mode
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Apps Blocked:</span>
                      <span className="font-semibold">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Apps Allowed:</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Limited:</span>
                      <span className="font-semibold">5</span>
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