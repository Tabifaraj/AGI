import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity as ActivityIcon, Shield, Smartphone, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import type { Activity, FamilyMember } from "@shared/schema";

export default function Activity() {
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities']
  });

  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members']
  });

  const getFamilyMemberName = (familyMemberId?: number) => {
    if (!familyMemberId) return null;
    const member = familyMembers.find(m => m.id === familyMemberId);
    return member?.name;
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'security_event':
        return <Shield className="h-4 w-4" />;
      case 'app_usage':
        return <Smartphone className="h-4 w-4" />;
      case 'location_change':
        return <ActivityIcon className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };

  const getActivityBadgeVariant = (activityType: string) => {
    switch (activityType) {
      case 'security_event':
        return 'destructive';
      case 'app_usage':
        return 'secondary';
      case 'location_change':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const isEmergencyActivity = (description: string) => {
    return description.includes('EMERGENCY') || description.includes('Emergency');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="p-6">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Activity Timeline</h1>

        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ActivityIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Activity Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Activity will appear here as you and your family use the security system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className={`hover:shadow-md transition-shadow ${
                isEmergencyActivity(activity.description) ? 'border-red-200 dark:border-red-800' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isEmergencyActivity(activity.description) 
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : activity.activityType === 'security_event'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {isEmergencyActivity(activity.description) ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        getActivityIcon(activity.activityType)
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getActivityBadgeVariant(activity.activityType)} className="text-xs">
                          {activity.activityType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        
                        {activity.timestamp && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(activity.timestamp), 'MMM d, h:mm a')}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm ${
                        isEmergencyActivity(activity.description)
                          ? 'text-red-700 dark:text-red-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {activity.description}
                      </p>
                      
                      {getFamilyMemberName(activity.familyMemberId) && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs bg-trust-blue text-white">
                              {getFamilyMemberName(activity.familyMemberId)?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getFamilyMemberName(activity.familyMemberId)}
                          </span>
                        </div>
                      )}
                      
                      {activity.metadata && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                          <pre className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
