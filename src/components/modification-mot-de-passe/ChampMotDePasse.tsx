import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface ChampMotDePasseProps {
  label: string;
  valeur: string;
  onChangeText: (texte: string) => void;
}

export function ChampMotDePasse({
  label,
  valeur,
  onChangeText,
}: ChampMotDePasseProps) {
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  return (
    <View style={styles.conteneur}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.zoneChamp}>
        <TextInput
          value={valeur}
          onChangeText={onChangeText}
          secureTextEntry={!motDePasseVisible}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          style={styles.boutonVisibilite}
          onPress={() =>
            setMotDePasseVisible(!motDePasseVisible)
          }
          accessibilityLabel={
            motDePasseVisible
              ? 'Masquer le mot de passe'
              : 'Afficher le mot de passe'
          }
        >
          <Ionicons
            name={
              motDePasseVisible
                ? 'eye-off-outline'
                : 'eye-outline'
            }
            size={20}
            color="#9CA3AF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    width: '100%',
    gap: 8,
  },

  label: {
    color: '#18181B',

    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  zoneChamp: {
    width: '100%',
    height: 48,

    paddingLeft: 16,
    paddingRight: 8,

    backgroundColor: '#F9FAFB',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 12,

    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,

    height: 48,

    paddingVertical: 0,

    color: '#111827',

    fontSize: 16,
    fontWeight: '400',
  },

  boutonVisibilite: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },
});