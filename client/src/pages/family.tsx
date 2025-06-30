import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, MapPin, Clock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFamilyMemberSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import type { FamilyMember } from "@shared/schema";
import { z } from "zod";

const formSchema = insertFamilyMemberSchema.extend({
  profileImage: z.string().optional(),
  age: z.number().min(1).max(100).optional(),
});

export default function Family() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyMembers = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members']
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "child",
      profileImage: "",
      age: undefined,
      permissions: {
        apps: [],
        timeRestrictions: {},
        networkAccess: true,
        contacts: []
      },
      isActive: true
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => 
      apiRequest('POST', '/api/family-members', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-members'] });
      setShowAddDialog(false);
      form.reset();
      toast({
        title: "Family Member Added",
        description: "New family member has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Add Member",
        description: "There was an error adding the family member. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    addMemberMutation.mutate(data);
  };

  const getStatusColor = (member: FamilyMember) => {
    return member.isActive ? "bg-green-500" : "bg-gray-400";
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'child':
        return <Shield className="h-4 w-4" />;
      case 'spouse':
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="p-6">
          <div className="skeleton h-8 w-32 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-24 rounded-lg" />
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Family</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-trust-blue hover:bg-deep-blue">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="caregiver">Caregiver</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter age" 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter image URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={addMemberMutation.isPending}>
                      {addMemberMutation.isPending ? 'Adding...' : 'Add Member'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {familyMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.profileImage || undefined} alt={member.name} />
                      <AvatarFallback className="bg-trust-blue text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member)} rounded-full border-2 border-white`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {getRoleIcon(member.role)}
                        <span className="ml-1 capitalize">{member.role}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      {member.age && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{member.age} years old</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{member.isActive ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>

                    {member.permissions?.timeRestrictions && Object.keys(member.permissions.timeRestrictions).length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Active restrictions: {Object.keys(member.permissions.timeRestrictions).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {familyMembers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Family Members</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start by adding your first family member to begin managing their device security.
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="bg-trust-blue hover:bg-deep-blue">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Family Member
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
