import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function GuardianWelcome() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleSignIn = () => {
    // Navigate to sign in
    console.log("Sign In clicked");
  };

  const handleRegister = () => {
    // Navigate to register
    console.log("Register clicked");
  };

  const handleSkip = () => {
    // Skip to main app
    console.log("Skip clicked");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #E8E8FF 0%, #F0E8FF 50%, #FFE8F0 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen px-8">
        {/* Top language selector */}
        <div className="flex justify-end pt-12 pb-8">
          <button className="flex items-center space-x-1 text-gray-700">
            <span className="text-sm font-medium">{selectedLanguage}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Main content - Tree logo and branding */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Tree SVG Logo */}
          <div className="mb-8">
            <svg 
              width="200" 
              height="160" 
              viewBox="0 0 200 160" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                {/* Tree trunk */}
                <rect x="95" y="120" width="10" height="25" fill="url(#treeGradient)" />
                
                {/* Tree foliage - multiple organic shapes */}
                <path 
                  d="M100 120C130 120 150 100 150 80C150 70 145 60 135 55C140 45 135 35 125 30C130 20 125 10 115 8C120 -2 110 -8 100 -5C90 -8 80 -2 85 8C75 10 70 20 75 30C65 35 60 45 65 55C55 60 50 70 50 80C50 100 70 120 100 120Z" 
                  fill="url(#treeGradient)"
                />
                
                {/* Additional foliage details */}
                <circle cx="85" cy="70" r="15" fill="url(#treeGradient)" opacity="0.8" />
                <circle cx="115" cy="65" r="12" fill="url(#treeGradient)" opacity="0.8" />
                <circle cx="100" cy="85" r="18" fill="url(#treeGradient)" opacity="0.9" />
                
                {/* Ground/roots indication */}
                <ellipse cx="100" cy="145" rx="30" ry="3" fill="url(#treeGradient)" opacity="0.3" />
              </g>
              
              <defs>
                <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="50%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#E879F9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* AGI Branding */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-2">AGI</h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg text-gray-600 font-medium">BY ASTAR</span>
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with buttons */}
        <div className="pb-12">
          {/* Buttons */}
          <div className="flex space-x-4 mb-6">
            {/* Sign In button */}
            <Button
              onClick={handleSignIn}
              className="flex-1 h-12 rounded-full text-white font-medium text-base"
              style={{ backgroundColor: '#4461F2' }}
            >
              Sign In
            </Button>

            {/* Register button */}
            <Button
              onClick={handleRegister}
              variant="outline"
              className="flex-1 h-12 rounded-full bg-white border-gray-300 text-gray-700 font-medium text-base hover:bg-gray-50"
            >
              Register
            </Button>
          </div>

          {/* Skip option */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="text-sm font-medium"
              style={{ color: '#4461F2' }}
            >
              Skip {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}