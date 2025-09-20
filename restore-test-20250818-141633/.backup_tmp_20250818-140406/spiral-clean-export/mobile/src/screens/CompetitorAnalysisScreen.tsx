import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { APIService } from '../services/APIService';

const { width } = Dimensions.get('window');

interface CompetitorData {
  name: string;
  domain: string;
  status: 'active' | 'monitoring' | 'analysis';
  lastAnalysis: string;
  threatLevel: 'low' | 'medium' | 'high';
  keyInsights: string[];
  marketShare: number;
}

export default function CompetitorAnalysisScreen() {
  const [competitors] = useState<CompetitorData[]>([
    {
      name: 'Amazon',
      domain: 'amazon.com',
      status: 'active',
      lastAnalysis: '2 hours ago',
      threatLevel: 'high',
      keyInsights: ['1-click checkout optimization', 'Prime delivery integration', 'Personalized recommendations'],
      marketShare: 45.2
    },
    {
      name: 'Target',
      domain: 'target.com',
      status: 'monitoring',
      lastAnalysis: '6 hours ago',
      threatLevel: 'medium',
      keyInsights: ['Same-day pickup', 'Circle rewards integration', 'Mobile-first checkout'],
      marketShare: 8.7
    },
    {
      name: 'Walmart',
      domain: 'walmart.com',
      status: 'analysis',
      lastAnalysis: '1 day ago',
      threatLevel: 'high',
      keyInsights: ['Grocery pickup expansion', 'Price matching strategy', 'Walmart+ benefits'],
      marketShare: 13.1
    },
    {
      name: 'Shopify',
      domain: 'shopify.com',
      status: 'monitoring',
      lastAnalysis: '3 hours ago',
      threatLevel: 'medium',
      keyInsights: ['Merchant tools focus', 'Multiple payment options', 'Theme marketplace'],
      marketShare: 2.8
    }
  ]);
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'monitoring': return '#f59e0b';
      case 'analysis': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Competitor Intelligence</Text>
        <Text style={styles.subtitle}>Real-time market analysis</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Market Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Share Overview</Text>
          <View style={styles.marketShareContainer}>
            {competitors.map((competitor, index) => (
              <View key={index} style={styles.marketShareItem}>
                <View style={styles.marketShareHeader}>
                  <Text style={styles.competitorName}>{competitor.name}</Text>
                  <Text style={styles.marketSharePercent}>{competitor.marketShare}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${(competitor.marketShare / 50) * 100}%`,
                        backgroundColor: getThreatColor(competitor.threatLevel)
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Competitor Cards */}
        {competitors.map((competitor, index) => (
          <View key={index} style={styles.competitorCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{competitor.name}</Text>
                <View style={styles.statusBadges}>
                  <View 
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(competitor.status) }
                    ]}
                  >
                    <Text style={styles.statusText}>{competitor.status}</Text>
                  </View>
                  <View 
                    style={[
                      styles.threatBadge,
                      { backgroundColor: getThreatColor(competitor.threatLevel) }
                    ]}
                  >
                    <Text style={styles.threatText}>{competitor.threatLevel} threat</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>
                {competitor.domain} • Last analysis: {competitor.lastAnalysis}
              </Text>
            </View>

            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Key Competitive Insights</Text>
              {competitor.keyInsights.map((insight, idx) => (
                <View key={idx} style={styles.insightItem}>
                  <Icon name="trending-up" size={16} color="#2563eb" />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="analytics" size={20} color="#2563eb" />
                <Text style={styles.actionText}>View Analysis</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="refresh" size={20} color="#2563eb" />
                <Text style={styles.actionText}>Refresh Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* SPIRAL Advantages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SPIRAL Competitive Advantages</Text>
          <View style={styles.advantagesContainer}>
            <View style={styles.advantageItem}>
              <Icon name="speed" size={24} color="#10b981" />
              <Text style={styles.advantageTitle}>30-Minute Local Delivery</Text>
              <Text style={styles.advantageDescription}>
                Faster than Amazon Prime in metro areas
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Icon name="store" size={24} color="#10b981" />
              <Text style={styles.advantageTitle}>Mall Integration</Text>
              <Text style={styles.advantageDescription}>
                Unique pickup points at shopping centers
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Icon name="group" size={24} color="#10b981" />
              <Text style={styles.advantageTitle}>Local Community Focus</Text>
              <Text style={styles.advantageDescription}>
                Supporting neighborhood businesses
              </Text>
            </View>
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
  marketShareContainer: {
    gap: 12,
  },
  marketShareItem: {
    marginBottom: 8,
  },
  marketShareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  competitorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  marketSharePercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  competitorCard: {
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
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusBadges: {
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  threatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  threatText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  insightsContainer: {
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  advantagesContainer: {
    gap: 16,
  },
  advantageItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  advantageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
  advantageDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});