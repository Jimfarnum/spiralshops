import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { APIService } from '../services/APIService';
import { NotificationService } from '../services/NotificationService';

interface FunnelAnalysis {
  competitor: string;
  domain: string;
  decision: string;
  rationale: string;
  recommendations: Array<{
    title: string;
    owner_role: string;
    eta_days: number;
    impact: string;
  }>;
  funnel_map: {
    stages: Array<{
      name: string;
      evidence: string[];
    }>;
  };
  differentiation_map: {
    unique_angles_for_spiral: string[];
    usps: string[];
  };
}

export default function FunnelMonitorScreen() {
  const [analyses, setAnalyses] = useState<FunnelAnalysis[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FunnelAnalysis | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadFunnelAnalyses();
  }, []);

  const loadFunnelAnalyses = async () => {
    try {
      const data = await APIService.getFunnelAnalyses();
      setAnalyses(data.items || []);
    } catch (error) {
      console.error('Failed to load funnel analyses:', error);
      NotificationService.showError('Failed to load funnel data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFunnelAnalyses();
    setRefreshing(false);
  };

  const runFunnelAnalysis = async () => {
    Alert.alert(
      'Run Funnel Analysis',
      'This will capture and analyze competitor funnels. It may take several minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Run Analysis', 
          onPress: async () => {
            setIsRunning(true);
            try {
              await APIService.runFunnelAnalysis();
              NotificationService.showSuccess('Funnel analysis started');
              setTimeout(() => {
                loadFunnelAnalyses();
                setIsRunning(false);
              }, 30000); // Refresh after 30 seconds
            } catch (error) {
              console.error('Failed to run analysis:', error);
              NotificationService.showError('Failed to start analysis');
              setIsRunning(false);
            }
          }
        }
      ]
    );
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'INITIATE': return '#ef4444';
      case 'WATCH': return '#f59e0b';
      case 'DISCARD': return '#6b7280';
      default: return '#2563eb';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return '#ef4444';
      case 'med': case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const openAnalysisDetails = (analysis: FunnelAnalysis) => {
    setSelectedAnalysis(analysis);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Funnel Intelligence</Text>
        <TouchableOpacity 
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runFunnelAnalysis}
          disabled={isRunning}
        >
          <Icon 
            name={isRunning ? "hourglass-empty" : "play-arrow"} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.runButtonText}>
            {isRunning ? 'Running...' : 'Run Analysis'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {analyses.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="analytics" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No funnel analyses available</Text>
            <Text style={styles.emptySubtext}>Run an analysis to see competitor insights</Text>
          </View>
        ) : (
          analyses.map((analysis, index) => (
            <TouchableOpacity
              key={index}
              style={styles.analysisCard}
              onPress={() => openAnalysisDetails(analysis)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>{analysis.competitor || analysis.domain}</Text>
                  <View 
                    style={[
                      styles.decisionBadge, 
                      { backgroundColor: getDecisionColor(analysis.decision) }
                    ]}
                  >
                    <Text style={styles.decisionText}>{analysis.decision}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{analysis.domain}</Text>
              </View>

              <Text style={styles.rationale} numberOfLines={2}>
                {analysis.rationale}
              </Text>

              {analysis.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={styles.recommendationsTitle}>Top Recommendations</Text>
                  {analysis.recommendations.slice(0, 2).map((rec, idx) => (
                    <View key={idx} style={styles.recommendationItem}>
                      <Text style={styles.recommendationText} numberOfLines={1}>
                        {rec.title}
                      </Text>
                      <View style={styles.recommendationMeta}>
                        <View 
                          style={[
                            styles.impactBadge, 
                            { backgroundColor: getImpactColor(rec.impact) }
                          ]}
                        >
                          <Text style={styles.impactText}>{rec.impact}</Text>
                        </View>
                        <Text style={styles.etaText}>{rec.eta_days}d</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.cardFooter}>
                <Icon name="chevron-right" size={20} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Analysis Details Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedAnalysis?.competitor || selectedAnalysis?.domain}
            </Text>
          </View>

          {selectedAnalysis && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Decision & Rationale</Text>
                <View style={styles.decisionContainer}>
                  <View 
                    style={[
                      styles.decisionBadge, 
                      { backgroundColor: getDecisionColor(selectedAnalysis.decision) }
                    ]}
                  >
                    <Text style={styles.decisionText}>{selectedAnalysis.decision}</Text>
                  </View>
                </View>
                <Text style={styles.modalText}>{selectedAnalysis.rationale}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Funnel Stages</Text>
                {selectedAnalysis.funnel_map?.stages?.map((stage, idx) => (
                  <View key={idx} style={styles.stageItem}>
                    <Text style={styles.stageName}>{stage.name}</Text>
                    {stage.evidence.map((evidence, evidenceIdx) => (
                      <Text key={evidenceIdx} style={styles.stageEvidence}>
                        • {evidence}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>SPIRAL Opportunities</Text>
                {selectedAnalysis.differentiation_map?.unique_angles_for_spiral?.map((angle, idx) => (
                  <Text key={idx} style={styles.opportunityItem}>
                    • {angle}
                  </Text>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>All Recommendations</Text>
                {selectedAnalysis.recommendations.map((rec, idx) => (
                  <View key={idx} style={styles.fullRecommendationItem}>
                    <Text style={styles.fullRecommendationTitle}>{rec.title}</Text>
                    <View style={styles.fullRecommendationMeta}>
                      <Text style={styles.ownerRole}>{rec.owner_role}</Text>
                      <View 
                        style={[
                          styles.impactBadge, 
                          { backgroundColor: getImpactColor(rec.impact) }
                        ]}
                      >
                        <Text style={styles.impactText}>{rec.impact}</Text>
                      </View>
                      <Text style={styles.etaText}>{rec.eta_days} days</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  runButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  runButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  runButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  analysisCard: {
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
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  decisionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  decisionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  rationale: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  recommendationsContainer: {
    marginBottom: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#4b5563',
    flex: 1,
    marginRight: 8,
  },
  recommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 4,
  },
  impactText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  etaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  decisionContainer: {
    marginBottom: 8,
  },
  stageItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  stageEvidence: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  opportunityItem: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
    lineHeight: 20,
  },
  fullRecommendationItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  fullRecommendationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  fullRecommendationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerRole: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
});