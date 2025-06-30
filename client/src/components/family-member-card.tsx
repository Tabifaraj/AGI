import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import type { FamilyMember } from "@shared/schema";

interface FamilyMemberCardProps {
  member: FamilyMember;
  onManage: (member: FamilyMember) => void;
}

export default function FamilyMemberCard({ member, onManage }: FamilyMemberCardProps) {
  const getRoleDescription = (role: string, permissions?: any) => {
    switch (role) {
      case 'child':
        const hasRestrictions = permissions?.timeRestrictions && Object.keys(permissions.timeRestrictions).length > 0;
        return hasRestrictions ? 'Gaming Mode' : 'Standard Mode';
      case 'spouse':
        return 'Full Access';
      case 'caregiver':
        return 'Limited Access';
      default:
        return 'Standard Access';
    }
  };

  return (
    <div className="family-member-card">
      <Avatar className="w-10 h-10">
        <AvatarImage src={member.profileImage || undefined} alt={member.name} />
        <AvatarFallback className="bg-trust-blue text-white">
          {member.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <p className="font-medium text-sm">{member.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {member.role === 'child' ? 'Child' : member.role === 'spouse' ? 'Spouse' : 'Caregiver'} • {getRoleDescription(member.role, member.permissions)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={member.isActive ? 'status-online' : 'status-offline'} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onManage(member)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
