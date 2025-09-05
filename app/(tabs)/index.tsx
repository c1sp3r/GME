import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wrench, Book, Phone, WifiOff, User } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAppStore, TicketRequest, Vehicle, PanneIcon } from '@/store/app-store';
import VehicleSelector from '@/components/VehicleSelector';
import PanneSelector from '@/components/PanneSelector';
import LocationConfirm from '@/components/LocationConfirm';
import TicketSummary from '@/components/TicketSummary';
import AgentSearch from '@/components/AgentSearch';
import TicketTracking from '@/components/TicketTracking';
import PaymentScreen from '@/components/PaymentScreen';
import OfflineGuide from '@/components/OfflineGuide';

type AppStep = 
  | 'home' 
  | 'vehicle' 
  | 'pannes' 
  | 'location' 
  | 'summary' 
  | 'search' 
  | 'tracking' 
  | 'payment' 
  | 'guide';

export default function HomeScreen() {
  const { user, currentTicket, setUser, createTicket, updateTicketStatus, loadPersistedData, isOffline } = useAppStore();
  const [currentStep, setCurrentStep] = useState<AppStep>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedPannes, setSelectedPannes] = useState<PanneIcon[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    loadPersistedData();
  }, [loadPersistedData]);

  useEffect(() => {
    if (currentTicket) {
      if (currentTicket.status === 'SEARCHING') {
        setCurrentStep('search');
      } else if (currentTicket.status === 'COMPLETED') {
        setCurrentStep('payment');
      } else {
        setCurrentStep('tracking');
      }
    }
  }, [currentTicket]);

  const handleVehicleSelected = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentStep('pannes');
  };

  const handlePannesSelected = (pannes: PanneIcon[]) => {
    setSelectedPannes(pannes);
    setCurrentStep('location');
  };

  const handleLocationConfirmed = (location: any) => {
    setSelectedLocation(location);
    setCurrentStep('summary');
  };

  const handleTicketConfirmed = (guestInfo?: { name: string; phone: string }) => {
    if (!selectedVehicle || !selectedPannes.length || !selectedLocation) return;

    if (guestInfo) {
      setUser({
        name: guestInfo.name,
        phone: guestInfo.phone,
        isGuest: true
      });
    }

    const ticketRequest: TicketRequest = {
      vehicle: selectedVehicle,
      pannes: selectedPannes,
      location: selectedLocation,
      photos: [],
      estimatedCost: { min: 2000, max: 5000 }
    };

    createTicket(ticketRequest);
    setCurrentStep('search');
  };

  const handleAgentFound = (agent: any) => {
    updateTicketStatus('ASSIGNED', agent);
    setCurrentStep('tracking');
  };

  const handlePaymentComplete = (method: 'baridi' | 'cash') => {
    updateTicketStatus('PAID');
    Alert.alert(
      'Paiement confirmé',
      'Merci ! Votre facture sera disponible dans l\'historique.',
      [{ text: 'OK', onPress: () => setCurrentStep('home') }]
    );
  };

  const resetFlow = () => {
    setCurrentStep('home');
    setSelectedVehicle(null);
    setSelectedPannes([]);
    setSelectedLocation(null);
  };

  if (currentStep === 'vehicle') {
    return (
      <SafeAreaView style={styles.container}>
        <VehicleSelector
          onVehicleSelected={handleVehicleSelected}
          onBack={() => setCurrentStep('home')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'pannes') {
    return (
      <SafeAreaView style={styles.container}>
        <PanneSelector
          onPannesSelected={handlePannesSelected}
          onBack={() => setCurrentStep('vehicle')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'location') {
    return (
      <SafeAreaView style={styles.container}>
        <LocationConfirm
          onLocationConfirmed={handleLocationConfirmed}
          onBack={() => setCurrentStep('pannes')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'summary') {
    const ticketRequest: TicketRequest = {
      vehicle: selectedVehicle!,
      pannes: selectedPannes,
      location: selectedLocation,
      photos: [],
      estimatedCost: { min: 2000, max: 5000 }
    };

    return (
      <SafeAreaView style={styles.container}>
        <TicketSummary
          ticketRequest={ticketRequest}
          onConfirm={handleTicketConfirmed}
          onBack={() => setCurrentStep('location')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'search') {
    return (
      <SafeAreaView style={styles.container}>
        <AgentSearch
          onAgentFound={handleAgentFound}
          onCancel={resetFlow}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'tracking' && currentTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <TicketTracking
          ticket={currentTicket}
          onStatusUpdate={(status) => updateTicketStatus(status)}
          onPayment={() => setCurrentStep('payment')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'payment' && currentTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <PaymentScreen
          amount={currentTicket.finalCost || 3500}
          onPaymentComplete={handlePaymentComplete}
          onBack={() => setCurrentStep('tracking')}
        />
      </SafeAreaView>
    );
  }

  if (currentStep === 'guide') {
    return (
      <SafeAreaView style={styles.container}>
        <OfflineGuide onBack={() => setCurrentStep('home')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GME Dépannage</Text>
        <Text style={styles.subtitle}>Service de dépannage automobile en Algérie</Text>
        
        {isOffline && (
          <View style={styles.offlineIndicator}>
            <WifiOff size={16} color={Colors.light.error} />
            <Text style={styles.offlineText}>Mode hors ligne</Text>
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <User size={20} color={Colors.light.muted} />
        <Text style={styles.userText}>
          {user.name ? `Bonjour ${user.name}` : 'Mode invité'}
        </Text>
      </View>

      <View style={styles.mainActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setCurrentStep('vehicle')}
        >
          <Wrench size={32} color="white" />
          <Text style={styles.primaryButtonText}>Signaler une panne</Text>
          <Text style={styles.primaryButtonSubtext}>Demander un dépannage</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setCurrentStep('guide')}
          >
            <Book size={24} color={Colors.light.primary} />
            <Text style={styles.secondaryButtonText}>Guide des voyants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => Alert.alert('Urgence', 'Numéro d\'urgence: 14 (Protection civile)')}
          >
            <Phone size={24} color={Colors.light.error} />
            <Text style={styles.secondaryButtonText}>Urgence</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Comment ça marche ?</Text>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Sélectionnez votre véhicule et les pannes</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Confirmez votre localisation</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Un agent GME vous contacte</Text>
        </View>
        <View style={styles.stepItem}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Paiement après service (Baridi Mob / Espèces)</Text>
        </View>
      </View>
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
    padding: 24,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  offlineText: {
    fontSize: 12,
    color: Colors.light.error,
    marginLeft: 6,
    fontWeight: '500',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  mainActions: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 0.48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: Colors.light.muted,
    flex: 1,
  },
});