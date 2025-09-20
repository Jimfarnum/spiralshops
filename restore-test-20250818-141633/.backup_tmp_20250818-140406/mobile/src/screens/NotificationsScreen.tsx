import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NotificationService } from '../services/NotificationService';

interface NotificationItem {
  id: string;
  type: 'system' | 'funnel' | 'performance' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'funnel',
      title: 'Amazon Analysis Complete',
      message: 'New competitive insights available. 3 high-impact recommendations identified.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'system',
      title: 'System Health Check',
      message: 'All 11 AI agents operational. API response time: 2.1ms average.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'performance',
      title: 'Performance Alert',
      message: 'CPU usage peaked at 78% during funnel analysis cycle.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'security',
      title: 'Security Scan Complete',
      message: 'Weekly security scan completed. No vulnerabilities detected.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      priority: 'low'
    }
  ]);

  const [settings, setSettings] = useState({
    systemAlerts: true,
    funnelUpdates: true,
    performanceAlerts: true,
    securityAlerts: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return 'settings';
      case 'funnel': return 'analytics';
      case 'performance': return 'speed';
      case 'security': return 'security';
      default: return 'notifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return '#2563eb';
      case 'funnel': return '#7c3aed';
      case 'performance': return '#f59e0b';
      case 'security': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Alerts & Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Mark All Read</Text>
            </TouchableOpacity>
          )}
        </View>
        {unreadCount > 0 && (
          <Text style={styles.unreadCount}>{unreadCount} unread notifications</Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Notifications List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIcon}>
                  <Icon 
                    name={getTypeIcon(notification.type)} 
                    size={20} 
                    color={getTypeColor(notification.type)} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationTitleRow}>
                    <Text style={[
                      styles.notificationTitle,
                      !notification.read && styles.unreadTitle
                    ]}>
                      {notification.title}
                    </Text>
                    <View style={styles.notificationMeta}>
                      <View 
                        style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(notification.priority) }
                        ]}
                      />
                      <Text style={styles.timestamp}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>System Alerts</Text>
                <Text style={styles.settingDescription}>
                  Critical system health and status updates
                </Text>
              </View>
              <Switch
                value={settings.systemAlerts}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, systemAlerts: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.systemAlerts ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Funnel Analysis Updates</Text>
                <Text style={styles.settingDescription}>
                  Competitive analysis completion and insights
                </Text>
              </View>
              <Switch
                value={settings.funnelUpdates}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, funnelUpdates: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.funnelUpdates ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Performance Alerts</Text>
                <Text style={styles.settingDescription}>
                  CPU, memory, and response time warnings
                </Text>
              </View>
              <Switch
                value={settings.performanceAlerts}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, performanceAlerts: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.performanceAlerts ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Security Notifications</Text>
                <Text style={styles.settingDescription}>
                  Security scans and vulnerability alerts
                </Text>
              </View>
              <Switch
                value={settings.securityAlerts}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, securityAlerts: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.securityAlerts ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Real-time mobile notifications
                </Text>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, pushNotifications: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.pushNotifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingDescription}>
                  Weekly summary reports via email
                </Text>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, emailNotifications: value }))
                }
                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                thumbColor={settings.emailNotifications ? '#ffffff' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>

        {/* Test Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Notifications</Text>
          <View style={styles.testButtonsContainer}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={() => NotificationService.showSuccess('Test notification sent successfully')}
            >
              <Icon name="notifications" size={20} color="#2563eb" />
              <Text style={styles.testButtonText}>Test Alert</Text>
            </TouchableOpacity>
          </View>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  markAllText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  unreadCount: {
    fontSize: 14,
    color: '#ef4444',
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
  notificationCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8fafc',
    borderLeftWidth: 3,
    borderLeftColor: '#e5e7eb',
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
    borderLeftColor: '#2563eb',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
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
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  testButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  testButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});