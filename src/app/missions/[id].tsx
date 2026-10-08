import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { Linking } from 'react-native';
import { useState } from 'react';

import { EnTeteMission } from '@/components/detail/EnTeteMission';
import { InformationMission } from '@/components/detail/InformationMission';
import { InformationsDateHeure } from '@/components/detail/InformationsDateHeure';
import { VehiculeMission } from '@/components/detail/VehiculeMission';
import { DescriptionMission } from '@/components/detail/DescriptionMission';
import { BoutonActionMission } from '@/components/detail/BoutonActionMission';
import { ModalSignalement } from '@/components/detail/ModalSignalement';

import { useMissionDetail } from '@/hooks/useMissionDetail';
import { useMissions } from '@/hooks/useMissions';
import { useMissionAction } from '@/hooks/useMissionAction';
import { useSignalement } from '@/hooks/useSignalement';
import { useGeolocalisation } from '@/hooks/useGeolocalisation';
import { demanderAutorisationLocalisation } from '@/services/geolocalisation';
import { Ionicons } from '@expo/vector-icons';

export default function DetailMission() {

  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const missionId = Number(id);
  const { missions } = useMissions();

  const [modalSignalementVisible, setModalSignalementVisible] =
    useState(false);

  const {
    demarrer,
    terminer,
    chargement: chargementAction,
    erreur: erreurAction,
  } = useMissionAction();

  const {
    envoyerSignalement,
    chargement: chargementSignalement,
  } = useSignalement();

  const {
    mission,
    chargement,
    erreur,
    mettreAJourMission,
  } = useMissionDetail(missionId);

  const vehiculeId = mission?.vehicule?.id ?? null;

  const {
    suiviActif,
    erreur: erreurGeolocalisation,
  } = useGeolocalisation(
    vehiculeId,
    mission?.statut === 'EN_COURS'
  );

  const handleRetour = () => {
    router.back();
  };

  const handleAction = async () => {
    if (!mission) {
      return;
    }

    if (mission.statut === 'PREVU') {
      const autorisationAccordee =
        await demanderAutorisationLocalisation();

      if (!autorisationAccordee) {
        Alert.alert(
          'Localisation nécessaire',
          'Pour démarrer cette mission, l’autorisation de localisation est nécessaire afin de suivre la position du véhicule.',
          [
            {
              text: 'Annuler',
              style: 'cancel',
            },
            {
              text: 'Ouvrir les réglages',
              onPress: () => Linking.openSettings(),
            },
          ]
        );

        return;
      }

      const missionDemarree = await demarrer(mission.id);

      if (!missionDemarree) {
        return;
      }

      mettreAJourMission(missionDemarree);
    }

    if (mission.statut === 'EN_COURS') {
      const missionTerminee = await terminer(mission.id);

      if (!missionTerminee) {
        return;
      }

      mettreAJourMission(missionTerminee);
    }
  };

  const handleEnvoyerSignalement = async (donnees: {
    mission: number;
    type_probleme: string;
    description: string;
    photo?: {
      uri: string;
      name: string;
      type: string;
    } | null;
  }) => {

    const signalement =
      await envoyerSignalement(donnees);

    if (!signalement) {
      return;
    }

    setModalSignalementVisible(false);

    Alert.alert(
      'Signalement envoyé',
      'Votre signalement a bien été envoyé au responsable.'
    );
  };

  if (chargement) {
    return (
      <SafeAreaView
        style={styles.ecran}
        edges={['top', 'bottom']}
      />
    );
  }

  if (erreur || !mission) {
    return (
      <SafeAreaView
        style={styles.ecran}
        edges={['top', 'bottom']}
      />
    );
  }

  const autreMissionEnCours = missions.find(
    (missionItem) =>
      missionItem.statut === 'EN_COURS' &&
      missionItem.id !== mission.id
  ) !== undefined;

  return (
    <SafeAreaView
      style={styles.ecran}
      edges={['top', 'bottom']}
    >

      <EnTeteMission
        nomDemandeur={mission.demande_chargement.demandeur}
        onRetour={handleRetour}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        <InformationMission mission={mission} />

        <InformationsDateHeure
          date={mission.demande_chargement.date_chargement}
          heure={mission.demande_chargement.heure_chargement}
        />

        <VehiculeMission
          vehicule={
            mission.vehicule?.immatriculation ?? 'Non affecté'
          }
          typeVehicule={
            mission.vehicule?.type_vehicule ??
            'Type non renseigné'
          }
        />

        <DescriptionMission
          description={
            mission.demande_chargement.description ||
            'Aucune description disponible.'
          }
        />

        {mission.statut === 'EN_COURS' && (
          <BoutonSignalement
            onPress={() =>
              setModalSignalementVisible(true)
            }
          />
        )}
      </ScrollView>

      <BoutonActionMission
        statut={mission.statut}
        onAppui={handleAction}
        demarrageDesactive={autreMissionEnCours}
      />

      <ModalSignalement
        visible={modalSignalementVisible}
        missionId={mission.id}
        chargement={chargementSignalement}
        onFermer={() =>
          setModalSignalementVisible(false)
        }
        onEnvoyer={handleEnvoyerSignalement}
      />

    </SafeAreaView>
  );
}

interface ProprietesBoutonSignalement {
  onPress: () => void;
}

function BoutonSignalement({
  onPress,
}: ProprietesBoutonSignalement) {
  return (
    <Pressable
      style={styles.boutonSignalement}
      onPress={onPress}
    >
      <Ionicons
        name="warning-outline"
        size={20}
        color="#E53935"
      />

      <Text style={styles.texteSignalement}>
        Faire un signalement
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  scroll: {
    flex: 1,
  },

  contenu: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 16,
  },

  boutonSignalement: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },

  texteSignalement: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '700',
  },
});
