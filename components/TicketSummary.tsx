import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Car, MapPin, AlertTriangle, DollarSign, User } from 'lucide-react-native';
import { TicketRequest, useAppStore } from '@/store/app-store';

interface TicketSummaryProps {
  ticketRequest: TicketRequest;
  onConfirm: (guestInfo?: { name: string; phone: string }) => void;
  onBack: () => void;
}

export default function TicketSummary({ ticketRequest, onConfirm, onBack }: TicketSummaryProps) {
  const { user } = useAppStore();
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');

  const handleConfirm = () => {
    if (user.isGuest) {
      if (!guestName.trim() || !guestPhone.trim()) {
        Alert.alert('Information manquante', 'Veuillez saisir votre nom et numéro de téléphone.');
        return;
      }
      onConfirm({ name: guestName.trim(), phone: guestPhone.trim() });
    } else {
      onConfirm();
    }
  };

  const formatCost = (min: number, max: number) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()} DA`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Résumé de votre demande</Text>

      <View style={styles.summaryContainer}>
        {/* Véhicule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Car size={20} color="#2E7D32" />
            <Text style={styles.sectionTitle}>Véhicule</Text>
          </View>
          <Text style={styles.sectionContent}>
            {ticketRequest.vehicle.brand} {ticketRequest.vehicle.model}
            {ticketRequest.vehicle.plate && ` • ${ticketRequest.vehicle.plate}`}
          </Text>
        </View>

        {/* Pannes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color="#FF5722" />
            <Text style={styles.sectionTitle}>Pannes signalées</Text>
          </View>
          {ticketRequest.pannes.map((panne, index) => (
            <View key={panne.id} style={styles.panneItem}>
              <Text style={styles.panneIcon}>{panne.icon}</Text>
              <Text style={styles.panneName}>{panne.name}</Text>
            </View>
          ))}
        </View>

        {/* Localisation */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#1976D2" />
            <Text style={styles.sectionTitle}>Localisation</Text>
          </View>
          <Text style={styles.sectionContent}>{ticketRequest.location.address}</Text>
          {ticketRequest.location.landmark && (
            <Text style={styles.landmarkText}>Repère: {ticketRequest.location.landmark}</Text>
          )}
        </View>

        {/* Estimation tarifaire */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign size={20} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Estimation tarifaire</Text>
          </View>
          <Text style={styles.costText}>
            {formatCost(ticketRequest.estimatedCost.min, ticketRequest.estimatedCost.max)}
          </Text>
          <Text style={styles.costNote}>
            * Tarif indicatif. Le montant final sera confirmé par l&apos;agent après diagnostic.
          </Text>
        </View>

        {/* Informations invité */}
        {user.isGuest && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#666" />
              <Text style={styles.sectionTitle}>Vos informations</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom complet *</Text>
              <TextInput
                style={styles.textInput}
                value={guestName}
                onChangeText={setGuestName}
                placeholder="Votre nom et prénom"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
              <TextInput
                style={styles.textInput}
                value={guestPhone}
                onChangeText={setGuestPhone}
                placeholder="Ex: 0555 123 456"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.warningContainer}>
          <AlertTriangle size={16} color="#FF9800" />
          <Text style={styles.warningText}>
            Paiement après service uniquement (Baridi Mob ou espèces)
          </Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmer la demande</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  summaryContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  panneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  panneIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  panneName: {
    fontSize: 14,
    color: '#666',
  },
  landmarkText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  costText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  costNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bottomContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 12,
    color: '#F57C00',
    marginLeft: 8,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});