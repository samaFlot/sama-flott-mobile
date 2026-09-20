import { StyleSheet, Text, View } from 'react-native';

interface ProprietesStatistiqueMissions {
    missionsEnCours: number
    totalMissions: number;
}

export function StatistiqueMissions({
    missionsEnCours,
    totalMissions,
}: ProprietesStatistiqueMissions) {
  return (
    <View style={styles.conteneur}>
      <View style={styles.statistique}>
        <Text style={styles.label}>MISSIONS EN COURS</Text>
        <Text style={styles.nombre}>{missionsEnCours}</Text>
      </View>

      <View style={styles.separateur} />

      <View style={styles.statistique}>
        <Text style={styles.label}>TOTAL MISSIONS</Text>
        <Text style={styles.nombre}>{totalMissions}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 12,
  },

  statistique: {
    flex: 1,
    alignItems: 'center',
  },

  label: {
    marginBottom: 4,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  nombre: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  separateur: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});