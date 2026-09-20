import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface BarreNavigationProps {
  pageActive: 'missions' | 'profil';
  onMissions: () => void;
  onProfil: () => void;
}

export function BarreNavigation({
  pageActive,
  onMissions,
  onProfil,
}: BarreNavigationProps) {
  const missionsActive = pageActive === 'missions';
  const profilActive = pageActive === 'profil';

  return (
    <View style={styles.conteneur}>

      {/* Missions */}
      <Pressable
        style={styles.element}
        onPress={onMissions}
      >
        <Ionicons
          name={
            missionsActive
              ? 'clipboard'
              : 'clipboard-outline'
          }
          size={22}
          color={
            missionsActive
              ? '#F5821F'
              : '#9CA3AF'
          }
        />

        <Text
          style={
            missionsActive
              ? styles.texteActif
              : styles.texte
          }
        >
          Missions
        </Text>
      </Pressable>

      {/* Profil */}
      <Pressable
        style={styles.element}
        onPress={onProfil}
      >
        <Ionicons
          name={
            profilActive
              ? 'person'
              : 'person-outline'
          }
          size={22}
          color={
            profilActive
              ? '#F5821F'
              : '#9CA3AF'
          }
        />

        <Text
          style={
            profilActive
              ? styles.texteActif
              : styles.texte
          }
        >
          Profil
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    height: 80,

    paddingHorizontal: 32,
    paddingBottom: 14,

    backgroundColor: '#FFFFFF',

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  element: {
    width: 80,

    alignItems: 'center',
    justifyContent: 'center',

    gap: 4,
  },

  texteActif: {
    color: '#F5821F',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },

  texte: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});