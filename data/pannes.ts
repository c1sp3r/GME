import { PanneIcon } from '@/store/app-store';

export const PANNE_ICONS: PanneIcon[] = [
  {
    id: 'engine',
    code: 'P0001',
    name: 'Voyant Moteur',
    description: 'Anomalie moteur ou système antipollution détectée',
    severity: 'high',
    icon: '🔴',
    immediateActions: [
      'Réduire la vitesse',
      'Éviter les accélérations brusques',
      'Se diriger vers un garage rapidement'
    ]
  },
  {
    id: 'battery',
    code: 'B0001',
    name: 'Voyant Batterie',
    description: 'Problème de charge de la batterie ou alternateur',
    severity: 'medium',
    icon: '🔋',
    immediateActions: [
      'Éteindre les équipements non essentiels',
      'Vérifier les connexions de batterie',
      'Ne pas couper le moteur'
    ]
  },
  {
    id: 'oil',
    code: 'O0001',
    name: 'Voyant Huile',
    description: 'Niveau d\'huile bas ou pression insuffisante',
    severity: 'high',
    icon: '🛢️',
    immediateActions: [
      'Arrêter le moteur immédiatement',
      'Vérifier le niveau d\'huile',
      'Ne pas redémarrer sans huile'
    ]
  },
  {
    id: 'temperature',
    code: 'T0001',
    name: 'Voyant Température',
    description: 'Surchauffe du moteur détectée',
    severity: 'high',
    icon: '🌡️',
    immediateActions: [
      'Arrêter le véhicule en sécurité',
      'Couper le moteur et attendre',
      'Vérifier le niveau de liquide de refroidissement'
    ]
  },
  {
    id: 'brakes',
    code: 'BR001',
    name: 'Voyant Freins',
    description: 'Problème de freinage ou liquide de frein',
    severity: 'high',
    icon: '🛑',
    immediateActions: [
      'Conduire très prudemment',
      'Tester les freins à basse vitesse',
      'Se rendre immédiatement au garage'
    ]
  },
  {
    id: 'tire_pressure',
    code: 'TP001',
    name: 'Pression Pneus',
    description: 'Pression des pneus insuffisante',
    severity: 'medium',
    icon: '🛞',
    immediateActions: [
      'Vérifier visuellement les pneus',
      'Réduire la vitesse',
      'Regonfler dès que possible'
    ]
  },
  {
    id: 'airbag',
    code: 'AB001',
    name: 'Voyant Airbag',
    description: 'Dysfonctionnement du système airbag',
    severity: 'medium',
    icon: '🚨',
    immediateActions: [
      'Conduire prudemment',
      'Faire vérifier rapidement',
      'Les airbags peuvent ne pas fonctionner'
    ]
  },
  {
    id: 'abs',
    code: 'ABS01',
    name: 'Voyant ABS',
    description: 'Problème du système antiblocage des roues',
    severity: 'medium',
    icon: '⚠️',
    immediateActions: [
      'Freiner plus progressivement',
      'Augmenter les distances de sécurité',
      'Faire réparer rapidement'
    ]
  }
];

export const OFFLINE_AGENTS = [
  {
    id: 'agent1',
    name: 'Ahmed Benali',
    phone: '+213 555 123 456',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    zone: 'Alger Centre',
    specialties: ['Peugeot', 'Renault', 'Électrique'],
    rating: 4.8,
    isOnline: true
  },
  {
    id: 'agent2',
    name: 'Karim Messaoudi',
    phone: '+213 555 234 567',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    zone: 'Bab Ezzouar',
    specialties: ['Toyota', 'Hyundai', 'Mécanique'],
    rating: 4.6,
    isOnline: true
  },
  {
    id: 'agent3',
    name: 'Mohamed Khelifi',
    phone: '+213 555 345 678',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    zone: 'Hydra',
    specialties: ['Volkswagen', 'Diagnostic', 'Électronique'],
    rating: 4.9,
    isOnline: false
  },
  {
    id: 'agent4',
    name: 'Yacine Boumediene',
    phone: '+213 555 456 789',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    zone: 'Kouba',
    specialties: ['Dacia', 'Fiat', 'Carrosserie'],
    rating: 4.5,
    isOnline: true
  },
  {
    id: 'agent5',
    name: 'Farid Hamidi',
    phone: '+213 555 567 890',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    zone: 'El Harrach',
    specialties: ['Kia', 'Hyundai', 'Climatisation'],
    rating: 4.7,
    isOnline: true
  }
];