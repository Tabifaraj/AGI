import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, MoreHorizontal, Home, Heart, Book, Calendar, Shield, MessageCircle, BarChart3, Settings as SettingsIcon, MapPin, Clock, Users, Filter } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-white text-sm">
        <span className="font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
          <span className="ml-2">📶 📶</span>
        </div>
      </div>

      {/* Search and navigation bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg"
          />
        </div>
        
        <div className="flex space-x-6 text-sm">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-1">Members</button>
          <button className="text-gray-500">Assign Task</button>
          <button className="text-gray-500">My Space</button>
          <button className="text-gray-500">Family Locations</button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Guardians Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Guardians</h2>
            <User className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Alexander</div>
                <div className="text-sm text-gray-500">alexanderhung@gmail.com</div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">August Hilton</div>
                <div className="text-sm text-gray-500">augusthilton@aol.com</div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Children</h2>
            <User className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                N
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Noelle Norman</div>
                <div className="text-sm text-gray-500">noellenorman@mail.com</div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                N
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Nicolas Hugo</div>
                <div className="text-sm text-gray-500">nicolashugo@hotmail.com</div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                V
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Viona Scylla</div>
                <div className="text-sm text-gray-500">vionascylla@gmail.com</div>
              </div>
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Emergency Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium">
            Lock all Devices
          </Button>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium">
            Emergency SOS
          </Button>
        </div>

        {/* Small icons row */}
        <div className="flex justify-center space-x-8 py-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <SettingsIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
          </div>
        </div>

        {/* AI Security Assistant */}
        <div className="bg-purple-100 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="font-medium text-purple-800">AI Security Assistant</div>
              <div className="text-sm text-purple-600">Listening for voice commands...</div>
            </div>
          </div>
          
          <div className="bg-white/70 rounded-lg p-3 mb-3">
            <div className="text-gray-700 text-sm">"Lock all social media apps for Emma after 8 PM"</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">✓ Applied</span>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
          </div>
          
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg">
            Speak to AI Assistant
          </Button>
        </div>

        {/* Security Controls */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Security Controls</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">App Access Control</div>
                  <div className="text-sm text-gray-500">Manage app permissions and usage time</div>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded"></div>
                <div>
                  <div className="font-medium text-gray-800">Network Control</div>
                  <div className="text-sm text-gray-500">Monitor and control network data</div>
                </div>
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded-full relative">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">Content Filtering</div>
                  <div className="text-sm text-gray-500">Control what can be viewed via apps</div>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">Screen Time Limits</div>
                  <div className="text-sm text-gray-500">Set daily usage time for apps and categories</div>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium text-gray-800">Location-Based Rules</div>
                  <div className="text-sm text-gray-500">Apply different restrictions based on location</div>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto space-y-2 bg-blue-50 border-blue-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-800">Lock All</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto space-y-2 bg-green-50 border-green-200">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-800">Safe Mode</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto space-y-2 bg-purple-50 border-purple-200">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-purple-800">Activity</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto space-y-2 bg-gray-50 border-gray-200">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-800">Settings</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-1">
            <Home className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Heart className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Family</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Book className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">School</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">GPS</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="relative">
              <Shield className="h-5 w-5 text-red-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <span className="text-xs text-red-500">Safety</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <MessageCircle className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Mobile</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Activity</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <SettingsIcon className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Settings</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
