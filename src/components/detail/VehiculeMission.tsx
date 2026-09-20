import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface ProprietesVehiculeMission {
  vehicule: string;
  typeVehicule?: string;
}

export function VehiculeMission({
  vehicule,
  typeVehicule,
}: ProprietesVehiculeMission) {
  return (
    <View style={styles.conteneur}>
      <View style={styles.iconeConteneur}>
        <MaterialCommunityIcons
          name="truck-outline"
          size={20}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.contenu}>
        <Text style={styles.libelle}>
          VÉHICULE AFFECTÉ
        </Text>

        <View style={styles.ligneVehicule}>
          <Text style={styles.vehicule}>
            {vehicule}
          </Text>

          {typeVehicule && (
            <Text style={styles.typeVehicule}>
              ({typeVehicule})
            </Text>
          )}
        </View>
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

  iconeConteneur: {
    width: 40,
    height: 40,
    borderRadius: 10,

    backgroundColor: '#0F2A4A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  contenu: {
    flex: 1,
    paddingLeft: 16,
  },

  libelle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  ligneVehicule: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },

  vehicule: {
    color: '#0F2A4A',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },

  typeVehicule: {
    marginLeft: 8,
    color: '#2C5C8A',
    fontSize: 12,
  },
});