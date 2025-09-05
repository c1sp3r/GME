import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, CreditCard } from 'lucide-react-native';
import { useAppStore } from '@/store/app-store';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const { ticketHistory, currentTicket } = useAppStore();

  const allTickets = currentTicket ? [currentTicket, ...ticketHistory] : ticketHistory;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return Colors.light.success;
      case 'COMPLETED': return Colors.light.primary;
      case 'ON_SITE': return Colors.light.warning;
      case 'EN_ROUTE': return Colors.light.accent;
      case 'ASSIGNED': return Colors.light.muted;
      default: return Colors.light.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SEARCHING': return 'Recherche agent';
      case 'ASSIGNED': return 'Agent assigné';
      case 'EN_ROUTE': return 'Agent en route';
      case 'ON_SITE': return 'Sur place';
      case 'COMPLETED': return 'Terminé';
      case 'PAID': return 'Payé';
      default: return status;
    }
  };

  if (allTickets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Historique</Text>
        <View style={styles.emptyContainer}>
          <Clock size={48} color={Colors.light.border} />
          <Text style={styles.emptyTitle}>Aucune intervention</Text>
          <Text style={styles.emptyText}>
            Vos demandes de dépannage apparaîtront ici
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historique</Text>
      
      <ScrollView style={styles.scrollView}>
        {allTickets.map((ticket) => (
          <TouchableOpacity key={ticket.id} style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketVehicle}>
                  {ticket.request.vehicle.brand} {ticket.request.vehicle.model}
                </Text>
                <Text style={styles.ticketDate}>
                  {ticket.createdAt.toLocaleDateString('fr-FR')} à {ticket.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
              </View>
            </View>

            <View style={styles.ticketDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={Colors.light.muted} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {ticket.request.location.address}
                </Text>
              </View>

              <View style={styles.pannesContainer}>
                {ticket.request.pannes.slice(0, 3).map((panne) => (
                  <View key={panne.id} style={styles.panneTag}>
                    <Text style={styles.panneIcon}>{panne.icon}</Text>
                    <Text style={styles.panneText}>{panne.name}</Text>
                  </View>
                ))}
                {ticket.request.pannes.length > 3 && (
                  <Text style={styles.moreText}>+{ticket.request.pannes.length - 3}</Text>
                )}
              </View>

              {ticket.agent && (
                <View style={styles.agentInfo}>
                  <Text style={styles.agentText}>Agent: {ticket.agent.name}</Text>
                  <Text style={styles.agentRating}>⭐ {ticket.agent.rating}</Text>
                </View>
              )}

              {ticket.finalCost && (
                <View style={styles.costContainer}>
                  <CreditCard size={16} color={Colors.light.success} />
                  <Text style={styles.costText}>{ticket.finalCost.toLocaleString()} DA</Text>
                  {ticket.paymentMethod && (
                    <Text style={styles.paymentMethod}>
                      ({ticket.paymentMethod === 'baridi' ? 'Baridi Mob' : 'Espèces'})
                    </Text>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.muted,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketVehicle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ticketDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.muted,
    marginLeft: 8,
    flex: 1,
  },
  pannesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  panneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  panneIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  panneText: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  moreText: {
    fontSize: 12,
    color: Colors.light.muted,
    fontStyle: 'italic',
  },
  agentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agentText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  agentRating: {
    fontSize: 14,
    color: Colors.light.warning,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.success,
    marginLeft: 8,
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.light.muted,
    marginLeft: 8,
  },
});