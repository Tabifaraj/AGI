import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianRegister() {
  const [, setLocation] = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleNext = () => {
    if (acceptedTerms) {
      // Navigate to phone verification step
      setLocation("/phone-verify");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 pt-3 pb-4">
        <span className="text-black font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <svg className="w-6 h-6 ml-2" viewBox="0 0 24 24" fill="none">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48L8 16.5l3.15-3.55.85 1.48L9.15 16.95z" fill="black"/>
          </svg>
          <div className="w-6 h-3 border border-black rounded-sm">
            <div className="w-4/5 h-full bg-black rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Main heading */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-black leading-tight mb-2">
            Complete your registration
          </h1>
          <h2 className="text-3xl font-bold text-black leading-tight">
            In just 3 steps
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {/* Step 1 */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">1</span>
            </div>
            <span className="text-lg text-black">Verify your phone number</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">2</span>
            </div>
            <span className="text-lg text-black">Authenticate your identity</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">3</span>
            </div>
            <span className="text-lg text-black">Confirm your information</span>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="bg-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mt-1">
              <Shield className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-black font-medium text-sm leading-relaxed">
                ASTAR is committed to protecting your personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Terms checkbox */}
        <div className="mb-8">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-1"
            />
            <div>
              <p className="text-sm text-black leading-relaxed">
                By checking this box, I confirm that I have read and agree to ASTAR Personal Data Processing Regulations and the Terms and Conditions for account services.
              </p>
            </div>
          </div>
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!acceptedTerms}
          className={`w-full h-14 rounded-2xl font-medium text-lg transition-all ${
            acceptedTerms 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </Button>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}