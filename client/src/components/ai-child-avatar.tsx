import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MapPin, 
  MessageCircle, 
  Instagram,
  Footprints,
  Watch,
  Brain,
  Activity,
  Smile,
  Frown,
  Meh,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChildBiometrics {
  heartRate: number;
  stressLevel: number;
  emotionalState: 'happy' | 'neutral' | 'sad' | 'stressed' | 'excited';
  socialInteraction: number;
  voicePattern: 'normal' | 'distressed' | 'excited' | 'whisper';
}

interface ChildActivityData {
  socialMediaTime: number; // minutes today
  whatsappTime: number; // minutes today
  stepsToday: number;
  currentLocation: string;
  lastSeen: Date;
  batteryLevel: number;
}

interface AIChildAvatarProps {
  childName: string;
  childAge: number;
  avatarImage?: string;
}

export default function AIChildAvatar({ childName, childAge, avatarImage }: AIChildAvatarProps) {
  const [biometrics, setBiometrics] = useState<ChildBiometrics>({
    heartRate: 78,
    stressLevel: 2,
    emotionalState: 'happy',
    socialInteraction: 8,
    voicePattern: 'normal'
  });

  const [activityData, setActivityData] = useState<ChildActivityData>({
    socialMediaTime: 45,
    whatsappTime: 23,
    stepsToday: 3847,
    currentLocation: 'School Campus',
    lastSeen: new Date(),
    batteryLevel: 67
  });

  const [isListening, setIsListening] = useState(false);
  const [detectedThreat, setDetectedThreat] = useState<string | null>(null);

  // Simulate real-time biometric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => {
        const newHeartRate = 65 + Math.floor(Math.random() * 25);
        const newStressLevel = Math.floor(Math.random() * 10);
        
        let emotionalState: ChildBiometrics['emotionalState'] = 'happy';
        if (newStressLevel >= 7) emotionalState = 'stressed';
        else if (newStressLevel >= 5) emotionalState = 'neutral';
        else if (newHeartRate > 85) emotionalState = 'excited';
        else if (newStressLevel <= 2) emotionalState = 'happy';
        
        return {
          ...prev,
          heartRate: newHeartRate,
          stressLevel: newStressLevel,
          emotionalState,
          socialInteraction: Math.max(1, Math.min(10, prev.socialInteraction + (Math.random() - 0.5) * 2))
        };
      });

      // Simulate activity updates
      setActivityData(prev => ({
        ...prev,
        socialMediaTime: prev.socialMediaTime + Math.random() * 2,
        whatsappTime: prev.whatsappTime + Math.random() * 1,
        stepsToday: prev.stepsToday + Math.floor(Math.random() * 5),
        lastSeen: new Date(),
        batteryLevel: Math.max(0, prev.batteryLevel - Math.random() * 0.3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate voice monitoring
  useEffect(() => {
    const voiceInterval = setInterval(() => {
      setIsListening(true);
      
      // Simulate threat detection (very rare)
      if (Math.random() < 0.02) { // 2% chance
        const threats = [
          'Suspicious conversation detected',
          'Potential bullying language identified',
          'Distress keywords detected',
          'Unknown contact interaction'
        ];
        setDetectedThreat(threats[Math.floor(Math.random() * threats.length)]);
        setBiometrics(prev => ({ ...prev, emotionalState: 'stressed', voicePattern: 'distressed' }));
      } else {
        setDetectedThreat(null);
      }
      
      setTimeout(() => setIsListening(false), 1000);
    }, 8000);

    return () => clearInterval(voiceInterval);
  }, []);

  const getEmotionIcon = () => {
    switch (biometrics.emotionalState) {
      case 'happy':
      case 'excited':
        return <Smile className="h-6 w-6 text-green-500" />;
      case 'stressed':
        return <Frown className="h-6 w-6 text-red-500" />;
      case 'sad':
        return <Frown className="h-6 w-6 text-blue-500" />;
      default:
        return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getEmotionColor = () => {
    switch (biometrics.emotionalState) {
      case 'happy':
        return 'from-green-400 to-green-600';
      case 'excited':
        return 'from-yellow-400 to-orange-500';
      case 'stressed':
        return 'from-red-400 to-red-600';
      case 'sad':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getStressColor = (level: number) => {
    if (level >= 7) return 'text-red-600';
    if (level >= 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{childName}</h3>
          <p className="text-sm text-gray-500">Age {childAge} • AI Guardian Active</p>
        </div>
        {detectedThreat && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 px-2 py-1 bg-red-100 rounded-full"
          >
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Alert</span>
          </motion.div>
        )}
      </div>

      {/* Central AI Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Avatar with Emotional Glow */}
          <motion.div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${getEmotionColor()} p-1 shadow-lg`}
            animate={{
              scale: biometrics.emotionalState === 'excited' ? [1, 1.05, 1] : 1,
              boxShadow: biometrics.emotionalState === 'stressed' 
                ? ['0 0 0 rgba(239, 68, 68, 0)', '0 0 20px rgba(239, 68, 68, 0.5)', '0 0 0 rgba(239, 68, 68, 0)']
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} alt={childName} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl">
                  {childName === 'Emma' ? '👧' : childName === 'Alex' ? '👦' : '🧒'}
                </div>
              )}
            </div>
          </motion.div>

          {/* Emotion Indicator */}
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
            animate={{ rotate: isListening ? [0, 10, -10, 0] : 0 }}
            transition={{ duration: 0.5 }}
          >
            {getEmotionIcon()}
          </motion.div>

          {/* Voice Monitoring Indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
              >
                🎤 Listening
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Information Bubbles */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Social Media Time */}
        <motion.div 
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Instagram className="h-4 w-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-200">Social Media</span>
          </div>
          <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {Math.floor(activityData.socialMediaTime)}m
          </div>
          <div className="text-xs text-purple-600">today</div>
        </motion.div>

        {/* WhatsApp Time */}
        <motion.div 
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-800 dark:text-green-200">WhatsApp</span>
          </div>
          <div className="text-lg font-bold text-green-900 dark:text-green-100">
            {Math.floor(activityData.whatsappTime)}m
          </div>
          <div className="text-xs text-green-600">today</div>
        </motion.div>

        {/* Daily Steps */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Footprints className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Steps</span>
          </div>
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {activityData.stepsToday.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600">today</div>
        </motion.div>

        {/* Location */}
        <motion.div 
          className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-800 dark:text-orange-200">Location</span>
          </div>
          <div className="text-sm font-bold text-orange-900 dark:text-orange-100 truncate">
            {activityData.currentLocation}
          </div>
          <div className="text-xs text-orange-600">safe zone</div>
        </motion.div>
      </div>

      {/* Biometric Data */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Activity className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Biometric Data</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Heart Rate:</span>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 text-red-500" />
              <span className="font-medium">{biometrics.heartRate} BPM</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Stress Level:</span>
            <span className={`font-medium ${getStressColor(biometrics.stressLevel)}`}>
              {biometrics.stressLevel}/10
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Social Score:</span>
            <span className="font-medium text-blue-600">
              {Math.floor(biometrics.socialInteraction)}/10
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Voice Pattern:</span>
            <span className={`font-medium ${biometrics.voicePattern === 'distressed' ? 'text-red-600' : 'text-green-600'}`}>
              {biometrics.voicePattern}
            </span>
          </div>
        </div>
      </div>

      {/* Threat Detection Alert */}
      <AnimatePresence>
        {detectedThreat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-200">AI Threat Detection</span>
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mb-2">{detectedThreat}</p>
            <div className="text-xs text-red-600">
              Analyzing conversation patterns and contact identification...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battery & Connection Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connected</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Battery: {Math.floor(activityData.batteryLevel)}%</span>
          <Progress value={activityData.batteryLevel} className="w-8 h-1" />
        </div>
      </div>
    </div>
  );
}