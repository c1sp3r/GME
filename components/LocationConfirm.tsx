import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import Colors from '@/constants/colors';

interface LocationConfirmProps {
  onLocationConfirmed: (location: {
    latitude: number;
    longitude: number;
    address: string;
    landmark?: string;
  }) => void;
  onBack: () => void;
}

export default function LocationConfirm({ onLocationConfirmed, onBack }: LocationConfirmProps) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [landmark, setLandmark] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L&apos;accès à la localisation est nécessaire pour le dépannage.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocoding pour obtenir l'adresse
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addresses[0];
      
      const formattedAddress = address 
        ? `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim()
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      setLocation({
        latitude,
        longitude,
        address: formattedAddress || 'Adresse non disponible'
      });
    } catch (error) {
      console.log('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!location) {
      Alert.alert('Erreur', 'Position non disponible. Veuillez réessayer.');
      return;
    }

    onLocationConfirmed({
      ...location,
      landmark: landmark || undefined
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Navigation size={48} color={Colors.light.primary} />
          <Text style={styles.loadingText}>Localisation en cours...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Confirmez votre position</Text>

      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color={Colors.light.primary} />
        <Text style={styles.mapText}>Carte interactive</Text>
        <Text style={styles.mapSubtext}>Votre position actuelle</Text>
      </View>

      <View style={styles.locationInfo}>
        <View style={styles.addressContainer}>
          <MapPin size={20} color={Colors.light.muted} />
          <Text style={styles.addressText}>
            {location?.address || 'Adresse non disponible'}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Point de repère (optionnel)</Text>
          <TextInput
            style={styles.textInput}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Ex: À côté de la station Naftal"
            placeholderTextColor="#999"
            multiline
          />
          <Text style={styles.inputHint}>
            Ajoutez un repère pour aider l&apos;agent à vous trouver plus facilement
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={getCurrentLocation}>
          <Navigation size={20} color={Colors.light.primary} />
          <Text style={styles.refreshText}>Actualiser ma position</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.confirmButton, !location && styles.confirmButtonDisabled]} 
        onPress={handleConfirm}
        disabled={!location}
      >
        <Text style={styles.confirmButtonText}>Confirmer ma position</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.light.muted,
    marginTop: 16,
  },
  mapPlaceholder: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 4,
  },
  locationInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: Colors.light.muted,
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.light.muted,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});