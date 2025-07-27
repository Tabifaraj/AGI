import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';

interface DevicePermissions {
  location: boolean;
  camera: boolean;
  microphone: boolean;
  contacts: boolean;
  storage: boolean;
  notifications: boolean;
}

interface DeviceStatus {
  deviceId: string;
  deviceName: string;
  isLocked: boolean;
  batteryLevel: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export default function App() {
  const [permissions, setPermissions] = useState<DevicePermissions>({
    location: false,
    camera: false,
    microphone: false,
    contacts: false,
    storage: false,
    notifications: false,
  });
  
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    deviceId: 'device_12345',
    deviceName: 'Emma\'s Phone',
    isLocked: false,
    batteryLevel: 78,
  });
  
  const [isParentMode, setIsParentMode] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    initializeApp();
    simulateBackgroundTasks();
  }, []);

  const initializeApp = async () => {
    // Simulate device initialization
    console.log('Initializing AGI Family Guardian mobile app...');
    
    // Simulate checking existing permissions
    setTimeout(() => {
      setPermissions({
        location: true,
        camera: false,
        microphone: true,
        contacts: true,
        storage: true,
        notifications: true,
      });
    }, 1000);
  };

  const simulateBackgroundTasks = () => {
    // Simulate location updates every 30 seconds
    setInterval(() => {
      if (permissions.location) {
        const mockLocation = {
          latitude: 40.7589 + (Math.random() - 0.5) * 0.01,
          longitude: -73.9851 + (Math.random() - 0.5) * 0.01,
          accuracy: Math.random() * 10 + 5,
        };
        
        setDeviceStatus(prev => ({
          ...prev,
          location: mockLocation,
        }));

        sendLocationUpdate(mockLocation);
      }
    }, 30000);

    // Simulate battery level changes
    setInterval(() => {
      setDeviceStatus(prev => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - Math.random() * 2),
      }));
    }, 60000);
  };

  const sendLocationUpdate = async (location: any) => {
    try {
      const response = await fetch('/api/device-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId: deviceStatus.deviceId,
          location,
          timestamp: new Date().toISOString(),
        }),
      });
      
      setIsConnected(response.ok);
    } catch (error) {
      console.error('Failed to send location update:', error);
      setIsConnected(false);
    }
  };

  const requestPermission = async (permissionType: keyof DevicePermissions) => {
    // Simulate permission request
    Alert.alert(
      'Permission Request',
      `AGI Family Guardian needs ${permissionType} permission for safety monitoring.`,
      [
        {
          text: 'Deny',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            setPermissions(prev => ({
              ...prev,
              [permissionType]: true,
            }));
            
            if (permissionType === 'location') {
              startLocationTracking();
            }
          },
        },
      ]
    );
  };

  const startLocationTracking = () => {
    // Simulate getting current location
    const mockLocation = {
      latitude: 40.7589,
      longitude: -73.9851,
      accuracy: 5,
    };
    
    setDeviceStatus(prev => ({
      ...prev,
      location: mockLocation,
    }));

    sendLocationUpdate(mockLocation);
    
    Alert.alert(
      'Location Sharing',
      'Your location is now being shared with your family for safety.',
      [{ text: 'OK' }]
    );
  };

  const handleRemoteCommand = (command: any) => {
    switch (command.type) {
      case 'lock_device':
        lockDevice();
        break;
      case 'unlock_device':
        unlockDevice();
        break;
      case 'request_location':
        startLocationTracking();
        break;
      case 'disable_camera':
        disablePermission('camera');
        break;
      case 'emergency_mode':
        enableEmergencyMode();
        break;
      default:
        console.log('Unknown command:', command);
    }
  };

  const lockDevice = async () => {
    setDeviceStatus(prev => ({ ...prev, isLocked: true }));
    
    Alert.alert(
      'Device Locked',
      'This device has been locked by your parent/guardian for your safety.',
      [{ text: 'OK' }]
    );
  };

  const unlockDevice = async () => {
    setDeviceStatus(prev => ({ ...prev, isLocked: false }));
    
    Alert.alert(
      'Device Unlocked',
      'Device has been unlocked by parent override.',
      [{ text: 'OK' }]
    );
  };

  const disablePermission = (permissionType: keyof DevicePermissions) => {
    setPermissions(prev => ({
      ...prev,
      [permissionType]: false,
    }));
    
    Alert.alert(
      'Permission Changed',
      `${permissionType} access has been restricted by your parent.`,
      [{ text: 'OK' }]
    );
  };

  const enableEmergencyMode = () => {
    Alert.alert(
      'Emergency Mode Activated',
      'Emergency contacts have been notified. All safety systems are active.',
      [{ text: 'OK' }]
    );
    
    // Force enable critical permissions in emergency
    setPermissions(prev => ({
      ...prev,
      location: true,
      notifications: true,
    }));
    
    startLocationTracking();
  };

  const toggleParentMode = () => {
    const newParentMode = !isParentMode;
    setIsParentMode(newParentMode);
    
    if (newParentMode) {
      Alert.alert(
        'Parent Mode Enabled',
        'You now have override access to safety controls.',
        [{ text: 'OK' }]
      );
    }
  };

  const simulateRemoteControl = (action: string) => {
    switch (action) {
      case 'lock':
        handleRemoteCommand({ type: 'lock_device' });
        break;
      case 'unlock':
        handleRemoteCommand({ type: 'unlock_device' });
        break;
      case 'locate':
        handleRemoteCommand({ type: 'request_location' });
        break;
      case 'emergency':
        handleRemoteCommand({ type: 'emergency_mode' });
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AGI Family Guardian</Text>
        <Text style={styles.subtitle}>Mobile Protection</Text>
        <View style={styles.statusRow}>
          <Text style={[styles.status, isConnected ? styles.connected : styles.disconnected]}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
          <Text style={styles.deviceName}>{deviceStatus.deviceName}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Status</Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>
            Device ID: {deviceStatus.deviceId}
          </Text>
          <Text style={styles.statusText}>
            Battery: {Math.round(deviceStatus.batteryLevel)}%
          </Text>
          <Text style={[styles.statusText, deviceStatus.isLocked ? styles.locked : styles.unlocked]}>
            Status: {deviceStatus.isLocked ? '🔒 Locked' : '🔓 Unlocked'}
          </Text>
          {deviceStatus.location && (
            <Text style={styles.statusText}>
              Location: {deviceStatus.location.latitude.toFixed(4)}, {deviceStatus.location.longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Native Permissions</Text>
        <View style={styles.permissionsGrid}>
          {Object.entries(permissions).map(([key, value]) => (
            <View key={key} style={styles.permissionItem}>
              <Text style={styles.permissionLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <TouchableOpacity
                style={[styles.permissionButton, value ? styles.granted : styles.denied]}
                onPress={() => !value && requestPermission(key as keyof DevicePermissions)}
              >
                <Text style={styles.permissionButtonText}>
                  {value ? '✓ Granted' : 'Request'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features</Text>
        <TouchableOpacity style={styles.featureButton} onPress={startLocationTracking}>
          <Text style={styles.featureButtonText}>📍 Share Location</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.featureButton} 
          onPress={() => enableEmergencyMode()}
        >
          <Text style={styles.featureButtonText}>🚨 Emergency Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureButton} onPress={() => simulateRemoteControl('locate')}>
          <Text style={styles.featureButtonText}>🔄 Send Location Update</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Guardian Controls</Text>
        <View style={styles.guardianControls}>
          <Text style={styles.permissionLabel}>Guardian Mode</Text>
          <Switch
            value={isParentMode}
            onValueChange={toggleParentMode}
          />
        </View>
        {isParentMode && (
          <View style={styles.guardianPanel}>
            <Text style={styles.guardianText}>Guardian Override Active</Text>
            <View style={styles.overrideButtons}>
              <TouchableOpacity 
                style={styles.overrideButton} 
                onPress={() => simulateRemoteControl('unlock')}
              >
                <Text style={styles.overrideButtonText}>🔓 Override Unlock</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.overrideButton} 
                onPress={() => simulateRemoteControl('lock')}
              >
                <Text style={styles.overrideButtonText}>🔒 Force Lock</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Remote Control Demo</Text>
        <Text style={styles.demoText}>
          Simulate commands from parent control system:
        </Text>
        <View style={styles.demoButtons}>
          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => simulateRemoteControl('lock')}
          >
            <Text style={styles.demoButtonText}>Lock Device</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => simulateRemoteControl('unlock')}
          >
            <Text style={styles.demoButtonText}>Unlock Device</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => simulateRemoteControl('emergency')}
          >
            <Text style={styles.demoButtonText}>Emergency Mode</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real-time Monitoring</Text>
        <View style={styles.monitoringCard}>
          <Text style={styles.monitoringText}>
            ♥ Heart Rate: {permissions.notifications ? 'Monitoring active' : 'Permission needed'}
          </Text>
          <Text style={styles.monitoringText}>
            🎤 Voice Stress: {permissions.microphone ? 'Analyzing patterns' : 'Microphone access required'}
          </Text>
          <Text style={styles.monitoringText}>
            👥 Social Interaction: {permissions.contacts ? 'Tracking enabled' : 'Contacts access needed'}
          </Text>
          <Text style={styles.monitoringText}>
            📱 App Usage: Background monitoring active
          </Text>
          <Text style={styles.monitoringText}>
            📍 Location: {permissions.location ? 'GPS tracking enabled' : 'Location permission required'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  connected: {
    color: '#10b981',
  },
  disconnected: {
    color: '#ef4444',
  },
  deviceName: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  locked: {
    color: '#ef4444',
    fontWeight: '600',
  },
  unlocked: {
    color: '#10b981',
    fontWeight: '600',
  },
  permissionsGrid: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  granted: {
    backgroundColor: '#dcfce7',
  },
  denied: {
    backgroundColor: '#fee2e2',
  },
  permissionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  parentControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  parentPanel: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  parentText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    marginBottom: 8,
  },
  overrideButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overrideButton: {
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
  },
  overrideButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  demoButton: {
    backgroundColor: '#7c3aed',
    padding: 12,
    borderRadius: 6,
    flex: 0.32,
    marginBottom: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  monitoringCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  monitoringText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
});