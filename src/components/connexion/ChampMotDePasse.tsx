import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

// Props reçues par le composant.
interface ChampMotDePasseProps {
  // Valeur actuelle du mot de passe.
  value: string;

  // Fonction appelée lorsque l'utilisateur
  // modifie le mot de passe.
  onChangeText: (text: string) => void;

  // Message d'erreur à afficher sous le champ.
  erreur?: string;
}

export function ChampMotDePasse({
  value,
  onChangeText,
  erreur,
}: ChampMotDePasseProps) {
  // Permet de contrôler l'affichage du mot de passe.
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  return (
    <View style={styles.conteneur}>
      <Text style={styles.label}>Mot de passe</Text>

      <View style={styles.champ}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={COLORS.steelBlue}
          style={styles.icone}
        />

        <TextInput
          style={styles.input}

          // Valeur contrôlée par l'écran Connexion.
          value={value}

          // Met à jour le mot de passe dans l'écran Connexion.
          onChangeText={onChangeText}

          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"

          // Si motDePasseVisible est false,
          // le mot de passe est masqué.
          secureTextEntry={!motDePasseVisible}
        />

        <Pressable
          style={styles.boutonVisibilite}
          onPress={() =>
            setMotDePasseVisible(!motDePasseVisible)
          }
        >
          <Text style={styles.iconeVisibilite}>
            {motDePasseVisible ? 'Masquer' : 'Voir'}
          </Text>
        </Pressable>
      </View>
      {erreur ? (
        <Text style={styles.texteErreur}>
          {erreur}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    gap: 8,
  },

  label: {
    paddingLeft: 4,
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '600',
  },

  champ: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  icone: {
    width: 24,
    marginRight: 8,
  },

  input: {
    flex: 1,
    minHeight: 44,
    color: COLORS.text,
    fontSize: 16,
  },

  boutonVisibilite: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeVisibilite: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  texteErreur: {
  paddingLeft: 4,
  color: '#C0392B',
  fontSize: 12,
  fontWeight: '500',
},
});