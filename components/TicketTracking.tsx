import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MapPin, Phone, MessageCircle, Clock, CheckCircle, Car, CreditCard } from 'lucide-react-native';
import { Ticket } from '@/store/app-store';

interface TicketTrackingProps {
  ticket: Ticket;
  onStatusUpdate: (status: Ticket['status']) => void;
  onPayment: () => void;
}

export default function TicketTracking({ ticket, onStatusUpdate, onPayment }: TicketTrackingProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulation de l'évolution du statut
    if (ticket.status === 'ASSIGNED') {
      setTimeout(() => onStatusUpdate('EN_ROUTE'), 3000);
    } else if (ticket.status === 'EN_ROUTE') {
      setTimeout(() => onStatusUpdate('ON_SITE'), 15000);
    } else if (ticket.status === 'ON_SITE') {
      setTimeout(() => onStatusUpdate('COMPLETED'), 20000);
    }
  }, [ticket.status, onStatusUpdate]);

  const getStatusInfo = (status: Ticket['status']) => {
    switch (status) {
      case 'ASSIGNED':
        return {
          title: 'Agent assigné',
          description: 'L\'agent prépare son intervention',
          color: '#FF9800',
          icon: CheckCircle
        };
      case 'EN_ROUTE':
        return {
          title: 'Agent en route',
          description: `Arrivée estimée: ${ticket.estimatedArrival?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) || 'Bientôt'}`,
          color: '#2196F3',
          icon: Car
        };
      case 'ON_SITE':
        return {
          title: 'Agent sur place',
          description: 'Diagnostic et réparation en cours',
          color: '#4CAF50',
          icon: MapPin
        };
      case 'COMPLETED':
        return {
          title: 'Intervention terminée',
          description: 'Procédez au paiement',
          color: '#4CAF50',
          icon: CheckCircle
        };
      default:
        return {
          title: 'En attente',
          description: 'Recherche d\'un agent',
          color: '#666',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo(ticket.status);
  const StatusIcon = statusInfo.icon;

  const getEstimatedTime = () => {
    if (!ticket.estimatedArrival) return null;
    const diff = ticket.estimatedArrival.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Arrivé';
    const minutes = Math.ceil(diff / (1000 * 60));
    return `${minutes} min`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivi de votre demande</Text>

      {/* Statut principal */}
      <View style={styles.statusCard}>
        <View style={[styles.statusIcon, { backgroundColor: statusInfo.color }]}>
          <StatusIcon size={24} color="white" />
        </View>
        <View style={styles.statusInfo}>
          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusDescription}>{statusInfo.description}</Text>
          {ticket.status === 'EN_ROUTE' && getEstimatedTime() && (
            <Text style={styles.etaText}>ETA: {getEstimatedTime()}</Text>
          )}
        </View>
      </View>

      {/* Informations agent */}
      {ticket.agent && (
        <View style={styles.agentCard}>
          <View style={styles.agentHeader}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentInitial}>
                {ticket.agent.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={styles.agentName}>{ticket.agent.name}</Text>
              <Text style={styles.agentZone}>{ticket.agent.zone}</Text>
              <Text style={styles.agentRating}>⭐ {ticket.agent.rating}</Text>
            </View>
          </View>

          <View style={styles.agentActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={20} color="#2E7D32" />
              <Text style={styles.actionText}>Appeler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color="#2E7D32" />
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Détails de la demande */}
      <ScrollView style={styles.detailsContainer}>
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Véhicule</Text>
          <Text style={styles.detailText}>
            {ticket.request.vehicle.brand} {ticket.request.vehicle.model}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Pannes signalées</Text>
          {ticket.request.pannes.map((panne) => (
            <View key={panne.id} style={styles.panneItem}>
              <Text style={styles.panneIcon}>{panne.icon}</Text>
              <Text style={styles.panneText}>{panne.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>Localisation</Text>
          <Text style={styles.detailText}>{ticket.request.location.address}</Text>
          {ticket.request.location.landmark && (
            <Text style={styles.landmarkText}>Repère: {ticket.request.location.landmark}</Text>
          )}
        </View>

        {ticket.finalCost && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Montant final</Text>
            <Text style={styles.costText}>{ticket.finalCost.toLocaleString()} DA</Text>
          </View>
        )}
      </ScrollView>

      {/* Actions selon le statut */}
      {ticket.status === 'COMPLETED' && (
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.paymentButton} onPress={onPayment}>
            <CreditCard size={20} color="white" />
            <Text style={styles.paymentButtonText}>Procéder au paiement</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
  },
  etaText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
  },
  agentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  agentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  agentZone: {
    fontSize: 14,
    color: '#666',
  },
  agentRating: {
    fontSize: 14,
    color: '#FF9800',
  },
  agentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  panneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  panneIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  panneText: {
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
  },
  bottomActions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});