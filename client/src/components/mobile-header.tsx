import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Mic, ScanFace, Shield, Wifi, Signal, Battery } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User, SecuritySettings } from "@shared/schema";

export default function MobileHeader() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user']
  });

  const { data: securitySettings } = useQuery<SecuritySettings>({
    queryKey: ['/api/security-settings']
  });

  return (
    <div className="relative">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs bg-gray-900 text-white">
        <span>9:41</span>
        <div className="flex space-x-1 items-center">
          <Signal className="h-3 w-3 text-green-400" />
          <Wifi className="h-3 w-3 text-green-400" />
          <span className="text-green-400">100%</span>
          <Battery className="h-3 w-3 text-green-400" />
        </div>
      </div>

      {/* Main Header */}
      <div className="relative bg-gradient-to-br from-trust-blue to-deep-blue px-6 py-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AGI Control</h1>
            <p className="text-blue-200 text-sm">Advanced Security System</p>
          </div>
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-safe-green">
              <AvatarImage src={user?.profileImage} alt={user?.fullName} />
              <AvatarFallback className="bg-trust-blue text-white">
                {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-safe-green rounded-full border-2 border-white flex items-center justify-center">
              <Shield className="h-2 w-2 text-white" />
            </div>
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
            <ScanFace className={`h-5 w-5 mx-auto mb-1 ${securitySettings?.faceIdEnabled ? 'text-safe-green' : 'text-gray-400'}`} />
            <p className="text-xs text-blue-200">Face ID</p>
            <p className="text-sm font-semibold">
              {securitySettings?.faceIdEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
            <Fingerprint className={`h-5 w-5 mx-auto mb-1 ${securitySettings?.touchIdEnabled ? 'text-safe-green' : 'text-gray-400'}`} />
            <p className="text-xs text-blue-200">Touch ID</p>
            <p className="text-sm font-semibold">
              {securitySettings?.touchIdEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
            <Mic className={`h-5 w-5 mx-auto mb-1 ${securitySettings?.voiceIdEnabled ? 'text-safe-green' : 'text-gray-400'}`} />
            <p className="text-xs text-blue-200">Voice</p>
            <p className="text-sm font-semibold">
              {securitySettings?.voiceIdEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
