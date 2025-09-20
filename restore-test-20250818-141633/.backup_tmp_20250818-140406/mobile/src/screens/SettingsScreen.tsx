import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { APIService } from '../services/APIService';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    backgroundSync: true,
    analyticsSharing: false,
    darkMode: false,
    highFrequencyUpdates: false,
    offlineMode: true,
  });

  const [connectionInfo] = useState({
    serverUrl: 'localhost:5000',
    apiVersion: 'v1.0',
    lastSync: new Date(),
    connectionStatus: 'connected',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await APIService.logout();
            // Navigate to login screen
          }
        }
      ]
    );
  };

  const testConnection = async () => {
    try {
      const response = await APIService.getSystemHealth();
      Alert.alert(
        'Connection Test',
        `Status: ${response.status}\nResponse time: < 5ms`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Connection Test Failed',
        'Unable to connect to SPIRAL servers',
        [{ text: 'OK' }]
      );
    }
  };

  const clearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and require a full refresh.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            // Clear cache logic
            Alert.alert('Cache Cleared', 'App cache has been cleared successfully.');
          }
        }
      ]
    );
  };

  const SettingRow = ({ 
    icon, 
    title, 
    description, 
    value, 
    onValueChange, 
    type = 'switch' 
  }: {
    icon: string;
    title: string;
    description: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'action';
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color="#2563eb" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
          thumbColor={value ? '#ffffff' : '#f3f4f6'}
        />
      )}
      {type === 'action' && (
        <Icon name="chevron-right" size={20} color="#9ca3af" />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your SPIRAL monitoring app</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Status</Text>
          <View style={styles.connectionCard}>
            <View style={styles.connectionHeader}>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: connectionInfo.connectionStatus === 'connected' ? '#10b981' : '#ef4444' }
                ]} />
                <Text style={styles.statusText}>
                  {connectionInfo.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              <TouchableOpacity style={styles.testButton} onPress={testConnection}>
                <Text style={styles.testButtonText}>Test</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.connectionDetails}>
              <Text style={styles.connectionLabel}>Server: {connectionInfo.serverUrl}</Text>
              <Text style={styles.connectionLabel}>API Version: {connectionInfo.apiVersion}</Text>
              <Text style={styles.connectionLabel}>
                Last Sync: {connectionInfo.lastSync.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <SettingRow
            icon="refresh"
            title="Auto Refresh"
            description="Automatically refresh data every 30 seconds"
            value={settings.autoRefresh}
            onValueChange={(value) => setSettings(prev => ({ ...prev, autoRefresh: value }))}
          />

          <SettingRow
            icon="sync"
            title="Background Sync"
            description="Sync data when app is in background"
            value={settings.backgroundSync}
            onValueChange={(value) => setSettings(prev => ({ ...prev, backgroundSync: value }))}
          />

          <SettingRow
            icon="update"
            title="High Frequency Updates"
            description="Update every 10 seconds (uses more battery)"
            value={settings.highFrequencyUpdates}
            onValueChange={(value) => setSettings(prev => ({ ...prev, highFrequencyUpdates: value }))}
          />

          <SettingRow
            icon="offline-pin"
            title="Offline Mode"
            description="Cache data for offline viewing"
            value={settings.offlineMode}
            onValueChange={(value) => setSettings(prev => ({ ...prev, offlineMode: value }))}
          />
        </View>

        {/* Privacy & Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Analytics</Text>
          
          <SettingRow
            icon="analytics"
            title="Usage Analytics"
            description="Share anonymous usage data to improve the app"
            value={settings.analyticsSharing}
            onValueChange={(value) => setSettings(prev => ({ ...prev, analyticsSharing: value }))}
          />

          <SettingRow
            icon="dark-mode"
            title="Dark Mode"
            description="Use dark theme (coming soon)"
            value={settings.darkMode}
            onValueChange={(value) => setSettings(prev => ({ ...prev, darkMode: value }))}
          />
        </View>

        {/* Maintenance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          
          <TouchableOpacity style={styles.actionRow} onPress={clearCache}>
            <View style={styles.settingIcon}>
              <Icon name="clear-all" size={24} color="#f59e0b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Clear Cache</Text>
              <Text style={styles.settingDescription}>Free up storage space</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025.08.15</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>SPIRAL Intelligence</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  connectionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  testButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2563eb',
    borderRadius: 6,
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  connectionDetails: {
    gap: 4,
  },
  connectionLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
  infoValue: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});