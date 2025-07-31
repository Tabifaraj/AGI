import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianIdConfirm() {
  const [, setLocation] = useLocation();
  const [sex, setSex] = useState<'Male' | 'Female'>('Male');
  const [idInfo, setIdInfo] = useState({
    fullName: 'Thanh Nhan',
    dateOfBirth: '01/01/1999',
    idNumber: '123456789l0',
    issueDate: '01/01/2024',
    placeOfIssue: 'HaNoi',
    address: '191 Hai Ba Trung, Long Bien, Ha Noi'
  });

  const handleBack = () => {
    setLocation("/id-camera");
  };

  const handleRetake = () => {
    setLocation("/id-camera");
  };

  const handleConfirm = () => {
    // Save ID information and proceed to facial recognition
    setLocation("/facial-recognition");
  };

  const handleInputChange = (field: string, value: string) => {
    setIdInfo(prev => ({
      ...prev,
      [field]: value
    }));
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
            Please retake the photo.
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            If any information is incorrect, please retake the ID photo.
          </p>
        </div>

        {/* Sex selector */}
        <div className="mb-8">
          <label className="block text-black text-lg font-medium mb-3">Sex</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setSex('Male')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                sex === 'Male' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setSex('Female')}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                sex === 'Female' 
                  ? 'bg-black text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* ID Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black mb-6">ID information</h2>
          
          <div className="space-y-6">
            {/* Full name */}
            <div>
              <label className="block text-gray-600 text-base mb-2">Full name</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-gray-600 text-base mb-2">Date of birth</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>

            {/* ID number */}
            <div>
              <label className="block text-gray-600 text-base mb-2">ID number</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Issue date */}
            <div>
              <label className="block text-gray-600 text-base mb-2">Issue date</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.issueDate}
                  onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Place of issue */}
            <div>
              <label className="block text-gray-600 text-base mb-2">Place of issue</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.placeOfIssue}
                  onChange={(e) => handleInputChange('placeOfIssue', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-600 text-base mb-2">Address</label>
              <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                <input
                  type="text"
                  value={idInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="flex-1 text-black text-lg font-medium bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-8">
          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            className="w-full h-16 rounded-2xl bg-gray-800 text-white font-medium text-lg hover:bg-gray-700 transition-colors"
          >
            Confirm
          </Button>

          {/* Retake button */}
          <Button
            onClick={handleRetake}
            variant="outline"
            className="w-full h-16 rounded-2xl bg-white border-2 border-gray-300 text-black font-medium text-lg hover:bg-gray-50 transition-colors"
          >
            Retake
          </Button>
        </div>

        {/* Bottom indicator */}
        <div className="flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full"></div>
        </div>
      </div>
    </div>
  );
}