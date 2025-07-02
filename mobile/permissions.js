// Native Device Permissions Handler for AGI Family Guardian
// This file handles real device permissions for location, camera, microphone, etc.

class DevicePermissionsManager {
  constructor() {
    this.permissionStatus = {
      location: 'not-requested',
      camera: 'not-requested',
      microphone: 'not-requested',
      contacts: 'not-requested',
      notifications: 'not-requested',
      storage: 'not-requested',
      biometric: 'not-requested'
    };
    
    this.locationWatcher = null;
    this.backgroundTasks = [];
  }

  // Check if we're running in a native environment or web
  isNativeEnvironment() {
    return typeof navigator !== 'undefined' && 
           navigator.product === 'ReactNative';
  }

  // Request location permission and start tracking
  async requestLocationPermission() {
    try {
      if (this.isNativeEnvironment()) {
        // Native React Native implementation
        const { check, request, PERMISSIONS, RESULTS } = require('react-native-permissions');
        
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          
        const result = await request(permission);
        
        if (result === RESULTS.GRANTED) {
          this.permissionStatus.location = 'granted';
          this.startLocationTracking();
          return true;
        } else {
          this.permissionStatus.location = 'denied';
          return false;
        }
      } else {
        // Web geolocation API fallback
        if ('geolocation' in navigator) {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                this.permissionStatus.location = 'granted';
                this.startLocationTracking();
                resolve(true);
              },
              (error) => {
                console.error('Location permission denied:', error);
                this.permissionStatus.location = 'denied';
                resolve(false);
              }
            );
          });
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  // Start continuous location tracking
  startLocationTracking() {
    if (this.isNativeEnvironment()) {
      // Native implementation with background location
      const Geolocation = require('react-native-geolocation-service');
      
      this.locationWatcher = Geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          };
          
          this.sendLocationToParentSystem(location);
          this.checkGeofences(location);
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, // Update every 10 meters
          interval: 30000,    // Update every 30 seconds
          fastestInterval: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    } else {
      // Web implementation
      if ('geolocation' in navigator) {
        this.locationWatcher = navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            };
            
            this.sendLocationToParentSystem(location);
            this.checkGeofences(location);
          },
          (error) => {
            console.error('Web location error:', error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 15000
          }
        );
      }
    }
  }

  // Request camera permission
  async requestCameraPermission() {
    try {
      if (this.isNativeEnvironment()) {
        const { check, request, PERMISSIONS, RESULTS } = require('react-native-permissions');
        
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CAMERA 
          : PERMISSIONS.ANDROID.CAMERA;
          
        const result = await request(permission);
        
        if (result === RESULTS.GRANTED) {
          this.permissionStatus.camera = 'granted';
          return true;
        } else {
          this.permissionStatus.camera = 'denied';
          return false;
        }
      } else {
        // Web camera API
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
          this.permissionStatus.camera = 'granted';
          return true;
        } catch (error) {
          this.permissionStatus.camera = 'denied';
          return false;
        }
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  // Request microphone permission
  async requestMicrophonePermission() {
    try {
      if (this.isNativeEnvironment()) {
        const { check, request, PERMISSIONS, RESULTS } = require('react-native-permissions');
        
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.MICROPHONE 
          : PERMISSIONS.ANDROID.RECORD_AUDIO;
          
        const result = await request(permission);
        
        if (result === RESULTS.GRANTED) {
          this.permissionStatus.microphone = 'granted';
          this.startVoiceStressMonitoring();
          return true;
        } else {
          this.permissionStatus.microphone = 'denied';
          return false;
        }
      } else {
        // Web microphone API
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          this.permissionStatus.microphone = 'granted';
          this.startVoiceStressMonitoring();
          return true;
        } catch (error) {
          this.permissionStatus.microphone = 'denied';
          return false;
        }
      }
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  // Start voice stress monitoring for bullying detection
  startVoiceStressMonitoring() {
    if (this.permissionStatus.microphone !== 'granted') return;

    // This would integrate with voice analysis AI
    console.log('Voice stress monitoring started for bullying detection');
    
    // In a real implementation, this would:
    // 1. Continuously analyze voice patterns
    // 2. Detect stress indicators
    // 3. Send alerts to parent system when concerning patterns detected
  }

  // Request contacts permission
  async requestContactsPermission() {
    try {
      if (this.isNativeEnvironment()) {
        const { check, request, PERMISSIONS, RESULTS } = require('react-native-permissions');
        
        const permission = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.CONTACTS 
          : PERMISSIONS.ANDROID.READ_CONTACTS;
          
        const result = await request(permission);
        
        if (result === RESULTS.GRANTED) {
          this.permissionStatus.contacts = 'granted';
          this.analyzeContactPatterns();
          return true;
        } else {
          this.permissionStatus.contacts = 'denied';
          return false;
        }
      } else {
        // Contacts API not available in web, simulate for demo
        this.permissionStatus.contacts = 'granted';
        this.analyzeContactPatterns();
        return true;
      }
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  }

  // Analyze contact patterns for social interaction monitoring
  analyzeContactPatterns() {
    if (this.permissionStatus.contacts !== 'granted') return;

    console.log('Contact pattern analysis started for social monitoring');
    
    // In a real implementation, this would:
    // 1. Monitor communication patterns
    // 2. Detect isolation or concerning contact changes
    // 3. Alert parents to potential bullying situations
  }

  // Send location update to parent control system
  async sendLocationToParentSystem(location) {
    try {
      const response = await fetch('/api/device-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: await this.getDeviceId(),
          location,
          timestamp: location.timestamp,
          permissions: this.permissionStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send location update');
      }

      console.log('Location sent to parent system');
    } catch (error) {
      console.error('Failed to send location update:', error);
    }
  }

  // Check if device is in safe/danger zones
  checkGeofences(location) {
    // This would check against defined safe/danger zones
    // and trigger alerts if entering dangerous areas
    
    const mockSafeZones = [
      { name: 'Home', lat: 40.7589, lng: -73.9851, radius: 200, type: 'safe' },
      { name: 'School', lat: 40.7614, lng: -73.9776, radius: 150, type: 'safe' }
    ];

    const mockDangerZones = [
      { name: 'Construction Site', lat: 40.7648, lng: -73.9808, radius: 300, type: 'danger' }
    ];

    // Calculate distance and check zone entry/exit
    // Send alerts to parent system if needed
  }

  // Get unique device identifier
  async getDeviceId() {
    if (this.isNativeEnvironment()) {
      const DeviceInfo = require('react-native-device-info');
      return await DeviceInfo.getUniqueId();
    } else {
      // Web fallback - use stored identifier or generate one
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = 'web_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
  }

  // Handle remote control commands from parent system
  handleRemoteCommand(command) {
    switch (command.type) {
      case 'lock_device':
        this.lockDevice();
        break;
      case 'unlock_device':
        this.unlockDevice();
        break;
      case 'request_location':
        this.startLocationTracking();
        break;
      case 'disable_camera':
        this.disableCameraAccess();
        break;
      case 'emergency_mode':
        this.enableEmergencyMode();
        break;
      case 'school_mode':
        this.enableSchoolMode(command.settings);
        break;
      default:
        console.log('Unknown remote command:', command);
    }
  }

  // Lock device functionality
  lockDevice() {
    console.log('Device locked by parent control');
    
    if (this.isNativeEnvironment()) {
      // Native device lock implementation
      // This would require device admin permissions
      const DeviceInfo = require('react-native-device-info');
      // Implement actual device locking
    } else {
      // Web implementation - show lock screen overlay
      this.showLockScreen();
    }
    
    this.sendStatusUpdate({ locked: true });
  }

  // Unlock device functionality
  unlockDevice() {
    console.log('Device unlocked by parent override');
    
    if (this.isNativeEnvironment()) {
      // Native unlock implementation
    } else {
      // Web implementation - hide lock screen
      this.hideLockScreen();
    }
    
    this.sendStatusUpdate({ locked: false });
  }

  // Enable emergency mode
  enableEmergencyMode() {
    console.log('Emergency mode activated');
    
    // Force enable critical permissions
    this.requestLocationPermission();
    
    // Send emergency alert to parent system
    this.sendEmergencyAlert();
    
    // Enable all safety features
    this.startLocationTracking();
    this.startVoiceStressMonitoring();
  }

  // Enable school mode with time-based restrictions
  enableSchoolMode(settings) {
    console.log('School mode enabled with settings:', settings);
    
    // Implement app blocking based on time
    // Block social media during school hours
    // Allow educational apps
    
    this.sendStatusUpdate({ schoolMode: true, settings });
  }

  // Send status update to parent system
  async sendStatusUpdate(status) {
    try {
      const response = await fetch('/api/device-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: await this.getDeviceId(),
          status,
          timestamp: new Date().toISOString(),
          permissions: this.permissionStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send status update');
      }
    } catch (error) {
      console.error('Failed to send status update:', error);
    }
  }

  // Send emergency alert
  async sendEmergencyAlert() {
    try {
      const location = await this.getCurrentLocation();
      
      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: await this.getDeviceId(),
          alertType: 'emergency_activated',
          location,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emergency alert');
      }
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }
  }

  // Get current location
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (this.isNativeEnvironment()) {
        const Geolocation = require('react-native-geolocation-service');
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            });
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            (error) => reject(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      }
    });
  }

  // Web lock screen implementation
  showLockScreen() {
    const lockScreen = document.createElement('div');
    lockScreen.id = 'device-lock-screen';
    lockScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    lockScreen.innerHTML = `
      <div style="text-align: center;">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🔒</h1>
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Device Locked</h2>
        <p style="font-size: 1rem; opacity: 0.8;">This device has been locked by your parent/guardian for your safety.</p>
        <p style="font-size: 0.9rem; opacity: 0.6; margin-top: 2rem;">Contact your parent for assistance</p>
      </div>
    `;
    
    document.body.appendChild(lockScreen);
  }

  // Hide web lock screen
  hideLockScreen() {
    const lockScreen = document.getElementById('device-lock-screen');
    if (lockScreen) {
      lockScreen.remove();
    }
  }

  // Initialize all permissions and background tasks
  async initialize() {
    console.log('Initializing AGI Family Guardian device permissions...');
    
    // Start with basic device info
    const deviceId = await this.getDeviceId();
    console.log('Device ID:', deviceId);
    
    // Set up background location tracking if permission granted
    if (this.permissionStatus.location === 'granted') {
      this.startLocationTracking();
    }
    
    // Set up voice monitoring if permission granted
    if (this.permissionStatus.microphone === 'granted') {
      this.startVoiceStressMonitoring();
    }
    
    // Connect to parent control system
    this.connectToParentSystem();
  }

  // Connect to parent control system via WebSocket
  connectToParentSystem() {
    if (typeof WebSocket !== 'undefined') {
      const ws = new WebSocket('ws://localhost:5000/ws');
      
      ws.onopen = () => {
        console.log('Connected to parent control system');
        
        // Register device
        ws.send(JSON.stringify({
          type: 'device_registration',
          deviceId: this.getDeviceId(),
          permissions: this.permissionStatus
        }));
      };
      
      ws.onmessage = (event) => {
        const command = JSON.parse(event.data);
        this.handleRemoteCommand(command);
      };
      
      ws.onclose = () => {
        console.log('Disconnected from parent control system');
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.connectToParentSystem(), 5000);
      };
    }
  }
}

// Export for use in React Native app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DevicePermissionsManager;
}

// Export for web usage
if (typeof window !== 'undefined') {
  window.DevicePermissionsManager = DevicePermissionsManager;
}