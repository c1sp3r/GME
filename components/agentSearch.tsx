import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Search, CheckCircle, Clock, Phone } from 'lucide-react-native';
import { OFFLINE_AGENTS } from '@/data/pannes';
import { Agent } from '@/store/app-store';
import Colors from '@/constants/colors';

interface AgentSearchProps {
  onAgentFound: (agent: Agent) => void;
  onCancel: () => void;
}

export default function AgentSearch({ onAgentFound, onCancel }: AgentSearchProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [searchAnimation] = useState(new Animated.Value(0));
  const [foundAgent, setFoundAgent] = useState<Agent | null>(null);

  const searchSteps = [
    'Recherche d\'agents disponibles...',
    'Envoi de la demande au plus proche...',
    'En attente de confirmation...',
    'Agent trouvé !'
  ];

  useEffect(() => {
    // Animation de recherche
    const animateSearch = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(searchAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(searchAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateSearch();

    // Simulation de la recherche séquentielle
    const searchTimeout = setTimeout(() => {
      setCurrentStep(1);
      
      setTimeout(() => {
        setCurrentStep(2);
        
        setTimeout(() => {
          setCurrentStep(3);
          // Sélectionner un agent disponible aléatoirement
          const availableAgents = OFFLINE_AGENTS.filter(agent => agent.isOnline);
          const selectedAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
          setFoundAgent(selectedAgent);
          
          setTimeout(() => {
            onAgentFound(selectedAgent);
          }, 2000);
        }, 3000);
      }, 2000);
    }, 2000);

    return () => {
      clearTimeout(searchTimeout);
      searchAnimation.stopAnimation();
    };
  }, [onAgentFound, searchAnimation]);

  const scale = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const opacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recherche d&apos;un agent</Text>

      <View style={styles.searchContainer}>
        {currentStep < 3 ? (
          <Animated.View style={[styles.searchIcon, { transform: [{ scale }], opacity }]}>
            <Search size={48} color={Colors.light.primary} />
          </Animated.View>
        ) : (
          <View style={styles.successIcon}>
            <CheckCircle size={48} color={Colors.light.success} />
          </View>
        )}

        <Text style={styles.searchText}>{searchSteps[currentStep]}</Text>

        {currentStep < 3 && (
          <View style={styles.progressContainer}>
            {searchSteps.slice(0, 3).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {foundAgent && (
        <View style={styles.agentCard}>
          <View style={styles.agentInfo}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentInitial}>
                {foundAgent.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.agentDetails}>
              <Text style={styles.agentName}>{foundAgent.name}</Text>
              <Text style={styles.agentZone}>{foundAgent.zone}</Text>
              <View style={styles.agentRating}>
                <Text style={styles.ratingText}>⭐ {foundAgent.rating}</Text>
                <Text style={styles.specialties}>
                  {foundAgent.specialties.slice(0, 2).join(', ')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Clock size={16} color={Colors.light.muted} />
          <Text style={styles.infoText}>Temps d&apos;attente moyen: 2-5 minutes</Text>
        </View>
        <View style={styles.infoItem}>
          <Phone size={16} color={Colors.light.muted} />
          <Text style={styles.infoText}>L&apos;agent vous contactera une fois assigné</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Annuler la recherche</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  searchIcon: {
    marginBottom: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  searchText: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.border,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
  },
  agentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  agentInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  agentZone: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 4,
  },
  agentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.light.warning,
    marginRight: 12,
  },
  specialties: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.muted,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});