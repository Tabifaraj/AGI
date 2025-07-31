import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianSetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBack = () => {
    setLocation("/guardian-type");
  };

  const handleNext = () => {
    if (password && confirmPassword && password === confirmPassword && isValidPassword()) {
      setLocation("/congratulations");
    }
  };

  const isValidPassword = () => {
    return (
      password.length >= 6 && 
      password.length <= 20 &&
      /[0-9]/.test(password) &&
      /[a-z]/.test(password) &&
      !/\s/.test(password)
    );
  };

  const canProceed = password && confirmPassword && password === confirmPassword && isValidPassword();

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

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white rounded-full relative">
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black leading-tight mb-6">
            Please set password
          </h1>
        </div>

        {/* Password inputs */}
        <div className="space-y-6 mb-8">
          <Input
            type="password"
            placeholder="Enter password password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-16 rounded-2xl border-2 border-gray-200 px-6 text-lg placeholder:text-gray-400 focus:border-black focus:outline-none"
          />
          
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-16 rounded-2xl border-2 border-gray-200 px-6 text-lg placeholder:text-gray-400 focus:border-black focus:outline-none"
          />
        </div>

        {/* Password requirements */}
        <div className="space-y-3 mb-12">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${password.length >= 6 && password.length <= 20 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-600 text-base">6-20 characters</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) && /[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-600 text-base">Includes numbers, lowercase letters</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${!/\s/.test(password) && password ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-600 text-base">No spaces</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-gray-600 text-base">Duplicate login name</span>
          </div>
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full h-16 rounded-2xl font-medium text-lg transition-all ${
            canProceed 
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