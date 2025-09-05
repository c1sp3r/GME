import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, MapPin, BarChart3, Clock, AlertTriangle } from 'lucide-react-native';
import { useAppStore } from '@/store/app-store';
import Colors from '@/constants/colors';

export default function AdminPanelScreen() {
  const { user } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'agents' | 'zones' | 'stats'>('agents');

  // Mock data for admin panel
  const mockAgents = [
    {
      id: '1',
      name: 'Ahmed Benali',
      phone: '+213 555 123 456',
      zone: 'Alger Centre',
      specialties: ['Moteur', 'Électricité'],
      rating: 4.8,
      isOnline: true,
      totalInterventions: 127
    },
    {
      id: '2',
      name: 'Fatima Khelil',
      phone: '+213 555 234 567',
      zone: 'Oran',
      specialties: ['Freinage', 'Climatisation'],
      rating: 4.6,
      isOnline: false,
      totalInterventions: 89
    },
    {
      id: '3',
      name: 'Mohamed Saidi',
      phone: '+213 555 345 678',
      zone: 'Constantine',
      specialties: ['Moteur', 'Transmission'],
      rating: 4.9,
      isOnline: true,
      totalInterventions: 156
    }
  ];

  const mockZones = [
    { id: '1', name: 'Alger Centre', agents: 12, activeAgents: 8 },
    { id: '2', name: 'Alger Ouest', agents: 8, activeAgents: 5 },
    { id: '3', name: 'Oran', agents: 15, activeAgents: 11 },
    { id: '4', name: 'Constantine', agents: 10, activeAgents: 7 },
    { id: '5', name: 'Annaba', agents: 6, activeAgents: 4 }
  ];

  const mockStats = {
    totalAgents: 51,
    activeAgents: 35,
    todayTickets: 23,
    pendingTickets: 5,
    avgResponseTime: '8 min',
    successRate: '94%'
  };

  const handleAgentAction = (agentId: string, action: 'activate' | 'deactivate' | 'edit') => {
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) return;

    switch (action) {
      case 'activate':
        Alert.alert('Agent activé', `${agent.name} est maintenant actif.`);
        break;
      case 'deactivate':
        Alert.alert('Agent désactivé', `${agent.name} a été désactivé.`);
        break;
      case 'edit':
        Alert.alert('Modifier agent', `Édition du profil de ${agent.name}`);
        break;
    }
  };

  const renderAgentsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Gestion des agents</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.agentsList}>
        {mockAgents.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentZone}>{agent.zone}</Text>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: agent.isOnline ? Colors.light.success : Colors.light.muted }]} />
            </View>
            
            <View style={styles.agentDetails}>
              <Text style={styles.agentPhone}>{agent.phone}</Text>
              <Text style={styles.agentRating}>⭐ {agent.rating} ({agent.totalInterventions} interventions)</Text>
              <View style={styles.specialtiesContainer}>
                {agent.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.agentActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleAgentAction(agent.id, 'edit')}
              >
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, agent.isOnline ? styles.deactivateButton : styles.activateButton]}
                onPress={() => handleAgentAction(agent.id, agent.isOnline ? 'deactivate' : 'activate')}
              >
                <Text style={[styles.actionButtonText, { color: agent.isOnline ? Colors.light.error : Colors.light.success }]}>
                  {agent.isOnline ? 'Désactiver' : 'Activer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderZonesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Zones d&apos;intervention</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Zone</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.zonesList}>
        {mockZones.map((zone) => (
          <View key={zone.id} style={styles.zoneCard}>
            <View style={styles.zoneHeader}>
              <MapPin size={20} color={Colors.light.primary} />
              <Text style={styles.zoneName}>{zone.name}</Text>
            </View>
            <View style={styles.zoneStats}>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatNumber}>{zone.activeAgents}</Text>
                <Text style={styles.zoneStatLabel}>Actifs</Text>
              </View>
              <View style={styles.zoneStat}>
                <Text style={styles.zoneStatNumber}>{zone.agents}</Text>
                <Text style={styles.zoneStatLabel}>Total</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Statistiques système</Text>
      
      <ScrollView style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color={Colors.light.primary} />
            <Text style={styles.statNumber}>{mockStats.activeAgents}</Text>
            <Text style={styles.statLabel}>Agents actifs</Text>
            <Text style={styles.statSubLabel}>sur {mockStats.totalAgents}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Clock size={24} color={Colors.light.success} />
            <Text style={styles.statNumber}>{mockStats.avgResponseTime}</Text>
            <Text style={styles.statLabel}>Temps moyen</Text>
            <Text style={styles.statSubLabel}>de réponse</Text>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <BarChart3 size={24} color={Colors.light.warning} />
            <Text style={styles.statNumber}>{mockStats.todayTickets}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
            <Text style={styles.statSubLabel}>aujourd&apos;hui</Text>
          </View>
          
          <View style={styles.statCard}>
            <AlertTriangle size={24} color={Colors.light.error} />
            <Text style={styles.statNumber}>{mockStats.pendingTickets}</Text>
            <Text style={styles.statLabel}>En attente</Text>
            <Text style={styles.statSubLabel}>à traiter</Text>
          </View>
        </View>
        
        <View style={styles.successRateCard}>
          <Text style={styles.successRateTitle}>Taux de réussite</Text>
          <Text style={styles.successRateValue}>{mockStats.successRate}</Text>
          <Text style={styles.successRateSubtitle}>Interventions réussies</Text>
        </View>
      </ScrollView>
    </View>
  );

  if (user.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDenied}>
          <AlertTriangle size={60} color={Colors.light.error} />
          <Text style={styles.accessDeniedTitle}>Accès refusé</Text>
          <Text style={styles.accessDeniedText}>Vous n&apos;avez pas les permissions nécessaires pour accéder à cette section.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panneau d&apos;administration</Text>
        <Text style={styles.subtitle}>Gestion du système GME</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'agents' && styles.activeTabButton]}
          onPress={() => setSelectedTab('agents')}
        >
          <Users size={20} color={selectedTab === 'agents' ? 'white' : Colors.light.muted} />
          <Text style={[styles.tabButtonText, selectedTab === 'agents' && styles.activeTabButtonText]}>Agents</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'zones' && styles.activeTabButton]}
          onPress={() => setSelectedTab('zones')}
        >
          <MapPin size={20} color={selectedTab === 'zones' ? 'white' : Colors.light.muted} />
          <Text style={[styles.tabButtonText, selectedTab === 'zones' && styles.activeTabButtonText]}>Zones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'stats' && styles.activeTabButton]}
          onPress={() => setSelectedTab('stats')}
        >
          <BarChart3 size={20} color={selectedTab === 'stats' ? 'white' : Colors.light.muted} />
          <Text style={[styles.tabButtonText, selectedTab === 'stats' && styles.activeTabButtonText]}>Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {selectedTab === 'agents' && renderAgentsTab()}
      {selectedTab === 'zones' && renderZonesTab()}
      {selectedTab === 'stats' && renderStatsTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: Colors.light.primary,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.muted,
  },
  activeTabButtonText: {
    color: 'white',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  agentsList: {
    flex: 1,
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  agentZone: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  agentDetails: {
    marginBottom: 16,
  },
  agentPhone: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 4,
  },
  agentRating: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 8,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  specialtyText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  agentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
  },
  editButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '500',
  },
  activateButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: Colors.light.success,
  },
  deactivateButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: Colors.light.error,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  zonesList: {
    flex: 1,
  },
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  zoneStats: {
    flexDirection: 'row',
    gap: 20,
  },
  zoneStat: {
    alignItems: 'center',
  },
  zoneStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  zoneStatLabel: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 2,
  },
  statsContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  statSubLabel: {
    fontSize: 10,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  successRateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successRateTitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  successRateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.light.success,
    marginBottom: 4,
  },
  successRateSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.error,
    marginTop: 20,
    marginBottom: 12,
  },
  accessDeniedText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
});