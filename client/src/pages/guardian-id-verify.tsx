import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, X, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianIdVerify() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/sms-verify");
  };

  const handleBeginShooting = () => {
    // Navigate to camera screen
    setLocation("/id-camera");
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
        {/* Back button */}
        <div className="mb-8">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Main heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black leading-tight mb-4">
            We need to capture both sides of your ID
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Please take a photo of your most recent ID for verification.
          </p>
        </div>

        {/* Guidelines */}
        <div className="space-y-6 mb-16">
          {/* Guideline 1 - Keep ID straight */}
          <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
            <div className="flex-shrink-0">
              <div className="w-16 h-12 bg-yellow-400 rounded-lg flex items-center justify-center relative">
                <div className="w-10 h-7 bg-yellow-300 rounded border-2 border-yellow-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-800" />
                </div>
                {/* ID lines */}
                <div className="absolute right-2 top-3 space-y-1">
                  <div className="w-3 h-0.5 bg-yellow-600"></div>
                  <div className="w-3 h-0.5 bg-yellow-600"></div>
                  <div className="w-2 h-0.5 bg-yellow-600"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-black text-lg font-medium">
                Keep your ID straight in the frame.
              </p>
            </div>
          </div>

          {/* Guideline 2 - Avoid blurry photos */}
          <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
            <div className="flex-shrink-0">
              <div className="w-16 h-12 bg-yellow-400 rounded-lg flex items-center justify-center relative">
                <div className="w-10 h-7 bg-yellow-300 rounded border-2 border-yellow-600 flex items-center justify-center opacity-60">
                  <User className="w-4 h-4 text-yellow-800" />
                </div>
                {/* Blur effect */}
                <div className="absolute inset-0 bg-gray-400 rounded-lg opacity-30"></div>
                <X className="absolute top-1 right-1 w-3 h-3 text-red-500 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-black text-lg font-medium">
                Avoid photos that are glarey, blurry, or unclear.
              </p>
            </div>
          </div>

          {/* Guideline 3 - Use official documents */}
          <div className="flex items-start space-x-4 py-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-12 bg-yellow-400 rounded-lg flex items-center justify-center relative">
                <div className="w-10 h-7 bg-yellow-300 rounded border-2 border-yellow-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-yellow-800" />
                </div>
                {/* Check mark */}
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
                {/* ID lines */}
                <div className="absolute right-2 top-3 space-y-1">
                  <div className="w-3 h-0.5 bg-yellow-600"></div>
                  <div className="w-3 h-0.5 bg-yellow-600"></div>
                  <div className="w-2 h-0.5 bg-yellow-600"></div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-black text-lg font-medium">
                Use official documents.
              </p>
            </div>
          </div>
        </div>

        {/* Begin shooting button */}
        <Button
          onClick={handleBeginShooting}
          className="w-full h-16 rounded-2xl bg-gray-800 text-white font-medium text-lg hover:bg-gray-700 transition-colors"
        >
          Begin shooting.
        </Button>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}