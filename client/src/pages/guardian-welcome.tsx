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
          {/* Tree Logo - Exact from Figma */}
          <div className="mb-8">
            <svg 
              width="200" 
              height="180" 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Detailed tree matching the Figma design exactly */}
              <g>
                {/* Main trunk */}
                <path d="M95 160 L105 160 L108 180 L92 180 Z" fill="url(#trunkGradient)"/>
                
                {/* Root system */}
                <path d="M85 180 Q100 185 115 180 Q130 178 140 182 L135 185 Q100 190 65 185 Q80 178 85 180" fill="url(#trunkGradient)" opacity="0.6"/>
                
                {/* Main canopy - organic irregular shape matching Figma */}
                <path d="M100 160 
                         C75 155 60 140 65 120 
                         C62 110 68 95 78 90
                         C75 80 82 65 95 60
                         C88 45 98 30 115 35
                         C110 20 125 15 135 25
                         C140 15 155 20 158 35
                         C165 30 175 40 172 50
                         C180 55 185 70 178 80
                         C185 85 188 100 180 110
                         C188 115 185 130 175 135
                         C180 145 170 160 155 158
                         C145 165 125 165 115 160
                         C108 162 102 161 100 160 Z" 
                      fill="url(#leafGradient)"/>
                
                {/* Inner foliage details for depth */}
                <circle cx="90" cy="105" r="12" fill="url(#leafGradient)" opacity="0.8"/>
                <circle cx="125" cy="95" r="15" fill="url(#leafGradient)" opacity="0.7"/>
                <circle cx="110" cy="120" r="10" fill="url(#leafGradient)" opacity="0.9"/>
                <circle cx="140" cy="110" r="8" fill="url(#leafGradient)" opacity="0.8"/>
                <circle cx="85" cy="125" r="7" fill="url(#leafGradient)" opacity="0.6"/>
                
                {/* Additional organic shapes for realistic texture */}
                <path d="M80 100 Q95 95 105 105 Q115 110 120 105 Q125 100 130 108 Q125 115 115 118 Q105 120 95 115 Q85 110 80 100" 
                      fill="url(#leafGradient)" opacity="0.5"/>
                
                {/* Small branch details */}
                <path d="M95 140 L88 135 M105 142 L112 137 M98 125 L92 120" stroke="url(#trunkGradient)" strokeWidth="2" opacity="0.7"/>
                
                {/* Texture lines in foliage */}
                <path d="M85 90 Q100 95 115 90 M90 110 Q105 115 120 110 M95 130 Q110 135 125 130" 
                      stroke="url(#leafGradient)" strokeWidth="1" opacity="0.3"/>
              </g>
              
              <defs>
                <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6"/>
                  <stop offset="30%" stopColor="#A855F7"/>
                  <stop offset="60%" stopColor="#C084FC"/>
                  <stop offset="100%" stopColor="#E879F9"/>
                </linearGradient>
                <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED"/>
                  <stop offset="50%" stopColor="#8B5CF6"/>
                  <stop offset="100%" stopColor="#A855F7"/>
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