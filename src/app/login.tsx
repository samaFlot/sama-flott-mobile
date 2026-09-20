import { useState } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { EnteteConnexion } from '@/components/connexion/EnTeteConnexion';
import { ChampEmail } from '@/components/connexion/ChampEmail';
import { ChampMotDePasse } from '@/components/connexion/ChampMotDePasse';
import { BoutonConnexion } from '@/components/connexion/BoutonConnexion';
import { COLORS } from '@/constants/colors';

import { useAuthentification } from '@/hooks/useAuthentification';

export default function Connexion() {
  const [erreurEmail, setErreurEmail] = useState('');
  const [erreurMotDePasse, setErreurMotDePasse] = useState('');
  // Permet de naviguer vers une autre page.
  const router = useRouter();

  // Récupère la logique d'authentification.
  const {
    authentifier,
    loading,
    error,
  } = useAuthentification();

  // Contient l'email saisi par l'utilisateur.
  const [email, setEmail] = useState('');

  // Contient le mot de passe saisi par l'utilisateur.
  const [password, setPassword] = useState('');

  // Fonction appelée lorsque l'utilisateur
  // appuie sur le bouton "Se connecter".
  const handleConnexion = async () => {
    // Réinitialise les anciennes erreurs avant une nouvelle tentative.
    setErreurEmail('');
    setErreurMotDePasse('');

    // Vérifie que l'email a été renseigné.
    if (!email.trim()) {
      setErreurEmail('Veuillez saisir votre adresse email.');
      return;
    }

    // Vérifie que l'email respecte un format simple.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErreurEmail('Veuillez saisir une adresse email valide.');
      return;
    }

    // Vérifie que le mot de passe a été renseigné.
    if (!password) {
      setErreurMotDePasse('Veuillez saisir votre mot de passe.');
      return;
    }
    // Appelle le hook avec les données saisies.
    const response = await authentifier(email, password);

    // Si la connexion a échoué,
    // on reste sur la page de connexion.
    if (!response) {
      Alert.alert(
        'Connexion échouée',
        error ?? 'Email ou mot de passe incorrect.'
      );

      return;
    }

    // Si la connexion réussit,
    // on redirige l'utilisateur vers les missions.
    router.replace('/missions');
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['bottom']}
    >
      {/* Permet d'adapter l'écran lorsque
          le clavier apparaît. */}
      <KeyboardAvoidingView
        style={styles.ecran}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        {/* Permet de faire défiler le contenu
            lorsque le clavier prend beaucoup de place. */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ecran}>
            <EnteteConnexion />

            <View style={styles.formulaire}>
              <View style={styles.indicateur} />

              <View style={styles.champs}>
                <ChampEmail
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErreurEmail('');
                  }}
                  erreur={erreurEmail}
                />

                <ChampMotDePasse
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErreurMotDePasse('');
                  }}
                  erreur={erreurMotDePasse}
                />

                <BoutonConnexion
                  onConnexion={handleConnexion}
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },

  ecran: {
    flex: 1,
  },

  // Permet au ScrollView de prendre toute la hauteur
  // disponible tout en pouvant défiler si nécessaire.
  scroll: {
    flexGrow: 1,
  },

  formulaire: {
    flex: 1,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: COLORS.lightBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
  },

  indicateur: {
    alignSelf: 'center',
    width: 48,
    height: 6,
    marginBottom: 32,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    opacity: 0.5,
  },

  champs: {
    gap: 24,
  },
});