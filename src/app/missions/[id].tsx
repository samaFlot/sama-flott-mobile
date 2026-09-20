import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { Linking } from 'react-native';

import { EnTeteMission } from '@/components/detail/EnTeteMission';
import { InformationMission } from '@/components/detail/InformationMission';
import { InformationsDateHeure } from '@/components/detail/InformationsDateHeure';
import { VehiculeMission } from '@/components/detail/VehiculeMission';
import { DescriptionMission } from '@/components/detail/DescriptionMission';
import { BoutonActionMission } from '@/components/detail/BoutonActionMission';

import { useMissionDetail } from '@/hooks/useMissionDetail';
import { useMissions } from '@/hooks/useMissions';
import { useMissionAction } from '@/hooks/useMissionAction';
import { useGeolocalisation } from '@/hooks/useGeolocalisation';
import { demanderAutorisationLocalisation } from '@/services/geolocalisation';

export default function DetailMission() {

  const router = useRouter();

  // Récupère l'identifiant présent dans l'URL :
  // /mission/2 → id = "2"
  const { id } = useLocalSearchParams<{ id: string }>();

  const missionId = Number(id);
  const { missions } = useMissions();

  const {
  demarrer,
  terminer,
  chargement: chargementAction,
  erreur: erreurAction,
} = useMissionAction();

  // Récupère directement la mission depuis le backend
  // avec GET /api/operations/missions/{id}/
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
    //le GPS ne démarre que si la mission est en cour
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
        // Demande d'abord l'autorisation GPS.
        const autorisationAccordee =
            await demanderAutorisationLocalisation();

        if (!autorisationAccordee) {
            Alert.alert(
                'Localisation nécessaire',
                'Pour démarrer cette mission, l’autorisation de localisation est nécessaire afin de suivre la position du véhicule.',
                //tableau de boutons
                [
                    //Ici, on crée un seul bouton
                {
                    //le texte affiché sur le bouton
                    text: 'Annuler',
                    //Cela indique à React Native que c'est un bouton de type annulation.
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

        // L'autorisation GPS est accordée.
        // On peut maintenant démarrer la mission côté backend.
        const missionDemarree = await demarrer(mission.id);

        if (!missionDemarree) {
            return;
        }

        // Met à jour la mission dans l'écran.
        // Son statut devient EN_COURS.
        mettreAJourMission(missionDemarree);

    }

    if (mission.statut === 'EN_COURS') {
        const missionTerminee = await terminer(mission.id);

        if (!missionTerminee) {
            return;
        }

        // Met à jour la mission.
        // Son statut devient TERMINEE.
        mettreAJourMission(missionTerminee);
    }
  };

  // Pendant le chargement
  if (chargement) {
    return (
      <SafeAreaView style={styles.ecran} edges={['top', 'bottom']} />
    );
  }

  // En cas d'erreur ou de mission introuvable
  if (erreur || !mission) {
    return (
      <SafeAreaView style={styles.ecran} edges={['top', 'bottom']} />
    );
  }

    //vérifier Est-ce qu’il y a une AUTRE mission déjà en cours ?
    //si c'est le cas on doit desactiver le bouton demarrer de cette mission
    // autreMissionEnCours est true si on trouve, false si on ne trouve pas car find retourne undefined s'il ne trouve pas ce qu'il recherche.
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
            mission.vehicule?.type_vehicule ?? 'Type non renseigné'
          }
        />

        <DescriptionMission
          description={
            mission.demande_chargement.description ||
            'Aucune description disponible.'
          }
        />
      </ScrollView>

      <BoutonActionMission
        statut={mission.statut}
        onAppui={handleAction}
        demarrageDesactive={autreMissionEnCours}
      />
    </SafeAreaView>
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
});