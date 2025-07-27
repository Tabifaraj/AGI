import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Shield, BarChart3, Settings as SettingsIcon, Plus } from "lucide-react";
import MobileHeader from "@/components/mobile-header";
import EmergencySection from "@/components/emergency-section-clean";
import FamilyMemberCard from "@/components/family-member-card";
import SecurityControls from "@/components/security-controls";
import AIChatModal from "@/components/ai-chat-modal";
import VoiceIndicator from "@/components/voice-indicator";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMember } from "@shared/schema";

export default function Dashboard() {
  const [showAIChat, setShowAIChat] = useState(false);
  const { toast } = useToast();

  const { data: familyMembers = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members']
  });

  const handleManageMember = (member: FamilyMember) => {
    toast({
      title: "Manage Family Member",
      description: `Opening settings for ${member.name}`,
    });
    // Navigate to member management page
  };

  const handleAddFamilyMember = () => {
    toast({
      title: "Add Family Member",
      description: "Opening family member registration",
    });
  };

  const handleOpenControl = (controlType: string) => {
    toast({
      title: "Security Control",
      description: `Opening ${controlType} settings`,
    });
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} activated`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <MobileHeader />
      
      <div className="px-6 py-6 space-y-6">
        <EmergencySection />

        {/* Family Members Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Family Members</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddFamilyMember}
                className="text-trust-blue hover:text-deep-blue"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="skeleton h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {familyMembers.map((member) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    onManage={handleManageMember}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Assistant Section */}
        <Card className="ai-assistant-section">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-ai-purple rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">AI Security Assistant</h3>
                <p className="text-xs text-purple-600 dark:text-purple-300">Listening for voice commands...</p>
              </div>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">"Lock all social media apps for Emma after 8 PM"</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Applied
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</span>
              </div>
            </div>

            <Button 
              className="w-full bg-ai-purple hover:bg-purple-700 text-white"
              onClick={() => setShowAIChat(true)}
            >
              <Shield className="mr-2 h-4 w-4" />
              Speak to AI Assistant
            </Button>
          </CardContent>
        </Card>

        <SecurityControls onOpenControl={handleOpenControl} />

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="quick-action-btn blue"
                onClick={() => handleQuickAction('Lock All')}
              >
                <Lock className="h-5 w-5 text-trust-blue" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Lock All</span>
              </Button>
              
              <Button 
                className="quick-action-btn green"
                onClick={() => handleQuickAction('Safe Mode')}
              >
                <Shield className="h-5 w-5 text-success-green" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Safe Mode</span>
              </Button>
              
              <Button 
                className="quick-action-btn yellow"
                onClick={() => handleQuickAction('Activity Report')}
              >
                <BarChart3 className="h-5 w-5 text-warning-amber" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Activity</span>
              </Button>
              
              <Button 
                className="quick-action-btn purple"
                onClick={() => handleQuickAction('Settings')}
              >
                <SettingsIcon className="h-5 w-5 text-ai-purple" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <VoiceIndicator onClick={() => setShowAIChat(true)} />
      <BottomNavigation />
      
      <AIChatModal 
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
      />
    </div>
  );
}
