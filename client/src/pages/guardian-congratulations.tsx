import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Truck, Smartphone } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianCongratulations() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/set-password");
  };

  const handleLogin = () => {
    setLocation("/dashboard");
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

        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black leading-tight mb-6 text-center">
            Congratulation!
          </h1>
        </div>

        {/* Account information */}
        <div className="bg-gray-100 rounded-2xl p-6 mb-8 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 text-lg">Account number</span>
            <span className="text-black font-medium text-lg">1386 8888 66</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 text-lg">Account Owner</span>
            <span className="text-black font-medium text-lg">Thanh Nhan</span>
          </div>
          
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600 text-lg">Activation date</span>
            <span className="text-black font-medium text-lg">01/01/2024</span>
          </div>
        </div>

        {/* Information sections */}
        <div className="space-y-6 mb-12">
          {/* Email delivery */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mt-1">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-black text-lg font-medium leading-tight">
                You will receive your Email within 3 days
              </p>
            </div>
          </div>

          {/* App tracking */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mt-1">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-black text-lg font-medium leading-tight">
                Track delivery progress and activate card right on the app
              </p>
            </div>
          </div>
        </div>

        {/* Login button */}
        <Button
          onClick={handleLogin}
          className="w-full h-16 rounded-2xl bg-gray-800 text-white font-medium text-lg hover:bg-gray-700 transition-colors"
        >
          Login
        </Button>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}