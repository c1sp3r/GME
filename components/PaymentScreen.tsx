import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CreditCard, Banknote, CheckCircle, Receipt } from 'lucide-react-native';

interface PaymentScreenProps {
  amount: number;
  onPaymentComplete: (method: 'baridi' | 'cash') => void;
  onBack: () => void;
}

export default function PaymentScreen({ amount, onPaymentComplete, onBack }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'baridi' | 'cash' | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Méthode de paiement', 'Veuillez sélectionner une méthode de paiement.');
      return;
    }

    setProcessing(true);

    if (selectedMethod === 'baridi') {
      // Simulation du paiement Baridi Mob
      setTimeout(() => {
        setProcessing(false);
        Alert.alert(
          'Paiement réussi',
          'Votre paiement Baridi Mob a été traité avec succès.',
          [{ text: 'OK', onPress: () => onPaymentComplete('baridi') }]
        );
      }, 3000);
    } else {
      // Paiement en espèces - confirmation immédiate
      setProcessing(false);
      Alert.alert(
        'Paiement en espèces',
        'Veuillez remettre le montant en espèces à l\'agent. Il confirmera la réception.',
        [{ text: 'Confirmer', onPress: () => onPaymentComplete('cash') }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Paiement</Text>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Montant à payer</Text>
        <Text style={styles.amountText}>{amount.toLocaleString()} DA</Text>
      </View>

      <Text style={styles.methodTitle}>Choisissez votre méthode de paiement</Text>

      <View style={styles.methodsContainer}>
        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'baridi' && styles.methodCardSelected
          ]}
          onPress={() => setSelectedMethod('baridi')}
        >
          <View style={styles.methodHeader}>
            <CreditCard size={32} color="#2E7D32" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Baridi Mob</Text>
              <Text style={styles.methodDescription}>Carte Edahabia</Text>
            </View>
            {selectedMethod === 'baridi' && (
              <CheckCircle size={24} color="#2E7D32" />
            )}
          </View>
          <Text style={styles.methodDetails}>
            Paiement sécurisé par carte Edahabia via l&apos;application Baridi Mob
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodCard,
            selectedMethod === 'cash' && styles.methodCardSelected
          ]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.methodHeader}>
            <Banknote size={32} color="#4CAF50" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Espèces</Text>
              <Text style={styles.methodDescription}>Paiement direct</Text>
            </View>
            {selectedMethod === 'cash' && (
              <CheckCircle size={24} color="#2E7D32" />
            )}
          </View>
          <Text style={styles.methodDetails}>
            Remise du montant en espèces directement à l&apos;agent
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Receipt size={20} color="#666" />
        <Text style={styles.infoText}>
          Une facture sera générée automatiquement après le paiement
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.payButton,
          !selectedMethod && styles.payButtonDisabled,
          processing && styles.payButtonProcessing
        ]}
        onPress={handlePayment}
        disabled={!selectedMethod || processing}
      >
        <Text style={styles.payButtonText}>
          {processing ? 'Traitement en cours...' : 'Procéder au paiement'}
        </Text>
      </TouchableOpacity>
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
  amountContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodCardSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E8',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
  methodDetails: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    flex: 1,
  },
  payButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonProcessing: {
    backgroundColor: '#FF9800',
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});