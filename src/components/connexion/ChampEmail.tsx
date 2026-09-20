import { StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

// Props attendues par le composant.
interface ChampEmailProps {
  // Valeur actuelle du champ email.
  value: string;

  // Fonction appelée lorsque l'utilisateur
  // modifie le contenu du champ.
  onChangeText: (text: string) => void;

  // Message d'erreur à afficher sous le champ.
  erreur?: string;
}

export function ChampEmail({
  value,
  onChangeText,
   erreur,
}: ChampEmailProps) {
  return (
    <View style={styles.conteneur}>
      <Text style={styles.label}>Email</Text>

      <View style={styles.champ}>
        <Ionicons
          name="mail-outline"
          size={20}
          color={COLORS.steelBlue}
          style={styles.icone}
        />

        <TextInput
          style={styles.input}

          // Valeur contrôlée par l'écran Connexion.
          value={value}

          // Met à jour l'email dans l'écran Connexion.
          onChangeText={onChangeText}

          placeholder="exemple@email.com"
          placeholderTextColor="#9CA3AF"

          // Affiche le clavier adapté aux emails.
          keyboardType="email-address"

          // Empêche la première lettre d'être automatiquement
          // transformée en majuscule.
          autoCapitalize="none"

          // Désactive les suggestions automatiques.
          autoCorrect={false}
        />
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
    paddingHorizontal: 16,
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
    color: COLORS.steelBlue,
    fontSize: 18,
    textAlign: 'center',
  },

  input: {
    flex: 1,
    minHeight: 44,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },

  texteErreur: {
  paddingLeft: 4,
  color: '#C0392B',
  fontSize: 12,
  fontWeight: '500',
},
});