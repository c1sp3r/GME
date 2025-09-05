import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import { User, Phone, Car, Settings, LogOut, Edit3, Camera, Mail } from 'lucide-react-native';
import { useAppStore } from '@/store/app-store';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function ClientProfile() {
  const { user, vehicles, setUser, logout } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editEmail, setEditEmail] = useState(user.email || '');

  const handleSaveProfile = () => {
    if (!editName.trim() || !editPhone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le nom et le téléphone.');
      return;
    }

    setUser({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      isGuest: false
    });

    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            Alert.alert('Déconnecté', 'Vous êtes maintenant en mode invité.');
          }
        }
      ]
    );
  };

  const handleRoleSwitch = (role: 'agent' | 'admin') => {
    // Redirect to login screens for security
    if (role === 'agent') {
      router.push('/agent-login');
    } else if (role === 'admin') {
      router.push('/admin-login');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="white" />
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name || 'Utilisateur'}</Text>
        <Text style={styles.userRole}>Client GME</Text>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          {!user.isGuest && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit3 size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          )}
        </View>

        {user.isGuest ? (
          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>Mode invité</Text>
            <Text style={styles.guestSubtext}>
              Créez un compte pour sauvegarder vos véhicules et votre historique
            </Text>
            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={() => {
                setUser({
                  name: 'Utilisateur Test',
                  phone: '+213 555 123 456',
                  email: 'test@gme.dz',
                  isGuest: false,
                  role: 'client'
                });
                Alert.alert('Compte créé', 'Votre compte a été créé avec succès.');
              }}
            >
              <Text style={styles.createAccountText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Nom complet</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Votre nom complet"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Téléphone</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="Votre numéro de téléphone"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email (optionnel)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editEmail}
                    onChangeText={setEditEmail}
                    placeholder="Votre adresse email"
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsEditing(false);
                      setEditName(user.name || '');
                      setEditPhone(user.phone || '');
                      setEditEmail(user.email || '');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.saveButtonText}>Sauvegarder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nom:</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Phone size={16} color={Colors.light.muted} />
                  <Text style={styles.infoValue}>{user.phone}</Text>
                </View>
                {user.email && (
                  <View style={styles.infoRow}>
                    <Mail size={16} color={Colors.light.muted} />
                    <Text style={styles.infoValue}>{user.email}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Véhicules */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Car size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Mes véhicules</Text>
        </View>

        {vehicles.length === 0 ? (
          <View style={styles.emptyVehicles}>
            <Text style={styles.emptyText}>Aucun véhicule enregistré</Text>
            <Text style={styles.emptySubtext}>
              Vos véhicules seront sauvegardés lors de vos demandes
            </Text>
          </View>
        ) : (
          <View style={styles.vehiclesList}>
            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <Car size={20} color={Colors.light.primary} />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>
                    {vehicle.brand} {vehicle.model}
                  </Text>
                  {vehicle.plate && (
                    <Text style={styles.vehiclePlate}>{vehicle.plate}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Paramètres */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Settings size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Paramètres</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Langue</Text>
          <Text style={styles.settingValue}>Français</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>À propos</Text>
        </TouchableOpacity>

        {/* Mode développeur - Changement de rôle */}
        <View style={styles.devSection}>
          <Text style={styles.devTitle}>Mode développeur</Text>
          <TouchableOpacity 
            style={styles.roleButton}
            onPress={() => handleRoleSwitch('agent')}
          >
            <Text style={styles.roleButtonText}>Passer en mode Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.roleButton}
            onPress={() => handleRoleSwitch('admin')}
          >
            <Text style={styles.roleButtonText}>Passer en mode Admin</Text>
          </TouchableOpacity>
        </View>

        {!user.isGuest && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.light.error} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  header: {
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  guestContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  guestText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.muted,
    marginBottom: 8,
  },
  guestSubtext: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  createAccountButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createAccountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginRight: 12,
    minWidth: 60,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.light.muted,
    marginLeft: 8,
  },
  editForm: {
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  textInput: {
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.light.muted,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  emptyVehicles: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: 'center',
  },
  vehiclesList: {
    gap: 12,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 8,
  },
  vehicleInfo: {
    marginLeft: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  vehiclePlate: {
    fontSize: 14,
    color: Colors.light.muted,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  settingValue: {
    fontSize: 16,
    color: Colors.light.muted,
  },
  devSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.muted,
    marginBottom: 12,
  },
  roleButton: {
    backgroundColor: Colors.light.surface,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  roleButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.light.error,
    fontWeight: '600',
    marginLeft: 8,
  },
});