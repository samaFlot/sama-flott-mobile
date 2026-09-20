import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarreNavigation } from '@/components/accueil/BarreNavigation';
import { CarteMission } from '@/components/accueil/CarteMission';
import { EnTeteAccueil } from '@/components/accueil/EnTeteAccueil';

import { useMissions } from '@/hooks/useMissions';
import { useProfil } from '@/hooks/useProfil';

export default function Accueil() {
  const router = useRouter();

  // Récupère le profil de l'utilisateur connecté.
  const {
    profil,
    chargerProfil,
    chargement: chargementProfil,
    erreur: erreurProfil,
  } = useProfil();

  // Récupère les missions de l'Agent.
  const {
    missions,
    chargement: chargementMissions,
    erreur: erreurMissions,
    chargerMissions,
  } = useMissions();

  //hook de Expo Router qui permet d’exécuter une fonction chaque fois qu'un écran devient visible/actif
  //permet d'actualiser la liste lorsque l'Agent revient dessus.
  useFocusEffect(
  //useCallback sert à mémoriser une fonction pour éviter de la recréer à chaque rendu du composant.
  useCallback(() => {
    // Recharge les missions à chaque retour sur l'écran.
    chargerMissions();
    chargerProfil();
  }, [chargerMissions])
);

  // Ouvre le détail de la mission sélectionnée.
  const handleAppuiDetails = (missionId: number) => {
    router.push(`/missions/${missionId}`);
  };

  // Nombre de missions en cours.
  const nombreMissionsEnCours = missions.filter(
    (mission) => mission.statut === 'EN_COURS'
  ).length;

  // Nombre total de missions.
  const nombreTotalMissions = missions.length;

  // Chargement du profil ou des missions.
  const chargement =
    chargementProfil || chargementMissions;

  // Une erreur sur le profil ou les missions.
  const erreur =
    erreurProfil || erreurMissions;

  if (chargement) {
    return (
      <SafeAreaView style={styles.ecran}>
        <View style={styles.etat}>
          <ActivityIndicator
            size="large"
            color="#F5821F"
          />

          <Text style={styles.texteEtat}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (erreur || !profil) {
    return (
      <SafeAreaView style={styles.ecran}>
        <View style={styles.etat}>
          <Text style={styles.texteErreur}>
            {erreur ?? 'Profil introuvable.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.ecran}
      edges={['top']}
    >
      <EnTeteAccueil
        profil={profil}
        missionsEnCours={nombreMissionsEnCours}
        totalMissions={nombreTotalMissions}
      />

      <View style={styles.contenu}>
        <View style={styles.ligneTitre}>
          <Text style={styles.titre}>
            Vos Missions
          </Text>

          <Text style={styles.voirTout}>
            Tout voir
          </Text>
        </View>

        {missions.length === 0 ? (
          <View style={styles.etat}>
            <Text style={styles.texteEtat}>
              Aucune mission attribuée.
            </Text>
          </View>
        ) : (
          <FlatList
            data={missions}
            keyExtractor={(mission) =>
              String(mission.id)
            }
            renderItem={({ item }) => (
              <CarteMission
                mission={item}
                onAppuiDetails={handleAppuiDetails}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separateurCarte} />
            )}
            contentContainerStyle={styles.liste}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BarreNavigation
        pageActive="missions"
        onMissions={() => {}}
        onProfil={() => router.push('/profil')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  contenu: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  ligneTitre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  titre: {
    color: '#0F2A4A',
    fontSize: 18,
    fontWeight: '700',
  },

  voirTout: {
    color: '#2C5C8A',
    fontSize: 12,
    fontWeight: '600',
  },

  liste: {
    paddingBottom: 24,
  },

  separateurCarte: {
    height: 16,
  },

  etat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  texteEtat: {
    marginTop: 12,
    color: '#2C5C8A',
    fontSize: 14,
    textAlign: 'center',
  },

  texteErreur: {
    color: '#C0392B',
    fontSize: 14,
    textAlign: 'center',
  },
});