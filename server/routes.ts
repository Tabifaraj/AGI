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

  // GPS Zone Management routes
  app.get('/api/zones', async (req, res) => {
    try {
      // Mock zones for demo - in real app, store in database
      const zones = [
        { id: 1, name: "Home Safe Zone", type: "safe", latitude: 40.7589, longitude: -73.9851, radius: 200, isActive: true },
        { id: 2, name: "School Safe Zone", type: "safe", latitude: 40.7614, longitude: -73.9776, radius: 150, isActive: true },
        { id: 3, name: "Construction Site", type: "danger", latitude: 40.7648, longitude: -73.9808, radius: 300, isActive: true }
      ];
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch zones' });
    }
  });

  app.post('/api/zones', async (req, res) => {
    try {
      const { name, type, latitude, longitude, radius } = req.body;
      
      // Log zone creation activity
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'zone_management',
        description: `Created ${type} zone: ${name}`,
        metadata: { name, type, latitude, longitude, radius }
      });

      // Mock response - in real app, save to database
      const newZone = {
        id: Date.now(),
        name,
        type,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius),
        isActive: true
      };

      broadcast({
        type: 'zone_created',
        data: newZone
      });

      res.json(newZone);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create zone' });
    }
  });

  app.delete('/api/zones/:id', async (req, res) => {
    try {
      const zoneId = parseInt(req.params.id);
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'zone_management',
        description: `Deleted zone ID: ${zoneId}`,
        metadata: { zoneId }
      });

      broadcast({
        type: 'zone_deleted',
        data: { zoneId }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete zone' });
    }
  });

  // School Mode routes
  app.get('/api/school-mode', async (req, res) => {
    try {
      // Mock school mode settings
      const settings = {
        schedules: [
          { id: 1, name: "School Hours", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], startTime: "08:00", endTime: "15:00", isActive: true }
        ],
        appRules: [
          { id: 1, appName: "TikTok", category: "Social", schoolHours: 'blocked', afterSchool: 'time-limited', timeLimit: 60 }
        ]
      };
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch school mode settings' });
    }
  });

  app.post('/api/school-mode/schedule', async (req, res) => {
    try {
      const { name, days, startTime, endTime } = req.body;
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'school_mode',
        description: `Created school schedule: ${name}`,
        metadata: { name, days, startTime, endTime }
      });

      broadcast({
        type: 'school_schedule_updated',
        data: { name, days, startTime, endTime }
      });

      res.json({ success: true, message: 'Schedule created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  });

  // Device Control routes
  app.post('/api/devices/:id/control', async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      const { action } = req.body;
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'device_control',
        description: `Device ${action} command sent to device ${deviceId}`,
        metadata: { deviceId, action }
      });

      broadcast({
        type: 'device_control',
        data: { deviceId, action, timestamp: new Date().toISOString() }
      });

      res.json({ success: true, message: `${action} command sent successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to control device' });
    }
  });

  app.put('/api/devices/:id/permissions', async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      const permissions = req.body;
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'device_permissions',
        description: `Updated permissions for device ${deviceId}`,
        metadata: { deviceId, permissions }
      });

      broadcast({
        type: 'device_permissions_updated',
        data: { deviceId, permissions }
      });

      res.json({ success: true, message: 'Permissions updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update permissions' });
    }
  });

  // Bullying Detection routes
  app.get('/api/bullying-detection/alerts', async (req, res) => {
    try {
      // Mock alerts - in real app, fetch from database
      const alerts = [
        {
          id: 1,
          memberId: 1,
          memberName: "Emma",
          alertType: 'high_stress',
          severity: 'high',
          description: 'Elevated heart rate and stress indicators detected during school hours',
          timestamp: new Date(Date.now() - 5 * 60000),
          resolved: false
        }
      ];
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bullying detection alerts' });
    }
  });

  app.put('/api/bullying-detection/alerts/:id/resolve', async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'bullying_detection',
        description: `Resolved bullying detection alert ${alertId}`,
        metadata: { alertId }
      });

      broadcast({
        type: 'alert_resolved',
        data: { alertId }
      });

      res.json({ success: true, message: 'Alert resolved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to resolve alert' });
    }
  });

  // Mobile Device Integration routes
  app.post('/api/device-location', async (req, res) => {
    try {
      const { deviceId, location, timestamp, permissions } = req.body;
      
      // Log location update activity
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'location_update',
        description: `Location update received from device ${deviceId}`,
        metadata: { deviceId, location, permissions }
      });

      // Check geofences and send alerts if needed
      const zones = await checkGeofences(location);
      
      broadcast({
        type: 'location_update',
        data: { deviceId, location, timestamp, zones }
      });

      res.json({ success: true, zones });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process location update' });
    }
  });

  app.post('/api/device-status', async (req, res) => {
    try {
      const { deviceId, status, timestamp, permissions } = req.body;
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'device_status',
        description: `Device status update from ${deviceId}`,
        metadata: { deviceId, status, permissions }
      });

      broadcast({
        type: 'device_status_update',
        data: { deviceId, status, timestamp }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process device status' });
    }
  });

  app.post('/api/emergency-alert', async (req, res) => {
    try {
      const { deviceId, alertType, location, timestamp } = req.body;
      
      // Create emergency event
      await storage.createEmergencyEvent({
        userId: req.user.id,
        eventType: alertType,
        description: `Emergency alert from device ${deviceId}`,
        location: location ? JSON.stringify(location) : null,
        resolved: false
      });

      await storage.createActivity({
        userId: req.user.id,
        activityType: 'emergency_alert',
        description: `Emergency alert received from device ${deviceId}`,
        metadata: { deviceId, alertType, location }
      });

      // Broadcast emergency alert to all connected clients
      broadcast({
        type: 'emergency_alert',
        data: { deviceId, alertType, location, timestamp },
        priority: 'high'
      });

      res.json({ success: true, message: 'Emergency alert processed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process emergency alert' });
    }
  });

  app.post('/api/mobile-permissions', async (req, res) => {
    try {
      const { deviceId, permissions } = req.body;
      
      await storage.createActivity({
        userId: req.user.id,
        activityType: 'permission_update',
        description: `Permission update from device ${deviceId}`,
        metadata: { deviceId, permissions }
      });

      broadcast({
        type: 'permissions_updated',
        data: { deviceId, permissions }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update permissions' });
    }
  });

  app.post('/api/voice-stress-alert', async (req, res) => {
    try {
      const { deviceId, stressLevel, voicePattern, timestamp } = req.body;
      
      // Create bullying detection alert if stress level is high
      if (stressLevel > 7) {
        await storage.createActivity({
          userId: req.user.id,
          activityType: 'bullying_detection',
          description: `High voice stress detected on device ${deviceId}`,
          metadata: { deviceId, stressLevel, voicePattern }
        });

        broadcast({
          type: 'voice_stress_alert',
          data: { deviceId, stressLevel, timestamp },
          priority: 'high'
        });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process voice stress alert' });
    }
  });

  app.get('/api/mobile-app', (req, res) => {
    // Serve mobile app for web testing
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>AGI Family Guardian Mobile</title>
          <script src="/mobile/permissions.js"></script>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; }
            .mobile-app { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div id="mobile-app" class="mobile-app">
            <iframe src="/mobile-demo" width="100%" height="800" frameborder="0"></iframe>
          </div>
          <script>
            // Initialize device permissions manager
            const permissionsManager = new DevicePermissionsManager();
            permissionsManager.initialize();
            
            // Make available globally for testing
            window.permissionsManager = permissionsManager;
          </script>
        </body>
      </html>
    `);
  });

  // Serve mobile permissions file
  app.get('/mobile/permissions.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, '../mobile/permissions.js'));
  });

  // Serve mobile demo page
  app.get('/mobile-demo', (req, res) => {
    res.redirect('/#/mobile-demo');
  });

  // Helper function to check geofences
  async function checkGeofences(location) {
    const safeZones = [
      { id: 1, name: "Home Safe Zone", type: "safe", latitude: 40.7589, longitude: -73.9851, radius: 200 },
      { id: 2, name: "School Safe Zone", type: "safe", latitude: 40.7614, longitude: -73.9776, radius: 150 }
    ];
    
    const dangerZones = [
      { id: 3, name: "Construction Site", type: "danger", latitude: 40.7648, longitude: -73.9808, radius: 300 }
    ];
    
    const enteredZones = [];
    
    [...safeZones, ...dangerZones].forEach(zone => {
      const distance = calculateDistance(
        location.latitude, location.longitude,
        zone.latitude, zone.longitude
      );
      
      if (distance <= zone.radius) {
        enteredZones.push(zone);
        
        // Send alert for danger zones
        if (zone.type === 'danger') {
          broadcast({
            type: 'danger_zone_alert',
            data: { zone, location, distance },
            priority: 'high'
          });
        }
      }
    });
    
    return enteredZones;
  }

  // Helper function to calculate distance between two points
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

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
