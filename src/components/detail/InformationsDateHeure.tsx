import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface ProprietesInformationsDateHeure {
  date: string;
  heure: string;
}

export function InformationsDateHeure({
  date,
  heure,
}: ProprietesInformationsDateHeure) {
  return (
    <View style={styles.conteneur}>
      <Information
        icone="calendar-outline"
        libelle="DATE"
        valeur={date}
      />

      <View style={styles.separateur} />

      <Information
        icone="time-outline"
        libelle="HEURE"
        valeur={heure}
      />
    </View>
  );
}

interface ProprietesInformation {
  icone: 'calendar-outline' | 'time-outline';
  libelle: string;
  valeur: string;
}

function Information({
  icone,
  libelle,
  valeur,
}: ProprietesInformation) {
  return (
    <View style={styles.information}>
      <Ionicons
        name={icone}
        size={18}
        color="#2C5C8A"
      />

      <View style={styles.texte}>
        <Text style={styles.libelle}>
          {libelle}
        </Text>

        <Text style={styles.valeur}>
          {valeur}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  information: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  texte: {
    flex: 1,
    paddingLeft: 12,
  },

  libelle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  valeur: {
    color: '#0F2A4A',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  separateur: {
    width: 1,
    height: 36,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
  },
});