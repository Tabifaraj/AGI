import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianIdCamera() {
  const [, setLocation] = useLocation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        // Simulate validation - in real app would use ML/AI
        setIsValid(Math.random() > 0.5); // Random validation for demo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsValid(false);
  };

  const handleNext = () => {
    if (currentSide === 'front' && isValid) {
      // Move to back side
      setCurrentSide('back');
      setCapturedImage(null);
      setIsValid(false);
    } else if (currentSide === 'back' && isValid) {
      // Both sides captured, proceed to dashboard
      setLocation("/dashboard");
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
        {/* Main heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black leading-tight mb-4">
            Take a photo of the {currentSide} of your ID
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Place the {currentSide} of your ID in the frame.
          </p>
        </div>

        {/* ID Frame and Preview */}
        <div className="flex-1 flex flex-col items-center justify-center mb-6">
          <div className="relative w-full max-w-sm">
            {/* ID Frame */}
            <div className="aspect-[1.586/1] bg-white rounded-2xl border-4 border-red-500 p-4 shadow-lg">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured ID" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  {/* Sample ID placeholder */}
                  <div className="text-center text-gray-600">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-2 mx-auto"></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-20 mx-auto"></div>
                      <div className="h-2 bg-gray-300 rounded w-16 mx-auto"></div>
                      <div className="h-2 bg-gray-300 rounded w-24 mx-auto"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corner guidelines */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-red-500 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-red-500 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-red-500 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-red-500 rounded-br-lg"></div>
          </div>
        </div>

        {/* Validation Message */}
        {capturedImage && (
          <div className="text-center mb-6">
            <p className={`text-lg font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? 'The photo is valid.' : 'The photo is invalid.'}
            </p>
            {!isValid && (
              <button 
                onClick={handleRetake}
                className="mt-2 text-blue-600 hover:text-blue-800 underline"
              >
                Retake photo
              </button>
            )}
          </div>
        )}

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className={`w-full h-14 rounded-2xl font-medium text-lg transition-all mb-8 ${
            isValid 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentSide === 'front' ? 'Next (Back Side)' : 'Complete Verification'}
        </Button>

        {/* Camera button */}
        <div className="flex justify-center">
          <button
            onClick={handleCameraClick}
            className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          >
            <Camera className="w-8 h-8 text-gray-600" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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