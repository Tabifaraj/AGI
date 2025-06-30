import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceIndicatorProps {
  onClick: () => void;
  isActive?: boolean;
}

export default function VoiceIndicator({ onClick, isActive = true }: VoiceIndicatorProps) {
  return (
    <Button
      className="voice-indicator"
      onClick={onClick}
      size="lg"
    >
      <Mic className="h-5 w-5" />
      {isActive && <div className="absolute -top-1 -right-1 w-4 h-4 bg-safe-green rounded-full animate-pulse" />}
    </Button>
  );
}
