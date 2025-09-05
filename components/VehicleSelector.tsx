import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronRight, Car } from 'lucide-react-native';
import { VEHICLE_BRANDS, VEHICLE_MODELS } from '@/data/vehicles';
import { Vehicle } from '@/store/app-store';
import Colors from '@/constants/colors';

interface VehicleSelectorProps {
  onVehicleSelected: (vehicle: Vehicle) => void;
  onBack: () => void;
}

export default function VehicleSelector({ onVehicleSelected, onBack }: VehicleSelectorProps) {
  const [step, setStep] = useState<'brand' | 'model' | 'details'>('brand');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [plate, setPlate] = useState<string>('');

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrand(brandId);
    setStep('model');
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setStep('details');
  };

  const handleConfirm = () => {
    const brand = VEHICLE_BRANDS.find(b => b.id === selectedBrand);
    if (brand) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        brand: brand.name,
        model: selectedModel,
        plate: plate || undefined,
      };
      onVehicleSelected(vehicle);
    }
  };

  if (step === 'brand') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sélectionnez votre marque</Text>
        <ScrollView style={styles.scrollView}>
          {VEHICLE_BRANDS.map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={styles.brandItem}
              onPress={() => handleBrandSelect(brand.id)}
            >
              <View style={styles.brandContent}>
                <Text style={styles.brandEmoji}>{brand.logo}</Text>
                <Text style={styles.brandName}>{brand.name}</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (step === 'model') {
    const models = VEHICLE_MODELS[selectedBrand] || [];
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep('brand')}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Sélectionnez votre modèle</Text>
        <ScrollView style={styles.scrollView}>
          {models.map((model) => (
            <TouchableOpacity
              key={model}
              style={styles.modelItem}
              onPress={() => handleModelSelect(model)}
            >
              <Car size={24} color={Colors.light.primary} />
              <Text style={styles.modelName}>{model}</Text>
              <ChevronRight size={20} color={Colors.light.muted} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => setStep('model')}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Détails du véhicule</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.selectedVehicle}>
          <Text style={styles.selectedText}>
            {VEHICLE_BRANDS.find(b => b.id === selectedBrand)?.name} {selectedModel}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Numéro de plaque (optionnel)</Text>
          <TextInput
            style={styles.textInput}
            value={plate}
            onChangeText={setPlate}
            placeholder="Ex: 123456-16"
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Continuer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  brandItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modelItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modelName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    flex: 1,
    marginLeft: 12,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  detailsContainer: {
    flex: 1,
  },
  selectedVehicle: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  confirmButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});