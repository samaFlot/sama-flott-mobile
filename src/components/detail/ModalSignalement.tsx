import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState } from 'react';

interface ProprietesModalSignalement {
  visible: boolean;
  missionId: number;
  chargement: boolean;
  onFermer: () => void;
  onEnvoyer: (donnees: {
    mission: number;
    type_probleme: string;
    description: string;
    photo?: {
      uri: string;
      name: string;
      type: string;
    } | null;
  }) => Promise<void>;
}

export function ModalSignalement({
  visible,
  missionId,
  chargement,
  onFermer,
  onEnvoyer,
}: ProprietesModalSignalement) {

  const [typeProbleme, setTypeProbleme] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const choisirPhoto = async () => {
    const autorisation =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!autorisation.granted) {
      Alert.alert(
        'Autorisation nécessaire',
        'L’accès à vos photos est nécessaire pour ajouter une photo au signalement.'
      );
      return;
    }

    const resultat =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

    if (resultat.canceled) {
      return;
    }

    const image = resultat.assets[0];

    setPhoto({
      uri: image.uri,
      name: image.fileName ?? 'signalement.jpg',
      type: image.mimeType ?? 'image/jpeg',
    });
  };

  const envoyer = async () => {
    if (!typeProbleme.trim()) {
      Alert.alert(
        'Information manquante',
        'Veuillez indiquer le type de problème.'
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        'Information manquante',
        'Veuillez décrire le problème.'
      );
      return;
    }

    await onEnvoyer({
      mission: missionId,
      type_probleme: typeProbleme.trim(),
      description: description.trim(),
      photo,
    });

    setTypeProbleme('');
    setDescription('');
    setPhoto(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onFermer}
    >
      <View style={styles.fond}>

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.conteneurClavier}
        >

          <View style={styles.modal}>

            <View style={styles.entete}>
              <Text style={styles.titre}>
                Faire un signalement
              </Text>

              <Pressable onPress={onFermer}>
                <Ionicons
                  name="close"
                  size={26}
                  color="#333333"
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.contenu}
            >

              <Text style={styles.label}>
                Type de problème
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Ex : Pneu crevé, problème moteur..."
                value={typeProbleme}
                onChangeText={setTypeProbleme}
              />

              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.inputDescription,
                ]}
                placeholder="Décrivez le problème rencontré..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />

              <Pressable
                style={styles.boutonPhoto}
                onPress={choisirPhoto}
              >
                <Ionicons
                  name="camera-outline"
                  size={22}
                  color="#F5821F"
                />

                <Text style={styles.textePhoto}>
                  {photo
                    ? 'Changer la photo'
                    : 'Ajouter une photo'}
                </Text>
              </Pressable>

              {photo && (
                <View style={styles.apercu}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.image}
                  />

                  <Pressable
                    style={styles.supprimerPhoto}
                    onPress={() => setPhoto(null)}
                  >
                    <Ionicons
                      name="close-circle"
                      size={26}
                      color="#E53935"
                    />
                  </Pressable>
                </View>
              )}

              <Pressable
                style={[
                  styles.boutonEnvoyer,
                  chargement &&
                    styles.boutonDesactive,
                ]}
                onPress={envoyer}
                disabled={chargement}
              >
                <Text style={styles.texteEnvoyer}>
                  {chargement
                    ? 'Envoi...'
                    : 'Envoyer le signalement'}
                </Text>
              </Pressable>

            </ScrollView>

          </View>

        </KeyboardAvoidingView>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fond: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  conteneurClavier: {
    maxHeight: '90%',
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  entete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  titre: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },

  contenu: {
    gap: 12,
    paddingBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },

  inputDescription: {
    height: 100,
  },

  boutonPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F5821F',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 4,
  },

  textePhoto: {
    color: '#F5821F',
    fontWeight: '600',
  },

  apercu: {
    position: 'relative',
    marginTop: 4,
  },

  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },

  supprimerPhoto: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },

  boutonEnvoyer: {
    backgroundColor: '#F5821F',
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  boutonDesactive: {
    opacity: 0.5,
  },

  texteEnvoyer: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
