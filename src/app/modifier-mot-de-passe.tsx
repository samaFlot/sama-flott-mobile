import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';
import EnteteProfil from '@/components/profil/EnteteProfil';
import { ChampMotDePasse } from '@/components/modification-mot-de-passe/ChampMotDePasse';
import { MessageSucces } from '@/components/modification-profil/MessageSucces';

import { useProfil } from '@/hooks/useProfil';

export default function ModifierMotDePasse() {
  const router = useRouter();

  // Fonction qui envoie le nouveau mot de passe à Django
  const { changerMotDePasse } = useProfil();

  const [motDePasseActuel, setMotDePasseActuel] =
    useState('');

  const [nouveauMotDePasse, setNouveauMotDePasse] =
    useState('');

  const [
    confirmationMotDePasse,
    setConfirmationMotDePasse,
  ] = useState('');

  const [enregistrement, setEnregistrement] =
    useState(false);

  const [messageErreur, setMessageErreur] =
    useState('');

  const [messageVisible, setMessageVisible] =
    useState(false);

  const handleRetour = () => {
    router.back();
  };

  /*
   * Quand l'utilisateur écrit dans un champ :
   * 1. on enregistre le texte
   * 2. on efface le message d'erreur
   */
  const handleChangerMotDePasseActuel = (texte: string) => {
    setMotDePasseActuel(texte);
    setMessageErreur('');
  };

  const handleChangerNouveauMotDePasse = (texte: string) => {
    setNouveauMotDePasse(texte);
    setMessageErreur('');
  };

  const handleChangerConfirmation = (texte: string) => {
    setConfirmationMotDePasse(texte);
    setMessageErreur('');
  };

  const handleModifierMotDePasse = async () => {
    // On efface l'ancienne erreur
    setMessageErreur('');

    // 1. Vérifier que tous les champs sont remplis
    if (
      !motDePasseActuel ||
      !nouveauMotDePasse ||
      !confirmationMotDePasse
    ) {
      setMessageErreur('Veuillez remplir tous les champs.');
      return;
    }

    // 2. Vérifier la longueur du nouveau mot de passe
    if (nouveauMotDePasse.length < 8) {
      setMessageErreur(
        'Le nouveau mot de passe doit contenir au moins 8 caractères.'
      );
      return;
    }

    // 3. Vérifier que la confirmation est identique
    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setMessageErreur(
        'Les deux mots de passe ne correspondent pas.'
      );
      return;
    }

    // 4. Envoyer à Django
    try {
      setEnregistrement(true);

      await changerMotDePasse({
        ancien_mot_de_passe: motDePasseActuel,
        nouveau_mot_de_passe: nouveauMotDePasse,
        confirmation: confirmationMotDePasse,
      });

      // Vider les champs
      setMotDePasseActuel('');
      setNouveauMotDePasse('');
      setConfirmationMotDePasse('');

      // Message de succès pendant 3 secondes
      setMessageVisible(true);

      setTimeout(() => {
        setMessageVisible(false);
      }, 3000);
    } catch (error) {
      // Erreur affichée dans la console pour t'aider à comprendre
      console.error('Erreur changement de mot de passe :', error);

      // Message simple affiché à l'utilisateur
      setMessageErreur(
        'Impossible de modifier le mot de passe. Vérifiez votre mot de passe actuel et choisissez un mot de passe plus difficile.'
      );
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    // KeyboardAvoidingView : remonte le contenu quand le clavier s'ouvre
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Header */}
      <EnteteProfil
        onRetour={handleRetour}
      />

      {/* Contenu */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenu}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* Carte principale */}
        <View style={styles.carte}>

          {/* Icône cadenas + explication */}
          <View style={styles.introduction}>

            <View style={styles.conteneurIcone}>
              <Ionicons
                name="lock-closed"
                size={25}
                color="#F5821F"
              />
            </View>

            <Text style={styles.description}>
              Votre nouveau mot de passe doit être{'\n'}
              différent des anciens mots de passe{'\n'}
              utilisés.
            </Text>

          </View>

          {/* Formulaire */}
          <View style={styles.formulaire}>

            <ChampMotDePasse
              label="Mot de passe actuel"
              valeur={motDePasseActuel}
              onChangeText={handleChangerMotDePasseActuel}
            />

            <ChampMotDePasse
              label="Nouveau mot de passe"
              valeur={nouveauMotDePasse}
              onChangeText={handleChangerNouveauMotDePasse}
            />

            <ChampMotDePasse
              label="Confirmer le nouveau mot de passe"
              valeur={confirmationMotDePasse}
              onChangeText={handleChangerConfirmation}
            />

            {/* Message d'erreur */}
            {messageErreur !== '' && (
              <Text style={styles.messageErreur}>
                {messageErreur}
              </Text>
            )}

            {/* Bouton */}
            <Pressable
              style={({ pressed }) => [
                styles.bouton,
                (pressed || enregistrement) && styles.boutonAppuye,
              ]}
              onPress={handleModifierMotDePasse}
              disabled={enregistrement}
            >
              <Text style={styles.texteBouton}>
                {enregistrement
                  ? 'Mise à jour...'
                  : 'Mettre à jour le mot de passe'}
              </Text>
            </Pressable>

          </View>
        </View>

      </ScrollView>

      {/* Message de succès */}
      <MessageSucces
        visible={messageVisible}
        onFermer={() => setMessageVisible(false)}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,

    backgroundColor: '#F3F4F6',
  },

  scroll: {
    flex: 1,
  },

  contenu: {
    paddingHorizontal: 24,
    paddingVertical: 32,

    gap: 32,

    paddingBottom: 120,
  },

  /*
   * Carte blanche principale
   */
  carte: {
    width: '100%',

    padding: 24,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#F3F4F6',

    gap: 32,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    elevation: 1,
  },

  /*
   * Introduction
   */
  introduction: {
    width: '100%',

    alignItems: 'center',

    gap: 16,
  },

  conteneurIcone: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#FFF7ED',

    justifyContent: 'center',
    alignItems: 'center',
  },

  description: {
    color: '#6B7280',

    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,

    textAlign: 'center',
  },

  /*
   * Formulaire
   */
  formulaire: {
    width: '100%',

    gap: 24,
  },

  /*
   * Message d'erreur
   */
  messageErreur: {
    color: '#EF4444',

    fontSize: 14,
    lineHeight: 20,

    textAlign: 'center',
  },

  /*
   * Bouton orange
   */
  bouton: {
    width: '100%',
    height: 56,

    marginTop: 0,

    backgroundColor: '#F5821F',

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#FED7AA',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  texteBouton: {
    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,

    textAlign: 'center',
  },

  boutonAppuye: {
    opacity: 0.75,
  },
});