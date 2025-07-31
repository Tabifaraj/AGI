import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianType() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const guardianTypes = [
    "Mother",
    "Father", 
    "Grandparents",
    "Family Member",
    "Legal Guardian"
  ];

  const handleBack = () => {
    setLocation("/facial-verification");
  };

  const handleNext = () => {
    if (selectedType) {
      setLocation("/set-password");
    }
  };

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
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
            Guardian Type
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Choose your current position.
          </p>
        </div>

        {/* Dropdown selector */}
        <div className="mb-8">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-16 bg-white border-2 border-gray-200 rounded-2xl px-6 flex items-center justify-between text-left hover:border-gray-300 transition-colors"
            >
              <span className={`text-lg ${selectedType ? 'text-black font-medium' : 'text-gray-400'}`}>
                {selectedType || "Select"}
              </span>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                {guardianTypes.map((type, index) => (
                  <button
                    key={type}
                    onClick={() => handleSelectType(type)}
                    className={`w-full px-6 py-4 text-left text-lg font-medium text-black hover:bg-gray-50 transition-colors ${
                      index < guardianTypes.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next button */}
        <div className="mt-auto pt-16">
          <Button
            onClick={handleNext}
            disabled={!selectedType}
            className={`w-full h-16 rounded-2xl font-medium text-lg transition-all ${
              selectedType 
                ? 'bg-black text-white hover:bg-gray-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </Button>
        </div>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}