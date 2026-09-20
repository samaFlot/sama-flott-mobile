import { StyleSheet, Text, View } from 'react-native';

interface ProprietesDescriptionMission {
  description: string;
}

export function DescriptionMission({
  description,
}: ProprietesDescriptionMission) {
  return (
    <View style={styles.conteneur}>
      <Text style={styles.libelle}>
        DESCRIPTION DE LA MISSION
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    paddingTop: 24,

    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',

    gap: 8,
  },

  libelle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  description: {
    color: '#0F2A4A',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
  },
});