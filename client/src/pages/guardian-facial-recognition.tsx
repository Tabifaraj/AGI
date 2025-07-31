import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianFacialRecognition() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/id-confirm");
  };

  const handleStartFacialRecognition = () => {
    setLocation("/facial-camera");
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
            Facial recognition
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            If any information is incorrect, please retake the ID photo.
          </p>
        </div>

        {/* Main avatar */}
        <div className="flex justify-center mb-12">
          <div className="w-48 h-48 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-40 h-40 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full flex items-center justify-center relative">
              {/* Face illustration */}
              <div className="relative">
                {/* Hair */}
                <div className="absolute -top-6 -left-8 w-16 h-12 bg-pink-500 rounded-t-full"></div>
                {/* Face */}
                <div className="w-20 h-24 bg-pink-200 rounded-full relative">
                  {/* Eyes */}
                  <div className="absolute top-8 left-4 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-8 right-4 w-2 h-2 bg-black rounded-full"></div>
                  {/* Nose */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-pink-300"></div>
                  {/* Mouth */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-pink-400 rounded-full"></div>
                </div>
                {/* Shirt */}
                <div className="absolute -bottom-4 -left-6 w-12 h-8 bg-teal-400 rounded-t-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="flex justify-between mb-16">
          {/* Position face in circle */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-8 h-10 bg-pink-200 rounded-full relative">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-tight max-w-20">
              Position your face within the circle
            </p>
          </div>

          {/* Ensure clear lighting */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3 relative">
              <div className="w-12 h-12 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full flex items-center justify-center opacity-70">
                <div className="w-8 h-10 bg-pink-200 rounded-full relative">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                </div>
              </div>
              {/* Blur effect */}
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-50 blur-sm"></div>
            </div>
            <p className="text-gray-600 text-sm leading-tight max-w-20">
              Ensure clear lighting, with no glare
            </p>
          </div>

          {/* Do not wear accessories */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
                <div className="w-8 h-10 bg-pink-200 rounded-full relative">
                  <div className="absolute top-2 left-2 w-1 h-1 bg-black rounded-full"></div>
                  <div className="absolute top-2 right-2 w-1 h-1 bg-black rounded-full"></div>
                  {/* Sunglasses */}
                  <div className="absolute top-1 left-1 w-6 h-2 bg-black rounded opacity-80"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-tight max-w-20">
              Do not wear sunglasses or a hat
            </p>
          </div>
        </div>

        {/* Start button */}
        <Button
          onClick={handleStartFacialRecognition}
          className="w-full h-16 rounded-2xl bg-gray-800 text-white font-medium text-lg hover:bg-gray-700 transition-colors"
        >
          Start facial recognition
        </Button>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}