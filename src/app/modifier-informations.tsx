import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import EnteteProfil from '@/components/profil/EnteteProfil';
import { MessageSucces } from '@/components/modification-profil/MessageSucces';
import { ChampInformation } from '@/components/modification-profil/ChampInformation';

import { useProfil } from '@/hooks/useProfil';
import { PhotoProfil } from '@/types/profil';

export default function ModifierInformations() {
  const router = useRouter();

  // Profil de l'agent et fonction de modification
  const { profil, chargement, erreur, mettreAJourProfil } = useProfil();

  // Champs du formulaire
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');

  // Nouvelle photo choisie (null = on garde la photo actuelle)
  const [photoChoisie, setPhotoChoisie] = useState<PhotoProfil | null>(null);

  const [enregistrement, setEnregistrement] = useState(false);
  const [messageErreur, setMessageErreur] = useState('');
  const [messageVisible, setMessageVisible] = useState(false);

  /*
   * Remplir le formulaire avec le profil
   * dès qu'il est chargé (et après chaque enregistrement).
   */
  useEffect(() => {
    if (!profil) {
      return;
    }

    setPrenom(profil.first_name || '');
    setNom(profil.last_name || '');
    setTelephone(profil.telephone || '');
  }, [profil]);

  // Photo affichée : la nouvelle si elle existe, sinon l'actuelle
  const photo =
    photoChoisie?.uri ||
    profil?.photo ||
    'https://placehold.co/176x176';

  const handleRetour = () => {
    router.back();
  };

  /*
   * Quand l'utilisateur écrit dans un champ :
   * 1. on enregistre le texte
   * 2. on efface le message d'erreur
   */
  const handleChangerPrenom = (texte: string) => {
    setPrenom(texte);
    setMessageErreur('');
  };

  const handleChangerNom = (texte: string) => {
    setNom(texte);
    setMessageErreur('');
  };

  const handleChangerTelephone = (texte: string) => {
    setTelephone(texte);
    setMessageErreur('');
  };

  /*
   * Ouvre la galerie pour choisir une photo.
   */
  const handleChangerPhoto = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Autorisation refusée',
        "Autorisez l'accès à vos photos pour changer la photo de profil."
      );
      return;
    }

    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    // L'utilisateur a annulé la sélection
    if (resultat.canceled) {
      return;
    }

    const image = resultat.assets[0];

    setPhotoChoisie({
      uri: image.uri,
      name: image.fileName || image.uri.split('/').pop() || 'photo.jpg',
      type: image.mimeType || 'image/jpeg',
    });
  };

  /*
   * Enregistre les modifications dans Django,
   * puis affiche le message de succès.
   */
  const handleEnregistrer = async () => {
    setMessageErreur('');

    // Vérifier les champs obligatoires
    if (!prenom.trim() || !nom.trim()) {
      setMessageErreur('Le prénom et le nom sont obligatoires.');
      return;
    }

    try {
      setEnregistrement(true);

      await mettreAJourProfil({
        first_name: prenom.trim(),
        last_name: nom.trim(),
        telephone: telephone.trim(),
        photo: photoChoisie || undefined,
      });

      // La photo est enregistrée : on n'a plus de photo "en attente"
      setPhotoChoisie(null);

      // Message de succès pendant 3 secondes
      setMessageVisible(true);

      setTimeout(() => {
        setMessageVisible(false);
      }, 3000);
    } catch (error) {
      // Erreur affichée dans la console pour t'aider à comprendre
      console.error('Erreur modification du profil :', error);

      // Message simple affiché à l'utilisateur
      setMessageErreur(
        'Impossible de modifier vos informations. Veuillez réessayer.'
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

      {/* En-tête */}
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

        {/* Chargement du profil */}
        {chargement && !profil && (
          <ActivityIndicator size="large" color="#F5821F" />
        )}

        {/* Erreur de chargement */}
        {erreur && !profil && (
          <Text style={styles.messageErreur}>
            {erreur}
          </Text>
        )}

        {profil && (
          <>
            {/* Photo de profil */}
            <View style={styles.zonePhoto}>

              <View style={styles.conteneurPhoto}>

                <Image
                  source={{ uri: photo }}
                  style={styles.photo}
                />

                <Pressable
                  style={styles.boutonPhoto}
                  onPress={handleChangerPhoto}
                  accessibilityLabel="Changer la photo de profil"
                >
                  <Ionicons
                    name="camera"
                    size={16}
                    color="#FFFFFF"
                  />
                </Pressable>

              </View>

              <Pressable
                onPress={handleChangerPhoto}
              >
                <Text style={styles.texteChangerPhoto}>
                  Changer la photo de profil
                </Text>
              </Pressable>

            </View>

            {/* Champs */}
            <View style={styles.zoneChamps}>

              <ChampInformation
                label="Prénom"
                valeur={prenom}
                typeIcone="person-outline"
                onChangeText={handleChangerPrenom}
              />

              <ChampInformation
                label="Nom"
                valeur={nom}
                typeIcone="person-outline"
                onChangeText={handleChangerNom}
              />

              <ChampInformation
                label="Téléphone"
                valeur={telephone}
                typeIcone="call-outline"
                clavier="phone-pad"
                onChangeText={handleChangerTelephone}
              />

              {/* Erreur d'enregistrement */}
              {messageErreur !== '' && (
                <Text style={styles.messageErreur}>
                  {messageErreur}
                </Text>
              )}

              {/* Bouton enregistrer */}
              <Pressable
                style={({ pressed }) => [
                  styles.boutonEnregistrer,
                  (pressed || enregistrement) && styles.boutonAppuye,
                ]}
                onPress={handleEnregistrer}
                disabled={enregistrement}
              >
                <Text style={styles.texteBouton}>
                  {enregistrement
                    ? 'Enregistrement...'
                    : 'Enregistrer les modifications'}
                </Text>
              </Pressable>

            </View>
          </>
        )}

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

    backgroundColor: '#F9FAFB',
  },

  scroll: {
    flex: 1,
  },

  contenu: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 128,

    gap: 32,
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
   * Photo
   */
  zonePhoto: {
    width: '100%',

    alignItems: 'center',
  },

  conteneurPhoto: {
    width: 96,
    height: 96,

    position: 'relative',

    justifyContent: 'center',
    alignItems: 'center',
  },

  photo: {
    width: 96,
    height: 96,

    borderRadius: 48,

    borderWidth: 2,
    borderColor: '#F5821F',
  },

  boutonPhoto: {
    position: 'absolute',

    right: 0,
    bottom: 0,

    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: '#F5821F',

    borderWidth: 2,
    borderColor: '#FFFFFF',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  texteChangerPhoto: {
    marginTop: 12,

    color: '#F5821F',

    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,

    letterSpacing: -0.2,
  },

  /*
   * Formulaire
   */
  zoneChamps: {
    width: '100%',

    gap: 24,
  },

  /*
   * Bouton
   */
  boutonEnregistrer: {
    width: '100%',
    height: 56,

    marginTop: 0,

    backgroundColor: '#F5821F',

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 2,

    shadowColor: '#F5821F',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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