import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Mission } from '@/types/mission';

interface ProprietesInformationMission {
  mission: Mission;
}

const CONFIGURATION_STATUT = {
  PREVU: {
    libelle: 'À VENIR',
    couleurFond: '#F3F4F6',
    couleurTexte: '#9CA3AF',
  },

  EN_COURS: {
    libelle: 'EN COURS',
    couleurFond: 'rgba(245, 130, 31, 0.10)',
    couleurTexte: '#F5821F',
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

export function InformationMission({
  mission,
}: ProprietesInformationMission) {
  const statut = CONFIGURATION_STATUT[mission.statut];

  return (
    <View style={styles.carte}>
      <View style={styles.entete}>
        <Text style={styles.titreSection}>
          INFORMATIONS
        </Text>

        <View
          style={[
            styles.badgeStatut,
            {
              backgroundColor: statut.couleurFond,
            },
          ]}
        >
          <Text
            style={[
              styles.texteBadge,
              {
                color: statut.couleurTexte,
              },
            ]}
          >
            {statut.libelle}
          </Text>
        </View>
      </View>

      <View style={styles.liste}>
        <LigneInformation
          icone={
            <MaterialCommunityIcons
              name="office-building-outline"
              size={18}
              color="#2C5C8A"
            />
          }
          libelle="DEMANDEUR"
          valeur={mission.demande_chargement.demandeur}
        />

        <LigneInformation
          icone={
            <Ionicons
              name="location-outline"
              size={18}
              color="#2C5C8A"
            />
          }
          libelle="POINT DE DÉPART"
          valeur={mission.demande_chargement.point_depart}
        />

        <LigneInformation
          icone={
            <Ionicons
              name="location"
              size={18}
              color="#F5821F"
            />
          }
          libelle="DESTINATION"
          valeur={mission.demande_chargement.destination}
          iconeDestination
        />
      </View>
    </View>
  );
}

interface ProprietesLigneInformation {
  icone: React.ReactNode;
  libelle: string;
  valeur: string;
  iconeDestination?: boolean;
}

function LigneInformation({
  icone,
  libelle,
  valeur,
}: ProprietesLigneInformation) {
  return (
    <View style={styles.ligneInformation}>
      <View style={styles.iconeConteneur}>
        {icone}
      </View>

      <View style={styles.contenuInformation}>
        <Text style={styles.libelle}>
          {libelle}
        </Text>

        <Text style={styles.valeur}>
          {valeur}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,

    shadowColor: '#0F2A4A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },

  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  titreSection: {
    color: '#2C5C8A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  badgeStatut: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },

  texteBadge: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  liste: {
    gap: 24,
  },

  ligneInformation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  iconeConteneur: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contenuInformation: {
    flex: 1,
    paddingLeft: 16,
  },

  libelle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  valeur: {
    color: '#0F2A4A',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
});