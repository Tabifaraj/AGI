import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianSmsVerify() {
  const [, setLocation] = useLocation();
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(119); // 1:59 in seconds
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    setLocation("/phone-verify");
  };

  const handleCodeInput = (digit: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeypadInput = (digit: string) => {
    const emptyIndex = verificationCode.findIndex(code => code === "");
    if (emptyIndex !== -1) {
      handleCodeInput(digit, emptyIndex);
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = verificationCode.map((code, index) => code ? index : -1).filter(i => i !== -1).pop();
    if (lastFilledIndex !== undefined) {
      const newCode = [...verificationCode];
      newCode[lastFilledIndex] = "";
      setVerificationCode(newCode);
    }
  };

  const handleResend = () => {
    setTimeLeft(119);
    setCanResend(false);
    setVerificationCode(["", "", "", "", "", ""]);
    // In real app, would trigger SMS resend
  };

  const handleNext = () => {
    const code = verificationCode.join("");
    if (code.length === 6) {
      // Verify code and navigate to next step
      setLocation("/dashboard");
    }
  };

  const isCodeComplete = verificationCode.every(digit => digit !== "");

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
            Input verification code
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Please input the code from the SMS.
          </p>
        </div>

        {/* Code input boxes */}
        <div className="flex justify-between mb-8">
          {verificationCode.map((digit, index) => (
            <div key={index} className="relative">
              <input
                id={`code-input-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeInput(e.target.value, index)}
                className="w-12 h-16 text-center text-2xl font-medium bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none"
                style={{ caretColor: 'transparent' }}
              />
              {digit && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-black"></div>
              )}
            </div>
          ))}
        </div>

        {/* Resend and timer */}
        <div className="flex justify-between items-center mb-16">
          <button
            onClick={canResend ? handleResend : undefined}
            className={`text-base ${canResend ? 'text-black hover:underline' : 'text-gray-400'}`}
            disabled={!canResend}
          >
            Resend code for reload
          </button>
          <span className="text-black font-medium text-base">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Don't receive OTP section */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-gray-600 text-base">Don't receive an OTP?</span>
          <button
            onClick={handleResend}
            className="text-black font-medium text-base hover:underline"
          >
            Resend now
          </button>
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          disabled={!isCodeComplete}
          className={`w-full h-14 rounded-2xl font-medium text-lg transition-all mb-8 ${
            isCodeComplete 
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
            onClick={() => handleKeypadInput('1')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>1</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('2')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>2</span>
            <span className="text-xs text-gray-500">ABC</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('3')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>3</span>
            <span className="text-xs text-gray-500">DEF</span>
          </button>

          {/* Row 2 */}
          <button 
            onClick={() => handleKeypadInput('4')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>4</span>
            <span className="text-xs text-gray-500">GHI</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('5')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>5</span>
            <span className="text-xs text-gray-500">JKL</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('6')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>6</span>
            <span className="text-xs text-gray-500">MNO</span>
          </button>

          {/* Row 3 */}
          <button 
            onClick={() => handleKeypadInput('7')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>7</span>
            <span className="text-xs text-gray-500">PQRS</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('8')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>8</span>
            <span className="text-xs text-gray-500">TUV</span>
          </button>
          <button 
            onClick={() => handleKeypadInput('9')}
            className="h-16 bg-white rounded-2xl flex flex-col items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            <span>9</span>
            <span className="text-xs text-gray-500">WXYZ</span>
          </button>

          {/* Row 4 */}
          <div></div>
          <button 
            onClick={() => handleKeypadInput('0')}
            className="h-16 bg-white rounded-2xl flex items-center justify-center text-black font-medium text-xl border border-gray-200 hover:bg-gray-50"
          >
            0
          </button>
          <button 
            onClick={handleBackspace}
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