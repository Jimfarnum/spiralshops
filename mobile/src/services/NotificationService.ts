import PushNotification from 'react-native-push-notification';
import { Alert } from 'react-native';

class NotificationServiceClass {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('FCM Token:', token);
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        
        if (notification.userInteraction) {
          // User tapped notification
          this.handleNotificationTap(notification);
        }
      },

      onAction: (notification) => {
        console.log('Notification action:', notification.action);
      },

      onRegistrationError: (err) => {
        console.error('Notification registration error:', err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create notification channels for Android
    PushNotification.createChannel(
      {
        channelId: 'spiral-alerts',
        channelName: 'SPIRAL Alerts',
        channelDescription: 'Important SPIRAL system alerts',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      () => {}
    );

    PushNotification.createChannel(
      {
        channelId: 'funnel-updates',
        channelName: 'Funnel Analysis',
        channelDescription: 'Competitive funnel analysis updates',
        playSound: false,
        importance: 3,
        vibrate: false,
      },
      () => {}
    );
  }

  // Show local notifications
  showAlert(title: string, message: string, priority: 'high' | 'normal' = 'normal') {
    PushNotification.localNotification({
      channelId: priority === 'high' ? 'spiral-alerts' : 'funnel-updates',
      title,
      message,
      playSound: priority === 'high',
      vibrate: priority === 'high',
      priority: priority === 'high' ? 'high' : 'normal',
      importance: priority === 'high' ? 'high' : 'normal',
    });
  }

  // System health alerts
  showSystemAlert(status: string, details: string) {
    const title = status === 'healthy' 
      ? 'SPIRAL System Healthy' 
      : 'SPIRAL System Alert';
    
    this.showAlert(title, details, status === 'healthy' ? 'normal' : 'high');
  }

  // Funnel analysis notifications
  showFunnelComplete(competitorCount: number) {
    this.showAlert(
      'Funnel Analysis Complete',
      `Analysis completed for ${competitorCount} competitors. New insights available.`,
      'normal'
    );
  }

  showFunnelAlert(competitor: string, insight: string) {
    this.showAlert(
      `${competitor} Alert`,
      insight,
      'high'
    );
  }

  // Performance alerts
  showPerformanceAlert(metric: string, value: string) {
    this.showAlert(
      'Performance Alert',
      `${metric}: ${value}`,
      'high'
    );
  }

  // User-friendly toast messages
  showSuccess(message: string) {
    Alert.alert('Success', message, [{ text: 'OK' }]);
  }

  showError(message: string) {
    Alert.alert('Error', message, [{ text: 'OK' }]);
  }

  showInfo(message: string) {
    Alert.alert('Info', message, [{ text: 'OK' }]);
  }

  // Handle notification taps
  private handleNotificationTap(notification: any) {
    const { data } = notification;
    
    if (data?.screen) {
      // Navigate to specific screen
      // This would integrate with your navigation system
      console.log('Navigate to:', data.screen);
    }
  }

  // Schedule recurring notifications
  scheduleSystemCheck() {
    PushNotification.localNotificationSchedule({
      channelId: 'spiral-alerts',
      title: 'SPIRAL System Check',
      message: 'Running automated system health check...',
      date: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      repeatType: 'time',
      repeatTime: 30 * 60 * 1000, // Every 30 minutes
    });
  }

  // Cancel all notifications
  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Get notification permissions status
  checkPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions(resolve);
    });
  }

  // Request notification permissions
  requestPermissions(): Promise<any> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then(resolve);
    });
  }
}

export const NotificationService = new NotificationServiceClass();