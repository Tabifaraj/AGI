import React from "react";
import { Button } from "@/components/ui/button";

export default function GuardianWelcome() {
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
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute inset-0">
        {/* Blue blur circle - bottom right */}
        <div 
          className="absolute w-[226px] h-[226px] rounded-full"
          style={{
            background: '#4461F2',
            filter: 'blur(158.5px)',
            left: '139px',
            top: '698px',
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Yellow blur circle - left side */}
        <div 
          className="absolute w-[226px] h-[226px] rounded-full opacity-45"
          style={{
            background: '#DDA82A',
            filter: 'blur(158.5px)',
            left: '-30px',
            top: '430px',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Main image/content area */}
        <div 
          className="mx-8 mt-6 rounded-lg flex-1"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            maxHeight: '483px'
          }}
        >
          {/* Placeholder for main content - this would contain the actual app preview/onboarding content */}
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">AGI Guardian</h1>
              <p className="text-lg opacity-90">Protect your family with AI-powered monitoring</p>
            </div>
          </div>
        </div>

        {/* Bottom section with buttons */}
        <div className="px-8 pb-8 pt-6">
          {/* Buttons */}
          <div className="flex space-x-4 mb-4">
            {/* Sign In button */}
            <Button
              onClick={handleSignIn}
              className="flex-1 h-[42px] rounded-[21px] text-white font-medium"
              style={{ backgroundColor: '#4461F2' }}
            >
              Sign In
            </Button>

            {/* Register button */}
            <Button
              onClick={handleRegister}
              variant="outline"
              className="flex-1 h-[42px] rounded-[21px] bg-white border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
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