import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianFacialCamera() {
  const [, setLocation] = useLocation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    setLocation("/facial-recognition");
  };

  const handleCameraClick = () => {
    // In a real app, this would open the device camera
    // For now, we'll simulate with file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        // Auto-proceed to verification after capturing
        setTimeout(() => {
          setLocation("/facial-verification");
        }, 1000);
      };
      reader.readAsDataURL(file);
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
      <div className="px-6 pb-8 flex flex-col h-full">
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

        {/* Face capture area */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          <div className="relative">
            {/* Main circle with dashed border */}
            <div className="w-64 h-64 border-4 border-dashed border-teal-500 rounded-full flex items-center justify-center">
              <div className="w-56 h-56 bg-yellow-400 rounded-full flex items-center justify-center">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt="Captured face" 
                    className="w-48 h-48 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Camera button */}
        <div className="flex justify-center">
          <button
            onClick={handleCameraClick}
            className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}