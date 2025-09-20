# SPIRAL Intelligence Mobile App

A comprehensive Android mobile app for monitoring and managing the SPIRAL competitive intelligence platform. Built with React Native for real-time access to funnel analyses, system health, and competitive insights.

## Features

### 📊 Dashboard & Monitoring
- **Real-time System Health**: Monitor all 11 AI agents (7 SOAP G + 4 AI Ops)
- **Performance Metrics**: CPU usage, API response times, active stores count
- **Live Updates**: 30-second auto-refresh with manual refresh capability
- **Quick Actions**: Instant system refresh and funnel analysis triggers

### 🔍 Competitive Funnel Intelligence
- **Automated Analysis**: Monitor Amazon, Target, Walmart, Shopify funnels
- **AI-Powered Insights**: GPT-4 optimization recommendations
- **Screenshot Capture**: Visual funnel flow documentation
- **Decision Tracking**: INITIATE/WATCH/DISCARD recommendation system
- **Manual Triggers**: Run analysis on-demand from mobile

### 📈 Competitor Analysis
- **Market Share Visualization**: Real-time competitive positioning
- **Threat Level Assessment**: High/Medium/Low competitive threat indicators
- **Key Insights Tracking**: Actionable competitive intelligence
- **SPIRAL Advantages**: Unique positioning analysis

### 🔔 Smart Notifications
- **Real-time Alerts**: System health, funnel completion, performance warnings
- **Customizable Preferences**: Granular notification control
- **Push & Email**: Multiple notification channels
- **Priority Levels**: High/Medium/Low alert classification

### ⚙️ Advanced Settings
- **Connection Management**: Server configuration and testing
- **Sync Controls**: Background sync, auto-refresh, offline mode
- **Privacy Controls**: Analytics sharing preferences
- **Maintenance Tools**: Cache management and diagnostics

## Technical Architecture

### Core Technologies
- **React Native 0.73**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Navigation 6**: Advanced navigation system
- **React Native Vector Icons**: Material Design icons
- **Push Notifications**: Real-time alert system

### API Integration
- **RESTful API**: Direct connection to SPIRAL backend
- **Real-time Monitoring**: 30-second polling with smart caching
- **Offline Support**: Cached data for offline viewing
- **Authentication**: Secure token-based access

### Performance Features
- **Background Sync**: Continue monitoring when app is backgrounded
- **Smart Caching**: Efficient data storage and retrieval
- **Memory Management**: Optimized for long-running operation
- **Battery Optimization**: Configurable update frequencies

## Installation & Setup

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio
- Android SDK (API 21+)

### Quick Start
```bash
# Install dependencies
cd mobile
npm install

# Android setup
npx react-native run-android

# Start Metro bundler
npm start
```

### Configuration
1. **Server Connection**: Update `BASE_URL` in `src/services/APIService.ts`
2. **Push Notifications**: Configure Firebase Cloud Messaging
3. **Build Settings**: Update `android/app/build.gradle` for production

### Build for Production
```bash
# Debug build
cd android
./gradlew assembleDebug

# Release build (requires signing key)
./gradlew assembleRelease
```

## Usage Guide

### Initial Setup
1. **Login**: Enter SPIRAL admin credentials
2. **Permissions**: Allow notifications and location access
3. **Settings**: Configure refresh intervals and notification preferences
4. **Connection Test**: Verify server connectivity

### Daily Monitoring
1. **Dashboard Review**: Check system health and key metrics
2. **Funnel Updates**: Review latest competitive analyses
3. **Alerts Management**: Address high-priority notifications
4. **Manual Analysis**: Trigger on-demand competitive scans

### Competitive Intelligence Workflow
1. **Automated Cycles**: 14-day automatic funnel analysis
2. **Manual Triggers**: On-demand analysis for specific competitors
3. **Insight Review**: Evaluate AI-generated recommendations
4. **Action Items**: Track implementation of competitive insights

## Security & Privacy

### Data Protection
- **Encrypted Communications**: All API calls use HTTPS
- **Token Authentication**: Secure session management
- **Local Storage**: Minimal sensitive data caching
- **Privacy Controls**: Configurable analytics sharing

### Permissions
- **Internet**: API connectivity
- **Notifications**: Real-time alerts
- **Location**: Optional for geofenced features
- **Storage**: Offline data caching

## Troubleshooting

### Common Issues
- **Connection Failed**: Verify server URL and network connectivity
- **Notifications Not Working**: Check permission settings
- **Performance Issues**: Adjust refresh intervals in settings
- **Login Problems**: Verify credentials and server status

### Support
- Check server logs for API connectivity issues
- Use connection test feature in settings
- Review notification preferences for alert problems
- Clear cache for performance optimization

## Development

### Project Structure
```
mobile/
├── src/
│   ├── screens/          # Main app screens
│   ├── services/         # API and notification services
│   └── components/       # Reusable UI components
├── android/              # Android-specific configuration
└── package.json          # Dependencies and scripts
```

### Key Components
- **DashboardScreen**: System overview and metrics
- **FunnelMonitorScreen**: Competitive analysis management
- **CompetitorAnalysisScreen**: Market intelligence
- **NotificationsScreen**: Alert management
- **SettingsScreen**: App configuration

### API Service
- **APIService**: Centralized API communication
- **NotificationService**: Push notification management
- **Authentication**: Secure login and session handling

## Deployment

### Internal Distribution
- Build signed APK for internal testing
- Configure Firebase App Distribution
- Set up automated CI/CD pipeline

### Production Release
- Google Play Store submission
- App signing and security review
- Performance monitoring setup
- User feedback integration

This mobile app provides comprehensive real-time access to SPIRAL's competitive intelligence platform, enabling monitoring and management from anywhere.