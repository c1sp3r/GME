import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image, Switch } from 'react-native';
import { User, Phone, MapPin, Settings, LogOut, Edit3, Camera, Mail, Star, CheckCircle, Wrench } from 'lucide-react-native';
import { useAppStore } from '@/store/app-store';
import Colors from '@/constants/colors';

export default function AgentProfile() {
  const { user, setUser, logout } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [editZone, setEditZone] = useState(user.zone || '');
  const [isOnline, setIsOnline] = useState(user.isOnline || false);

  const handleSaveProfile = () => {
    if (!editName.trim() || !editPhone.trim() || !editZone.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setUser({
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      zone: editZone.trim(),
      isGuest: false
    });

    setIsEditing(false);
    Alert.alert('Succès', 'Profil mis à jour avec succès.');
  };

  const handleStatusToggle = (value: boolean) => {
    setIsOnline(value);
    setUser({ isOnline: value });
    Alert.alert(
      'Statut mis à jour',
      value ? 'Vous êtes maintenant en ligne et pouvez recevoir des demandes.' : 'Vous êtes maintenant hors ligne.'
    );
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

  const handleRoleSwitch = (role: 'client' | 'admin') => {
    Alert.alert(
      'Changer de rôle',
      `Voulez-vous passer en mode ${role === 'client' ? 'Client' : 'Administrateur'} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            console.log('Switching to role:', role);
            
            if (role === 'admin') {
              const updatedUser = {
                id: user.id,
                name: user.name || 'Administrateur Test',
                phone: user.phone || '+213 555 123 456',
                email: user.email || 'admin@gme.dz',
                role: 'admin' as const,
                isGuest: false,
                permissions: [
                  'Gestion des agents',
                  'Gestion des tarifs',
                  'Rapports et statistiques',
                  'Configuration système',
                  'Support client'
                ]
              };
              console.log('Updated user object:', updatedUser);
              setUser(updatedUser);
            } else {
              const updatedUser = {
                id: user.id,
                name: user.name || 'Client Test',
                phone: user.phone || '+213 555 123 456',
                email: user.email || 'client@gme.dz',
                role: 'client' as const,
                isGuest: false
              };
              console.log('Updated user object:', updatedUser);
              setUser(updatedUser);
            }
            
            Alert.alert('Succès', `Vous êtes maintenant en mode ${role === 'client' ? 'Client' : 'Administrateur'}.`);
          }
        }
      ]
    );
  };

  // Mock data for agent stats
  const agentStats = {
    totalInterventions: 127,
    completedToday: 8,
    rating: user.rating || 4.8,
    responseTime: '12 min',
    specialties: user.specialties || ['Moteur', 'Électricité', 'Freinage']
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec avatar et statut */}
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
          <View style={[styles.statusIndicator, { backgroundColor: isOnline ? Colors.light.success : Colors.light.muted }]} />
        </View>
        <Text style={styles.userName}>{user.name || 'Agent GME'}</Text>
        <Text style={styles.userRole}>Agent Technique</Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color="#FFD700" fill="#FFD700" />
          <Text style={styles.rating}>{agentStats.rating}</Text>
          <Text style={styles.ratingCount}>({agentStats.totalInterventions} interventions)</Text>
        </View>
      </View>

      {/* Statut en ligne */}
      <View style={styles.section}>
        <View style={styles.statusSection}>
          <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Statut de disponibilité</Text>
              <Text style={styles.statusSubtitle}>
                {isOnline ? 'En ligne - Vous recevez des demandes' : 'Hors ligne - Aucune demande reçue'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleStatusToggle}
              trackColor={{ false: Colors.light.border, true: Colors.light.success }}
              thumbColor={isOnline ? 'white' : Colors.light.muted}
            />
          </View>
        </View>
      </View>

      {/* Statistiques */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <CheckCircle size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Statistiques</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agentStats.completedToday}</Text>
            <Text style={styles.statLabel}>Aujourd&apos;hui</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agentStats.totalInterventions}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{agentStats.responseTime}</Text>
            <Text style={styles.statLabel}>Temps moyen</Text>
          </View>
        </View>
      </View>

      {/* Informations professionnelles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Edit3 size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

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
                <Text style={styles.inputLabel}>Téléphone professionnel</Text>
                <TextInput
                  style={styles.textInput}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Votre numéro professionnel"
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
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Zone d&apos;intervention</Text>
                <TextInput
                  style={styles.textInput}
                  value={editZone}
                  onChangeText={setEditZone}
                  placeholder="Ex: Alger Centre, Oran, Constantine..."
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
                    setEditZone(user.zone || '');
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
              <View style={styles.infoRow}>
                <MapPin size={16} color={Colors.light.muted} />
                <Text style={styles.infoValue}>{user.zone || 'Zone non définie'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Spécialités */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Wrench size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Spécialités</Text>
        </View>
        
        <View style={styles.specialtiesContainer}>
          {agentStats.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
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
          <Text style={styles.settingText}>Rayon d&apos;intervention</Text>
          <Text style={styles.settingValue}>15 km</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Historique des interventions</Text>
        </TouchableOpacity>

        {/* Mode développeur - Changement de rôle */}
        <View style={styles.devSection}>
          <Text style={styles.devTitle}>Mode développeur</Text>
          <TouchableOpacity 
            style={styles.roleButton}
            onPress={() => handleRoleSwitch('client')}
          >
            <Text style={styles.roleButtonText}>Passer en mode Client</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.roleButton}
            onPress={() => handleRoleSwitch('admin')}
          >
            <Text style={styles.roleButtonText}>Passer en mode Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
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
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
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
  statusSection: {
    marginBottom: -4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: 'center',
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
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  specialtyText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
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