import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianPhoneVerify() {
  const [, setLocation] = useLocation();
  const [countryCode, setCountryCode] = useState("+44");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleBack = () => {
    setLocation("/register");
  };

  const handleNext = () => {
    if (phoneNumber.trim()) {
      // Navigate to next verification step
      setLocation("/dashboard");
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as 000-000-0000
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
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
            Begin now!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Please provide your mobile number to verify your account.
          </p>
        </div>

        {/* Phone number input */}
        <div className="mb-12">
          <div className="flex items-center bg-white rounded-2xl border border-gray-200 p-4">
            {/* Country selector */}
            <div className="flex items-center space-x-2 mr-3 border-r border-gray-200 pr-3">
              <div className="w-6 h-4 bg-red-500 rounded-sm relative overflow-hidden">
                {/* UK Flag */}
                <div className="absolute inset-0 bg-blue-700"></div>
                <div className="absolute inset-0 bg-white transform rotate-45 origin-center scale-110"></div>
                <div className="absolute inset-0 bg-red-600 transform -rotate-45 origin-center scale-75"></div>
                <div className="absolute inset-0 bg-red-600 transform rotate-45 origin-center scale-75"></div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
            
            {/* Phone input */}
            <input
              type="tel"
              value={`${countryCode} ${phoneNumber}`}
              onChange={(e) => {
                const value = e.target.value.replace(`${countryCode} `, '');
                handlePhoneChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder={`${countryCode} 000-000-0000`}
              className="flex-1 text-lg text-black placeholder-gray-400 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Privacy notice */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            By clicking "Next," you accept the Privacy policy and Terms of service
          </p>
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!phoneNumber.trim()}
          className={`w-full h-14 rounded-2xl font-medium text-lg transition-all mb-8 ${
            phoneNumber.trim() 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </Button>

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-4">
          {/* Row 1 */}
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '1'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>1</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '2'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>2</span>
            <span className="text-xs text-gray-500">ABC</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '3'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>3</span>
            <span className="text-xs text-gray-500">DEF</span>
          </button>

          {/* Row 2 */}
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '4'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>4</span>
            <span className="text-xs text-gray-500">GHI</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '5'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>5</span>
            <span className="text-xs text-gray-500">JKL</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '6'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>6</span>
            <span className="text-xs text-gray-500">MNO</span>
          </button>

          {/* Row 3 */}
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '7'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>7</span>
            <span className="text-xs text-gray-500">PQRS</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '8'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>8</span>
            <span className="text-xs text-gray-500">TUV</span>
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '9'))}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>9</span>
            <span className="text-xs text-gray-500">WXYZ</span>
          </button>

          {/* Row 4 */}
          <div></div>
          <button 
            onClick={() => setPhoneNumber(prev => formatPhoneNumber(prev.replace(/\D/g, '') + '0'))}
            className="h-16 bg-white rounded-2xl flex items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            0
          </button>
          <button 
            onClick={() => setPhoneNumber(prev => {
              const digits = prev.replace(/\D/g, '');
              return formatPhoneNumber(digits.slice(0, -1));
            })}
            className="h-16 bg-white rounded-2xl flex items-center justify-center text-black border border-gray-200 hover:bg-gray-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Bottom indicator */}
        <div className="flex justify-center mt-8">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}