import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Info } from 'lucide-react-native';
import { PANNE_ICONS } from '@/data/pannes';
import { PanneIcon } from '@/store/app-store';
import Colors from '@/constants/colors';

interface PanneSelectorProps {
  onPannesSelected: (pannes: PanneIcon[]) => void;
  onBack: () => void;
}

export default function PanneSelector({ onPannesSelected, onBack }: PanneSelectorProps) {
  const [selectedPannes, setSelectedPannes] = useState<PanneIcon[]>([]);


  const togglePanne = (panne: PanneIcon) => {
    setSelectedPannes(prev => {
      const exists = prev.find(p => p.id === panne.id);
      if (exists) {
        return prev.filter(p => p.id !== panne.id);
      } else {
        return [...prev, panne];
      }
    });
  };

  const showPanneDetails = (panne: PanneIcon) => {
    Alert.alert(
      panne.name,
      `${panne.description}\n\nActions immédiates:\n${panne.immediateActions.map(action => `• ${action}`).join('\n')}`,
      [{ text: 'Compris', style: 'default' }]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return Colors.light.error;
      case 'medium': return Colors.light.warning;
      case 'low': return Colors.light.success;
      default: return Colors.light.muted;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'URGENT';
      case 'medium': return 'IMPORTANT';
      case 'low': return 'MINEUR';
      default: return '';
    }
  };

  const handleContinue = () => {
    if (selectedPannes.length === 0) {
      Alert.alert('Attention', 'Veuillez sélectionner au moins une panne.');
      return;
    }
    onPannesSelected(selectedPannes);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Quels voyants sont allumés ?</Text>
      <Text style={styles.subtitle}>Sélectionnez tous les voyants concernés</Text>

      <ScrollView style={styles.scrollView}>
        {PANNE_ICONS.map((panne) => {
          const isSelected = selectedPannes.find(p => p.id === panne.id);
          return (
            <View key={panne.id} style={styles.panneContainer}>
              <TouchableOpacity
                style={[
                  styles.panneItem,
                  isSelected && styles.panneItemSelected
                ]}
                onPress={() => togglePanne(panne)}
              >
                <View style={styles.panneLeft}>
                  <Text style={styles.panneIcon}>{panne.icon}</Text>
                  <View style={styles.panneInfo}>
                    <Text style={styles.panneName}>{panne.name}</Text>
                    <Text style={styles.panneDescription}>{panne.description}</Text>
                    <View style={styles.severityContainer}>
                      <Text style={[styles.severityText, { color: getSeverityColor(panne.severity) }]}>
                        {getSeverityText(panne.severity)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => showPanneDetails(panne)}
                >
                  <Info size={20} color={Colors.light.muted} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {selectedPannes.length > 0 && (
        <View style={styles.bottomContainer}>
          <Text style={styles.selectedCount}>
            {selectedPannes.length} panne{selectedPannes.length > 1 ? 's' : ''} sélectionnée{selectedPannes.length > 1 ? 's' : ''}
          </Text>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  panneContainer: {
    marginBottom: 12,
  },
  panneItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  panneItemSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  panneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  panneIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  panneInfo: {
    flex: 1,
  },
  panneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  panneDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 4,
  },
  severityContainer: {
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoButton: {
    padding: 8,
  },
  bottomContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedCount: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});