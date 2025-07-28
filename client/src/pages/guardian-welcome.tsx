import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import startupImage from "@assets/image_1753717742776.png";

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
      {/* Use the exact startup image as background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${startupImage})`
        }}
      />
      
      {/* Overlay to ensure text readability if needed */}
      <div className="absolute inset-0 bg-black bg-opacity-10" />

      {/* Content overlay matching the original image layout */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* This will overlay the exact positions from your image */}
        {/* The image already contains all the visual elements, so we just need minimal overlay */}
        
        {/* Invisible buttons positioned over the image buttons */}
        <div className="flex-1" />
        
        {/* Button area - positioned to match the image */}
        <div className="pb-16 px-8">
          <div className="flex space-x-4 mb-6">
            {/* Invisible Sign In button overlay */}
            <button
              onClick={handleSignIn}
              className="flex-1 h-12 bg-transparent"
              aria-label="Sign In"
            />

            {/* Invisible Register button overlay */}
            <button
              onClick={handleRegister}
              className="flex-1 h-12 bg-transparent"
              aria-label="Register"
            />
          </div>

          {/* Invisible Skip button overlay */}
          <div className="text-center">
            <button
              onClick={handleSkip}
              className="h-8 w-16 bg-transparent"
              aria-label="Skip"
            />
          </div>
        </div>
      </div>
    </div>
  );
}