import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  MissionListe,
  StatutMission,
} from '@/types/mission';

interface ProprietesCarteMission {
  mission: MissionListe;

  // Fonction appelée lorsque l'Agent appuie
  // sur le bouton "Détails".
  onAppuiDetails?: (missionId: number) => void;
}

// Configuration visuelle du badge selon le statut.
const CONFIGURATION_STATUT: Record<
  StatutMission,
  {
    libelle: string;
    couleurFond: string;
    couleurTexte: string;
  }
> = {
  PREVU: {
    libelle: 'À VENIR',
    couleurFond: '#F3F4F6',
    couleurTexte: '#9CA3AF',
  },

  EN_COURS: {
    libelle: 'EN COURS',
    couleurFond: '#2C5C8A',
    couleurTexte: '#FFFFFF',
  },

  TERMINEE: {
    libelle: 'TERMINÉE',
    couleurFond: '#E7F5EE',
    couleurTexte: '#2E9E6B',
  },

  ANNULEE: {
    libelle: 'ANNULÉE',
    couleurFond: '#F3F4F6',
    couleurTexte: '#9CA3AF',
  },
};

export function CarteMission({
  mission,
  onAppuiDetails,
}: ProprietesCarteMission) {
  // Récupère la configuration correspondant
  // au statut de cette mission.
  const configurationStatut =
    CONFIGURATION_STATUT[mission.statut];

  // La mission en cours est la seule carte
  // qui doit être mise en évidence.
  const estEnCours =
    mission.statut === 'EN_COURS';

  return (
    <View
      style={[
        styles.carte,
        estEnCours && styles.carteEnCours,
      ]}
    >
      {/* Badge du statut */}
      <View
        style={[
          styles.badgeStatut,
          {
            backgroundColor:
              configurationStatut.couleurFond,
          },
        ]}
      >
        <Text
          style={[
            styles.texteBadge,
            {
              color:
                configurationStatut.couleurTexte,
            },
          ]}
        >
          {configurationStatut.libelle}
        </Text>
      </View>

      {/* Entreprise / demandeur */}
      <View style={styles.enteteCarte}>
        <View style={styles.iconeEntreprise}>
          <MaterialCommunityIcons
            name="truck-outline"
            size={20}
            color="#F5821F"
          />
        </View>

        <Text style={styles.demandeur}>
          {mission.demandeur}
        </Text>
      </View>

      {/* Trajet */}
      <View style={styles.trajet}>
        {/* Colonne des points du trajet */}
        <View style={styles.colonnePoints}>
          <View style={styles.pointDepart} />

          <View style={styles.traitVertical} />

          <View style={styles.pointDestination} />
        </View>

        {/* Informations du trajet */}
        <View style={styles.colonneEtapes}>
          <View style={styles.etape}>
            <Text style={styles.libelleEtape}>
              DÉPART
            </Text>

            <Text style={styles.adresseEtape}>
              {mission.point_depart}
            </Text>
          </View>

          <View style={styles.etape}>
            <Text style={styles.libelleEtape}>
              DESTINATION
            </Text>

            <Text style={styles.adresseEtape}>
              {mission.destination}
            </Text>
          </View>
        </View>
      </View>

      {/* Date + bouton détails */}
      <View style={styles.piedCarte}>
        {/* Date et heure */}
        <View style={styles.informationDate}>
          <Ionicons
            name="time-outline"
            size={14}
            color="#2C5C8A"
          />

          <Text style={styles.texteDate}>
            {mission.date_chargement}
            {', '}
            {mission.heure_chargement}
          </Text>
        </View>

        {/* Bouton Détails */}
        <Pressable
          style={styles.boutonDetails}
          onPress={() =>
            onAppuiDetails?.(mission.id)
          }
        >
          <Text style={styles.texteBoutonDetails}>
            Détails
          </Text>

          <Ionicons
            name="chevron-forward"
            size={14}
            color="#F5821F"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Carte normale.
  carte: {
    position: 'relative',
    overflow: 'hidden',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',

    padding: 16,

    gap: 16,
  },

  // Mise en évidence uniquement
  // lorsque la mission est en cours.
  carteEnCours: {
    borderWidth: 2,
    borderColor: '#F5821F',
  },

  // Badge situé en haut à droite.
  badgeStatut: {
    position: 'absolute',
    top: 0,
    right: 0,

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderBottomLeftRadius: 12,
  },

  texteBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // En-tête de la carte.
  enteteCarte: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,

    // Laisse une place au badge.
    paddingRight: 90,
  },

  iconeEntreprise: {
    width: 40,
    height: 40,

    borderRadius: 10,

    backgroundColor: '#0F2A4A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  demandeur: {
    flex: 1,

    color: '#0F2A4A',

    fontSize: 16,
    fontWeight: '700',
  },

  // Trajet identique pour toutes les missions.
  trajet: {
    flexDirection: 'row',
  },

  colonnePoints: {
    alignItems: 'center',

    paddingTop: 4,
    paddingRight: 12,
  },

  pointDepart: {
    width: 10,
    height: 10,

    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#F5821F',
  },

  traitVertical: {
    width: 2,
    height: 24,

    marginVertical: 4,

    backgroundColor: '#F3F4F6',
  },

  pointDestination: {
    width: 10,
    height: 10,

    borderRadius: 2,

    backgroundColor: '#F5821F',
  },

  colonneEtapes: {
    flex: 1,

    gap: 12,
  },

  etape: {
    gap: 2,
  },

  libelleEtape: {
    color: '#9CA3AF',

    fontSize: 10,
    fontWeight: '700',

    letterSpacing: 0.5,
  },

  adresseEtape: {
    color: '#0F2A4A',

    fontSize: 14,
    fontWeight: '600',
  },

  // Bas de la carte.
  piedCarte: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',

    paddingTop: 12,

    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  informationDate: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    paddingRight: 8,
  },

  texteDate: {
    color: '#0F2A4A',

    fontSize: 12,
    fontWeight: '500',
  },

  // Bouton Détails présent sur toutes les cartes.
  boutonDetails: {
    minWidth: 44,
    minHeight: 44,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 4,

    paddingHorizontal: 12,

    borderRadius: 8,

    backgroundColor:
      'rgba(245, 130, 31, 0.1)',
  },

  texteBoutonDetails: {
    color: '#F5821F',

    fontSize: 12,
    fontWeight: '700',
  },
});