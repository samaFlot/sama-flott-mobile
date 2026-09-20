import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";

import {
  Info,
  LockKeyhole,
  LogOut,
  UserRoundPen,
} from "lucide-react-native";
import EnteteProfil from "@/components/profil/EnteteProfil";
import CarteOptionProfil from "@/components/profil/CarteOptionProfil";
import { BarreNavigation } from "@/components/accueil/BarreNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProfil } from "@/hooks/useProfil";

export default function Profil() {
  const router = useRouter();

  // Profil de l'utilisateur connecté (données de Django)
  const { profil, chargement, erreur, chargerProfil } = useProfil();

  /*
   * Recharger le profil chaque fois que l'écran redevient visible.
   * Ainsi, après une modification dans "Modifier mes informations",
   * le nom, le téléphone et la photo sont à jour au retour.
   */
  useFocusEffect(
    useCallback(() => {
      chargerProfil();
    }, [])
  );

  // Nom complet : prénom + nom
  const nomComplet = profil
    ? `${profil.first_name} ${profil.last_name}`
    : "";

  // Photo du profil, ou image de remplacement
  const photo = profil?.photo || "https://placehold.co/176x176";

  const handleRetour = () => {
    router.back();
  };

  const handleModifierInformations = () => {
    router.push('/modifier-informations');
  };

  const handleModifierMotDePasse = () => {
    router.push('/modifier-mot-de-passe');
  };

  const handleAPropos = () => {
    Alert.alert(
      "À propos",
      "SamaFlott - Application de gestion de flotte."
    );
  };

  const handleDeconnexion = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: async () => {
            // Supprimer les tokens enregistrés à la connexion
            await AsyncStorage.removeItem("accessToken");
            await AsyncStorage.removeItem("refreshToken");

            // Retour à l'écran de connexion,
            // sans pouvoir revenir en arrière
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      {/* En-tête */}
      <EnteteProfil onRetour={handleRetour} />

      {/* Contenu */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
      >
        {/* Chargement (seulement la première fois) */}
        {chargement && !profil && (
          <ActivityIndicator size="large" color="#F97316" />
        )}

        {/* Erreur */}
        {erreur && !profil && (
          <Text style={styles.messageErreur}>
            {erreur}
          </Text>
        )}

        {/* Informations utilisateur */}
        {profil && (
          <View style={styles.zoneUtilisateur}>
            <View style={styles.conteneurPhoto}>
              <Image
                source={{ uri: photo }}
                style={styles.photo}
              />
            </View>

            <Text style={styles.nom}>
              {nomComplet}
            </Text>

            <Text style={styles.telephone}>
              {profil.telephone || ""}
            </Text>
          </View>
        )}

        {/* Options */}
        <View style={styles.zoneOptions}>
          <CarteOptionProfil
            titre="Modifier mes informations"
            onPress={handleModifierInformations}
            icone={
              <UserRoundPen
                size={20}
                color="#6B7280"
                strokeWidth={1.8}
              />
            }
          />

          <CarteOptionProfil
            titre="Modifier le mot de passe"
            onPress={handleModifierMotDePasse}
            icone={
              <LockKeyhole
                size={20}
                color="#6B7280"
                strokeWidth={1.8}
              />
            }
          />

          <CarteOptionProfil
            titre="À propos de l'application"
            onPress={handleAPropos}
            icone={
              <Info
                size={20}
                color="#6B7280"
                strokeWidth={1.8}
              />
            }
          />
        </View>

        {/* Déconnexion */}
        <Pressable
          style={({ pressed }) => [
            styles.boutonDeconnexion,
            pressed && styles.boutonAppuye,
          ]}
          onPress={handleDeconnexion}
        >
          <LogOut
            size={20}
            color="#F97316"
            strokeWidth={2}
          />

          <Text style={styles.texteDeconnexion}>
            Se déconnecter
          </Text>
        </Pressable>
      </ScrollView>

      {/* Navigation basse */}
      <BarreNavigation
        pageActive="profil"
        onMissions={() => router.push('/missions')}
        onProfil={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  scroll: {
    flex: 1,
  },

  contenu: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,

    gap: 40,
  },

  /*
   * Message affiché si le profil ne peut pas être chargé
   */
  messageErreur: {
    color: "#EF4444",

    fontSize: 14,
    textAlign: "center",
  },

  /*
   * Zone contenant :
   * - photo
   * - nom
   * - téléphone
   */
  zoneUtilisateur: {
    width: "100%",

    alignItems: "center",
  },

  conteneurPhoto: {
    width: 96,
    height: 96,

    marginBottom: 16,

    borderRadius: 48,

    borderWidth: 2,
    borderColor: "#F97316",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  photo: {
    width: 88,
    height: 88,

    borderRadius: 44,
  },

  nom: {
    color: "#111827",

    fontSize: 16,
    fontWeight: "400",

    lineHeight: 24,
  },

  telephone: {
    marginTop: 4,

    color: "#6B7280",

    fontSize: 16,
    fontWeight: "400",

    lineHeight: 24,
  },

  /*
   * Les trois cartes
   */
  zoneOptions: {
    width: "100%",

    gap: 12,
  },

  /*
   * Bouton déconnexion
   */
  boutonDeconnexion: {
    minHeight: 48,

    paddingHorizontal: 24,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,
  },

  texteDeconnexion: {
    color: "#F97316",

    fontSize: 16,
    fontWeight: "600",

    lineHeight: 24,

    letterSpacing: -0.2,
  },

  boutonAppuye: {
    opacity: 0.7,
  },
});