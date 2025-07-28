import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";

export default function GuardianSignIn() {
  const [, setLocation] = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Handle sign in logic
    console.log("Signing in with:", { email, password });
    // For now, redirect to dashboard
    setLocation("/dashboard");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const handleRegister = () => {
    setLocation("/register");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient background matching the image */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #E8E8FF 0%, #F0E8FF 30%, #F8E8FF 60%, #FFE8F8 100%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen px-8">
        {/* Top language selector */}
        <div className="flex justify-end pt-12 pb-8">
          <button className="flex items-center space-x-1 text-gray-700">
            <span className="text-sm font-medium">{selectedLanguage}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-black">Sign into AGI</h1>
          </div>

          {/* Form */}
          <div className="space-y-4 mb-6">
            {/* Email Input */}
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 rounded-2xl bg-white border-gray-200 text-gray-700 placeholder-gray-400 px-6 text-base"
              />
              {email && (
                <button
                  onClick={() => setEmail("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 rounded-2xl bg-white border-gray-200 text-gray-700 placeholder-gray-400 px-6 text-base"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Recover Password Link */}
            <div className="text-center">
              <button className="text-sm text-gray-400 hover:text-gray-600">
                Recover Password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            className="w-full h-14 rounded-2xl text-white font-medium text-lg mb-8"
            style={{ backgroundColor: '#4461F2' }}
          >
            Sign In
          </Button>

          {/* Divider */}
          <div className="text-center mb-8">
            <span className="text-gray-400 text-sm">Or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <div className="flex space-x-4 mb-12">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex-1 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            {/* Apple */}
            <button
              onClick={() => handleSocialLogin('Apple')}
              className="flex-1 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="flex-1 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-gray-700">if you don't an account </span>
            <button 
              onClick={handleRegister}
              className="text-blue-500 font-medium hover:text-blue-600"
            >
              you can Register here!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}