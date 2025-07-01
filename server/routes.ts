// @ts-nocheck
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { processVoiceCommand, generateSafetyRecommendations, generateChatResponse } from "./services/ai";
import { insertFamilyMemberSchema, insertActivitySchema, insertEmergencyEventSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to AGI Control System' }));
  });

  // Broadcast to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Authentication middleware (simplified for demo)
  app.use('/api', (req: any, res, next) => {
    // In a real app, implement proper JWT authentication
    req.user = { id: 1 }; // Default user for demo
    next();
  });

  // User routes
  app.get('/api/user', async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Family member routes
  app.get('/api/family-members', async (req, res) => {
    try {
      const members = await storage.getFamilyMembers(req.user.id);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch family members' });
    }
  });

  app.post('/api/family-members', async (req, res) => {
    try {
      const memberData = insertFamilyMemberSchema.parse({
        ...req.body,
        parentId: req.user.id
      });
      
      const member = await storage.createFamilyMember(memberData);
      
      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        familyMemberId: member.id,
        activityType: 'security_event',
        description: `Added new family member: ${member.name}`,
        metadata: { memberRole: member.role }
      });

      broadcast({ 
        type: 'family_member_added', 
        member,
        timestamp: new Date().toISOString()
      });

      res.json(member);
    } catch (error) {
      res.status(400).json({ error: 'Invalid family member data' });
    }
  });

  app.put('/api/family-members/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const member = await storage.updateFamilyMember(id, updates);
      if (!member) {
        return res.status(404).json({ error: 'Family member not found' });
      }

      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        familyMemberId: member.id,
        activityType: 'security_event',
        description: `Updated settings for ${member.name}`,
        metadata: { updates }
      });

      broadcast({ 
        type: 'family_member_updated', 
        member,
        timestamp: new Date().toISOString()
      });

      res.json(member);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update family member' });
    }
  });

  // Security settings routes
  app.get('/api/security-settings', async (req, res) => {
    try {
      const settings = await storage.getSecuritySettings(req.user.id);
      if (!settings) {
        return res.status(404).json({ error: 'Security settings not found' });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch security settings' });
    }
  });

  app.put('/api/security-settings', async (req, res) => {
    try {
      const updates = req.body;
      const settings = await storage.updateSecuritySettings(req.user.id, updates);
      
      if (!settings) {
        return res.status(404).json({ error: 'Security settings not found' });
      }

      // Log activity
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'security_event',
        description: 'Updated security settings',
        metadata: { changes: Object.keys(updates) }
      });

      broadcast({ 
        type: 'security_settings_updated', 
        settings,
        timestamp: new Date().toISOString()
      });

      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update security settings' });
    }
  });

  // Device routes
  app.get('/api/devices', async (req, res) => {
    try {
      const devices = await storage.getDevices(req.user.id);
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch devices' });
    }
  });

  // Enhanced Emergency routes
  app.post('/api/emergency/lock-all', async (req, res) => {
    try {
      const event = await storage.createEmergencyEvent({
        userId: req.user.id,
        eventType: 'emergency_lock',
        description: 'Emergency protocol activated - All devices locked, monitoring enabled',
        resolved: false
      });

      // Log comprehensive activity
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'emergency',
        description: 'Emergency protocol activated: Device lockdown, GPS tracking, live monitoring enabled',
        metadata: { 
          eventId: event.id,
          activatedBy: 'Parent',
          features: ['device_lock', 'gps_tracking', 'live_monitoring', 'emergency_contacts']
        }
      });

      // Broadcast enhanced emergency alert
      broadcast({ 
        type: 'emergency_activated',
        data: {
          eventId: event.id,
          activatedBy: 'Parent',
          activatedAt: new Date().toISOString(),
          reason: 'Manual activation',
          features: {
            deviceLock: true,
            gpsTracking: true,
            liveMonitoring: true,
            emergencyContacts: true
          }
        }
      });

      res.json({ 
        success: true, 
        message: 'Emergency protocol activated - All devices secured, monitoring enabled',
        eventId: event.id,
        activatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to activate emergency protocol' });
    }
  });

  // Parent override endpoint
  app.post('/api/emergency/unlock-all', async (req, res) => {
    try {
      // Update any active emergency events
      const activeEmergencies = await storage.getEmergencyEvents(req.user.id);
      const activeEvent = activeEmergencies.find(event => !event.resolved);
      
      if (activeEvent) {
        await storage.updateEmergencyEvent(activeEvent.id, { resolved: true });
      }

      // Log the override action
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'emergency',
        description: 'Parent override: Emergency protocols disabled, devices unlocked',
        metadata: { 
          action: 'parent_override',
          previousEventId: activeEvent?.id 
        }
      });

      // Broadcast unlock to all devices
      broadcast({
        type: 'emergency_deactivated',
        data: {
          deactivatedBy: 'Parent',
          deactivatedAt: new Date().toISOString(),
          reason: 'Parent override'
        }
      });

      res.json({ 
        success: true, 
        message: 'Emergency protocols disabled - All devices unlocked',
        deactivatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to disable emergency protocols' });
    }
  });

  // Smart device biometric monitoring endpoint
  app.post('/api/emergency/biometric-alert', async (req, res) => {
    try {
      const { deviceId, alertType, value, threshold, memberId } = req.body;

      // Create emergency event for biometric alert
      const event = await storage.createEmergencyEvent({
        userId: req.user.id,
        eventType: 'biometric_alert',
        description: `${alertType} alert: ${value} (threshold: ${threshold}) detected`,
        resolved: false
      });

      // Log the biometric alert
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'biometric_alert',
        description: `Automatic ${alertType} alert detected`,
        metadata: {
          deviceId,
          alertType,
          value,
          threshold,
          memberId,
          eventId: event.id
        }
      });

      // Broadcast biometric alert
      broadcast({
        type: 'biometric_alert',
        data: {
          eventId: event.id,
          deviceId,
          alertType,
          value,
          threshold,
          memberId,
          timestamp: new Date().toISOString()
        }
      });

      res.json({ 
        success: true, 
        message: `${alertType} alert processed`,
        eventId: event.id
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process biometric alert' });
    }
  });

  // Voice distress detection endpoint
  app.post('/api/emergency/voice-alert', async (req, res) => {
    try {
      const { deviceId, transcript, confidence, keywords, memberId } = req.body;

      // Create emergency event for voice alert
      const event = await storage.createEmergencyEvent({
        userId: req.user.id,
        eventType: 'voice_distress',
        description: `Voice distress detected: "${transcript}" (confidence: ${confidence}%)`,
        resolved: false
      });

      // Log the voice alert
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'voice_alert',
        description: `AI detected distress keywords in voice pattern`,
        metadata: {
          deviceId,
          transcript,
          confidence,
          keywords,
          memberId,
          eventId: event.id
        }
      });

      // Broadcast voice alert
      broadcast({
        type: 'voice_distress_alert',
        data: {
          eventId: event.id,
          deviceId,
          transcript,
          confidence,
          keywords,
          memberId,
          timestamp: new Date().toISOString()
        }
      });

      res.json({ 
        success: true, 
        message: 'Voice distress alert processed',
        eventId: event.id
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process voice alert' });
    }
  });

  // Get active emergency events
  app.get('/api/emergency/active', async (req, res) => {
    try {
      const emergencies = await storage.getEmergencyEvents(req.user.id);
      const activeEmergencies = emergencies.filter(event => !event.resolved);
      
      res.json(activeEmergencies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get active emergencies' });
    }
  });

  app.get('/api/emergency-events', async (req, res) => {
    try {
      const events = await storage.getEmergencyEvents(req.user.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch emergency events' });
    }
  });

  // Activity routes
  app.get('/api/activities', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getActivities(req.user.id, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // AI Assistant routes
  app.post('/api/ai/voice-command', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Voice command text is required' });
      }

      const command = await processVoiceCommand(text);
      
      // Log the voice command
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'security_event',
        description: `Voice command: "${text}"`,
        metadata: { 
          command: command.action,
          target: command.target,
          confidence: command.confidence
        }
      });

      broadcast({ 
        type: 'voice_command_processed', 
        command,
        originalText: text,
        timestamp: new Date().toISOString()
      });

      res.json(command);
    } catch (error) {
      res.status(500).json({ error: 'Failed to process voice command' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await generateChatResponse(message);
      res.json({ response });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  app.get('/api/ai/recommendations', async (req, res) => {
    try {
      const members = await storage.getFamilyMembers(req.user.id);
      const devices = await storage.getDevices(req.user.id);
      const activities = await storage.getActivities(req.user.id, 20);

      const recommendations = await generateSafetyRecommendations({
        members,
        devices,
        activities
      });

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  return httpServer;
}
