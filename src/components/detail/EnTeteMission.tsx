import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProprietesEnTeteMission {
  nomDemandeur: string;
  onRetour?: () => void;
}

export function EnTeteMission({
  nomDemandeur,
  onRetour,
}: ProprietesEnTeteMission) {
  return (
    <View style={styles.conteneur}>
      <Pressable
        style={styles.boutonRetour}
        onPress={onRetour}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color="#0F2A4A"
        />
      </Pressable>

      <View style={styles.conteneurTitre}>
        <Text
          style={styles.titre}
          numberOfLines={1}
        >
          {nomDemandeur}
        </Text>
      </View>

      <View style={styles.espaceDroit} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F7F8FA',
  },

  boutonRetour: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#0F2A4A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },

  conteneurTitre: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  titre: {
    color: '#0F2A4A',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  espaceDroit: {
    width: 40,
    height: 40,
  },
});