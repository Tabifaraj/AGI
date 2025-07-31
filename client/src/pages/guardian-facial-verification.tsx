import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Loader } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianFacialVerification() {
  const [, setLocation] = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'analyzing' | 'uploading' | 'accepting' | 'complete'>('analyzing');

  useEffect(() => {
    // Simulate verification process
    const timer1 = setTimeout(() => setVerificationStatus('uploading'), 2000);
    const timer2 = setTimeout(() => setVerificationStatus('accepting'), 4000);
    const timer3 = setTimeout(() => setVerificationStatus('complete'), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleBack = () => {
    setLocation("/facial-camera");
  };

  const handleCompleteVerification = () => {
    setLocation("/guardian-type");
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black leading-tight mb-4">
            Hold on a moment
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            We are analyzing your profile verification.
          </p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Cloud */}
            <div className="w-24 h-16 bg-gray-300 rounded-full relative">
              <div className="absolute -left-4 top-2 w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="absolute -right-4 top-4 w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Document */}
            <div className="absolute -left-8 top-8 w-16 h-20 bg-blue-400 rounded-lg shadow-lg">
              <div className="absolute top-2 right-2 w-6 h-8 bg-yellow-400 rounded"></div>
              {/* Document lines */}
              <div className="absolute top-4 left-2 w-8 h-0.5 bg-blue-300"></div>
              <div className="absolute top-6 left-2 w-6 h-0.5 bg-blue-300"></div>
              <div className="absolute top-8 left-2 w-10 h-0.5 bg-blue-300"></div>
            </div>

            {/* Rocket */}
            <div className="absolute -right-6 top-12 w-8 h-12">
              <div className="w-6 h-8 bg-yellow-400 rounded-t-full mx-auto"></div>
              <div className="w-8 h-4 bg-pink-400 rounded-b-lg"></div>
              {/* Flames */}
              <div className="flex justify-center mt-1 space-x-1">
                <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
                <div className="w-1 h-3 bg-red-400 rounded-full"></div>
                <div className="w-1 h-2 bg-orange-400 rounded-full"></div>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute right-8 top-16 space-y-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Status list */}
        <div className="space-y-6 mb-12">
          {/* Documents uploaded */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-black text-lg font-medium">Documents have been uploaded</span>
          </div>

          {/* Documents accepted */}
          <div className="flex items-center space-x-4">
            {verificationStatus === 'analyzing' ? (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Loader className="w-5 h-5 text-gray-600 animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
            <span className={`text-lg font-medium ${verificationStatus === 'analyzing' ? 'text-gray-500' : 'text-black'}`}>
              Documents accepted
            </span>
          </div>

          {/* Selfie accepted */}
          <div className="flex items-center space-x-4">
            {verificationStatus === 'analyzing' || verificationStatus === 'uploading' ? (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Loader className="w-5 h-5 text-gray-600 animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            )}
            <span className={`text-lg font-medium ${verificationStatus === 'analyzing' || verificationStatus === 'uploading' ? 'text-gray-500' : 'text-black'}`}>
              Selfie accepted
            </span>
          </div>
        </div>

        {/* Complete button */}
        <Button
          onClick={handleCompleteVerification}
          disabled={verificationStatus !== 'complete'}
          className={`w-full h-16 rounded-2xl font-medium text-lg transition-all ${
            verificationStatus === 'complete' 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Complete verification
        </Button>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}