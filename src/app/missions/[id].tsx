import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  // État de la fenêtre de saisie du kilométrage.
  const [modalKilometrageVisible, setModalKilometrageVisible] =
    useState(false);

  // Kilométrage saisi par l'agent.
  const [kilometrageSaisi, setKilometrageSaisi] = useState('');

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
      // Demander le kilométrage avant de terminer la mission.
      setKilometrageSaisi('');
      setModalKilometrageVisible(true);
    }
  };

  /**
   * Valide le kilométrage et demande au backend de terminer la mission.
   */
  const handleTerminerMission = async () => {
    if (!mission) {
      return;
    }

    if (kilometrageSaisi.trim() === '') {
      Alert.alert(
        'Kilométrage obligatoire',
        'Veuillez saisir le kilométrage du véhicule à l’arrivée.'
      );

      return;
    }

    const kilometrage = Number(kilometrageSaisi);

    if (
      !Number.isSafeInteger(kilometrage) ||
      kilometrage < 0
    ) {
      Alert.alert(
        'Kilométrage invalide',
        'Veuillez saisir un kilométrage entier positif ou nul.'
      );

      return;
    }

    // Envoyer le kilométrage au backend.
    const missionTerminee = await terminer(
      mission.id,
      kilometrage
    );

    if (!missionTerminee) {
      Alert.alert(
        'Erreur',
        erreurAction ?? 'Impossible de terminer la mission.'
      );

      return;
    }

    // Actualiser la mission après sa validation par le backend.
    mettreAJourMission(missionTerminee);

    setModalKilometrageVisible(false);
    setKilometrageSaisi('');

    Alert.alert(
      'Mission terminée',
      'La mission a été terminée avec succès.'
    );
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
    const signalement = await envoyerSignalement(donnees);

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

  const autreMissionEnCours =
    missions.find(
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

        
        <BoutonSignalement
          onPress={() => setModalSignalementVisible(true)}
        />
        
      </ScrollView>

      <BoutonActionMission
        statut={mission.statut}
        onAppui={handleAction}
        demarrageDesactive={autreMissionEnCours}
      />

      {/* Fenêtre de signalement existante */}
      <ModalSignalement
        visible={modalSignalementVisible}
        missionId={mission.id}
        chargement={chargementSignalement}
        onFermer={() => setModalSignalementVisible(false)}
        onEnvoyer={handleEnvoyerSignalement}
      />

      {/* Fenêtre de saisie du kilométrage à l'arrivée */}
      <Modal
        visible={modalKilometrageVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!chargementAction) {
            setModalKilometrageVisible(false);
          }
        }}
      >
        <View style={styles.fondModal}>
          <View style={styles.carteModal}>
            <Text style={styles.titreModal}>
              Terminer la mission
            </Text>

            <Text style={styles.descriptionModal}>
              Saisissez le kilométrage actuel du véhicule à son arrivée.
            </Text>

            <Text style={styles.labelKilometrage}>
              Kilométrage à l'arrivée (km)
            </Text>

            <TextInput
              style={styles.champKilometrage}
              value={kilometrageSaisi}
              onChangeText={setKilometrageSaisi}
              placeholder="Ex. : 125000"
              keyboardType="number-pad"
              maxLength={10}
              editable={!chargementAction}
            />

            <View style={styles.actionsModal}>
              <Pressable
                style={styles.boutonAnnuler}
                onPress={() => {
                  setModalKilometrageVisible(false);
                  setKilometrageSaisi('');
                }}
                disabled={chargementAction}
              >
                <Text style={styles.texteAnnuler}>
                  Annuler
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.boutonConfirmer,
                  chargementAction && styles.boutonDesactive,
                ]}
                onPress={handleTerminerMission}
                disabled={chargementAction}
              >
                <Text style={styles.texteConfirmer}>
                  {chargementAction
                    ? 'Validation...'
                    : 'Confirmer'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  // Styles de la fenêtre de kilométrage.
  fondModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  carteModal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
  },

  titreModal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F2A4A',
    marginBottom: 10,
  },

  descriptionModal: {
    fontSize: 14,
    color: '#667085',
    lineHeight: 21,
    marginBottom: 22,
  },

  labelKilometrage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 8,
  },

  champKilometrage: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#101828',
    marginBottom: 24,
  },

  actionsModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  boutonAnnuler: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  texteAnnuler: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '600',
  },

  boutonConfirmer: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#0F2A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  texteConfirmer: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  boutonDesactive: {
    opacity: 0.6,
  },
});