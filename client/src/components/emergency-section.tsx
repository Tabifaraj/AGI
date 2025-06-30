import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Lock, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const emergencyLockMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/emergency/lock-all'),
    onSuccess: () => {
      toast({
        title: "Emergency Lock Activated",
        description: "All family devices have been locked immediately.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-events'] });
    },
    onError: () => {
      toast({
        title: "Emergency Lock Failed",
        description: "Unable to activate emergency lock. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-alert-red" />
          <h3 className="font-semibold text-red-800 dark:text-red-200">Emergency Control</h3>
        </div>
        <Badge variant="destructive" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          Armed
        </Badge>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            className="emergency-button"
            disabled={emergencyLockMutation.isPending}
          >
            <Lock className="h-4 w-4 mr-2" />
            {emergencyLockMutation.isPending ? 'Activating...' : 'Emergency Lock All Devices'}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Emergency Lock Confirmation</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately lock all family devices and send emergency notifications. 
              This action cannot be undone remotely. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => emergencyLockMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              Activate Emergency Lock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
