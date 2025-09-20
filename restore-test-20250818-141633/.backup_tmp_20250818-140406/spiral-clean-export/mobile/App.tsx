import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StatusBar, StyleSheet } from 'react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import FunnelMonitorScreen from './src/screens/FunnelMonitorScreen';
import CompetitorAnalysisScreen from './src/screens/CompetitorAnalysisScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';
        
        switch (route.name) {
          case 'Dashboard':
            iconName = 'dashboard';
            break;
          case 'Funnels':
            iconName = 'analytics';
            break;
          case 'Competitors':
            iconName = 'trending-up';
            break;
          case 'Alerts':
            iconName = 'notifications';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
        }
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#6b7280',
      tabBarStyle: styles.tabBar,
      headerStyle: styles.header,
      headerTintColor: '#1f2937',
      headerTitleStyle: styles.headerTitle,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Funnels" component={FunnelMonitorScreen} />
    <Tab.Screen name="Competitors" component={CompetitorAnalysisScreen} />
    <Tab.Screen name="Alerts" component={NotificationsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    paddingBottom: 5,
    paddingTop: 5,
    height: 65,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
});