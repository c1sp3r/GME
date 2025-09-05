import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertTriangle, Phone, MapPin, Wrench } from 'lucide-react-native';
import { PANNE_ICONS, OFFLINE_AGENTS } from '@/data/pannes';

interface OfflineGuideProps {
  onBack: () => void;
}

export default function OfflineGuide({ onBack }: OfflineGuideProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Guide Hors Ligne</Text>

      <ScrollView style={styles.scrollView}>
        {/* Guide des voyants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={24} color="#FF5722" />
            <Text style={styles.sectionTitle}>Guide des Voyants</Text>
          </View>

          {PANNE_ICONS.map((panne) => (
            <View key={panne.id} style={styles.panneCard}>
              <View style={styles.panneHeader}>
                <Text style={styles.panneIcon}>{panne.icon}</Text>
                <View style={styles.panneInfo}>
                  <Text style={styles.panneName}>{panne.name}</Text>
                  <Text style={styles.panneDescription}>{panne.description}</Text>
                </View>
              </View>
              
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsTitle}>Actions immédiates:</Text>
                {panne.immediateActions.map((action, index) => (
                  <Text key={index} style={styles.actionItem}>• {action}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Agents disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Wrench size={24} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Agents de Dépannage</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Contactez directement ces agents en cas de panne
          </Text>

          {OFFLINE_AGENTS.map((agent) => (
            <View key={agent.id} style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <View style={styles.agentAvatar}>
                  <Text style={styles.agentInitial}>{agent.name.charAt(0)}</Text>
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <View style={styles.agentDetails}>
                    <MapPin size={14} color="#666" />
                    <Text style={styles.agentZone}>{agent.zone}</Text>
                  </View>
                  <Text style={styles.agentRating}>⭐ {agent.rating}</Text>
                </View>
              </View>

              <View style={styles.agentSpecialties}>
                <Text style={styles.specialtiesTitle}>Spécialités:</Text>
                <Text style={styles.specialtiesText}>
                  {agent.specialties.join(', ')}
                </Text>
              </View>

              <TouchableOpacity style={styles.callButton}>
                <Phone size={20} color="white" />
                <Text style={styles.callButtonText}>{agent.phone}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Conseils de sécurité */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={24} color="#FF9800" />
            <Text style={styles.sectionTitle}>Conseils de Sécurité</Text>
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>En cas de panne sur la route:</Text>
            <Text style={styles.safetyItem}>• Allumez vos feux de détresse</Text>
            <Text style={styles.safetyItem}>• Portez un gilet réfléchissant</Text>
            <Text style={styles.safetyItem}>• Placez un triangle de signalisation</Text>
            <Text style={styles.safetyItem}>• Sortez du véhicule côté sécurisé</Text>
            <Text style={styles.safetyItem}>• Restez visible et à distance</Text>
            <Text style={styles.safetyItem}>• Contactez les secours si nécessaire</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  panneCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  panneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  panneIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  panneInfo: {
    flex: 1,
  },
  panneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  panneDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  actionItem: {
    fontSize: 13,
    color: '#F57C00',
    marginBottom: 4,
  },
  agentCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  agentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentZone: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  agentRating: {
    fontSize: 14,
    color: '#FF9800',
  },
  agentSpecialties: {
    marginBottom: 12,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialtiesText: {
    fontSize: 13,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  safetyCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  safetyItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
});