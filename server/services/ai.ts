import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface SecurityCommand {
  action: string;
  target?: string;
  parameters?: any;
  confidence: number;
  explanation: string;
}

export interface SafetyRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  actionRequired: boolean;
}

export async function processVoiceCommand(text: string): Promise<SecurityCommand> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for a family safety app. Parse voice commands related to device security, parental controls, and family safety. 

          Return a JSON object with:
          - action: One of [lock_device, unlock_device, set_time_restriction, block_app, allow_app, set_location_rule, emergency_mode, safe_mode, contact_restriction, network_control]
          - target: Who/what the action applies to (family member name, app name, device, etc.)
          - parameters: Additional details like time ranges, specific settings, etc.
          - confidence: 0-1 score of how confident you are in the interpretation
          - explanation: Human-readable explanation of what will happen

          Examples:
          "Lock Emma's phone" -> {"action": "lock_device", "target": "Emma", "confidence": 0.9, "explanation": "Emma's device will be locked immediately"}
          "Block YouTube after 9 PM for kids" -> {"action": "set_time_restriction", "target": "YouTube", "parameters": {"time": "21:00", "users": ["kids"]}, "confidence": 0.8, "explanation": "YouTube will be blocked after 9 PM for all children"}
          `
        },
        {
          role: "user",
          content: text
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      action: result.action || "unknown",
      target: result.target,
      parameters: result.parameters,
      confidence: Math.max(0, Math.min(1, result.confidence || 0)),
      explanation: result.explanation || "Unable to process command"
    };
  } catch (error) {
    throw new Error("Failed to process voice command: " + (error as Error).message);
  }
}

export async function generateSafetyRecommendations(
  familyData: {
    members: any[];
    devices: any[];
    activities: any[];
  }
): Promise<SafetyRecommendation[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a family safety AI expert. Analyze the provided family data and generate personalized safety recommendations. 

          Return a JSON array of recommendations with:
          - title: Brief recommendation title
          - description: Detailed explanation
          - priority: "high", "medium", or "low"
          - category: One of ["screen_time", "app_security", "location_safety", "communication", "device_management", "emergency_prep"]
          - actionRequired: boolean indicating if immediate action is needed

          Focus on practical, actionable advice for parents managing family digital safety.`
        },
        {
          role: "user",
          content: `Family data: ${JSON.stringify(familyData)}`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result.recommendations || [];
  } catch (error) {
    // Return default recommendations if AI fails
    return [
      {
        title: "Review Screen Time Limits",
        description: "Consider setting age-appropriate screen time limits for all family members",
        priority: "medium" as const,
        category: "screen_time",
        actionRequired: false
      }
    ];
  }
}

export async function generateChatResponse(message: string, context?: any): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant for a family safety app called AGI. You help parents manage their family's digital safety and security. 

          Provide clear, practical advice about:
          - Setting up parental controls
          - Managing screen time
          - Device security
          - Family communication safety
          - Emergency procedures
          - App restrictions and permissions

          Keep responses concise but helpful. Always prioritize child safety and family well-being.`
        },
        {
          role: "user",
          content: message
        },
      ],
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request.";
  } catch (error) {
    return "I'm experiencing technical difficulties. Please try again later.";
  }
}
