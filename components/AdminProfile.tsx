import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import { User, Phone, Settings, LogOut, Edit3, Camera, Mail, Shield, Users, BarChart3, Database, MapPin } from 'lucide-react-native';
import { useAppStore } from '@/store/app-store';
import Colors from '@/constants/colors';

export default function AdminProfile() {
  const { user, setUser, logout } = useAppStore();
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

  const handleRoleSwitch = (role: 'client' | 'agent') => {
    Alert.alert(
      'Changer de rôle',
      `Voulez-vous passer en mode ${role === 'client' ? 'Client' : 'Agent'} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            console.log('Switching to role:', role);
            
            if (role === 'agent') {
              const updatedUser = {
                id: user.id,
                name: user.name || 'Agent Test',
                phone: user.phone || '+213 555 123 456',
                email: user.email || 'agent@gme.dz',
                role: 'agent' as const,
                isGuest: false,
                zone: 'Alger Centre',
                specialties: ['Moteur', 'Électricité', 'Freinage'],
                rating: 4.8,
                isOnline: false
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
            
            Alert.alert('Succès', `Vous êtes maintenant en mode ${role === 'client' ? 'Client' : 'Agent'}.`);
          }
        }
      ]
    );
  };

  // Mock data for admin stats
  const adminStats = {
    totalAgents: 45,
    activeAgents: 32,
    totalTickets: 1247,
    todayTickets: 23,
    avgResponseTime: '8 min',
    systemUptime: '99.8%'
  };

  const adminPermissions = user.permissions || [
    'Gestion des agents',
    'Gestion des tarifs',
    'Rapports et statistiques',
    'Configuration système',
    'Support client'
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header avec avatar */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Shield size={40} color="white" />
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user.name || 'Administrateur'}</Text>
        <Text style={styles.userRole}>Administrateur GME</Text>
        <View style={styles.badgeContainer}>
          <View style={styles.adminBadge}>
            <Shield size={14} color="white" />
            <Text style={styles.badgeText}>ADMIN</Text>
          </View>
        </View>
      </View>

      {/* Statistiques système */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <BarChart3 size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Vue d&apos;ensemble</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.activeAgents}</Text>
            <Text style={styles.statLabel}>Agents actifs</Text>
            <Text style={styles.statSubLabel}>sur {adminStats.totalAgents}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.todayTickets}</Text>
            <Text style={styles.statLabel}>Tickets aujourd&apos;hui</Text>
            <Text style={styles.statSubLabel}>{adminStats.totalTickets} total</Text>
          </View>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.avgResponseTime}</Text>
            <Text style={styles.statLabel}>Temps moyen</Text>
            <Text style={styles.statSubLabel}>de réponse</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.systemUptime}</Text>
            <Text style={styles.statLabel}>Disponibilité</Text>
            <Text style={styles.statSubLabel}>système</Text>
          </View>
        </View>
      </View>

      {/* Accès rapide */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Database size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Accès rapide</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Users size={24} color={Colors.light.primary} />
            <Text style={styles.actionTitle}>Gestion des agents</Text>
            <Text style={styles.actionSubtitle}>Ajouter, modifier, désactiver</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <MapPin size={24} color={Colors.light.primary} />
            <Text style={styles.actionTitle}>Zones d&apos;intervention</Text>
            <Text style={styles.actionSubtitle}>Configurer les zones</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <BarChart3 size={24} color={Colors.light.primary} />
            <Text style={styles.actionTitle}>Rapports</Text>
            <Text style={styles.actionSubtitle}>Statistiques détaillées</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Settings size={24} color={Colors.light.primary} />
            <Text style={styles.actionTitle}>Configuration</Text>
            <Text style={styles.actionSubtitle}>Paramètres système</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
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
                <Text style={styles.inputLabel}>Email</Text>
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
      </View>

      {/* Permissions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={24} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Permissions</Text>
        </View>
        
        <View style={styles.permissionsContainer}>
          {adminPermissions.map((permission, index) => (
            <View key={index} style={styles.permissionItem}>
              <View style={styles.permissionDot} />
              <Text style={styles.permissionText}>{permission}</Text>
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
          <Text style={styles.settingText}>Notifications système</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Sauvegardes automatiques</Text>
          <Text style={styles.settingValue}>Activées</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Logs système</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Maintenance</Text>
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
            onPress={() => handleRoleSwitch('agent')}
          >
            <Text style={styles.roleButtonText}>Passer en mode Agent</Text>
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
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  statSubLabel: {
    fontSize: 10,
    color: Colors.light.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  quickActions: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 12,
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.light.muted,
    marginLeft: 12,
    flex: 1,
    marginTop: 2,
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
  permissionsContainer: {
    gap: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  permissionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.success,
    marginRight: 12,
  },
  permissionText: {
    fontSize: 14,
    color: Colors.light.text,
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