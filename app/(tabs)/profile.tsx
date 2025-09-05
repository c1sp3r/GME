import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/app-store';
import Colors from '@/constants/colors';
import ClientProfile from '@/components/ClientProfile';
import AgentProfile from '@/components/AgentProfile';
import AdminProfile from '@/components/AdminProfile';

export default function ProfileScreen() {
  const { user } = useAppStore();

  useEffect(() => {
    console.log('Profile screen - Current user role:', user.role);
  }, [user.role]);

  const renderProfileByRole = () => {
    console.log('Rendering profile for role:', user.role);
    switch (user.role) {
      case 'agent':
        return <AgentProfile />;
      case 'admin':
        return <AdminProfile />;
      case 'client':
      default:
        return <ClientProfile />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.roleIndicator}>
          <Text style={styles.roleText}>
            {user.role === 'client' ? 'Client' : 
             user.role === 'agent' ? 'Agent' : 'Admin'}
          </Text>
        </View>
      </View>
      {renderProfileByRole()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  roleIndicator: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});