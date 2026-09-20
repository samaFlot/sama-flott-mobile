import {
  Ionicons,
} from '@expo/vector-icons';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface ChampInformationProps {
  label: string;
  valeur: string;
  placeholder?: string;
  typeIcone: keyof typeof Ionicons.glyphMap;
  clavier?: 'default' | 'phone-pad';
  onChangeText: (texte: string) => void;
}

export function ChampInformation({
  label,
  valeur,
  placeholder,
  typeIcone,
  clavier = 'default',
  onChangeText,
}: ChampInformationProps) {
  return (
    <View style={styles.conteneur}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.zoneChamp}>
        <View style={styles.zoneIcone}>
          <Ionicons
            name={typeIcone}
            size={18}
            color="#9CA3AF"
          />
        </View>

        <TextInput
          value={valeur}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={clavier}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    width: '100%',
    minHeight: 80,
  },

  label: {
    marginLeft: 4,
    marginBottom: 7,

    color: '#4B5563',

    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,

    letterSpacing: -0.2,
  },

  zoneChamp: {
    height: 48,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    borderRadius: 12,

    flexDirection: 'row',
    alignItems: 'center',

    overflow: 'hidden',
  },

  zoneIcone: {
    width: 44,
    height: 48,

    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flex: 1,

    height: 48,

    paddingHorizontal: 4,
    paddingVertical: 0,

    color: '#111827',

    fontSize: 16,
    fontWeight: '400',
  },
});