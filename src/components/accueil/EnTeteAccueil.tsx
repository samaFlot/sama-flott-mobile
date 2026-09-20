import { Image, StyleSheet, Text, View } from 'react-native';

import { ProfilUtilisateur } from '@/types/profil';
import { StatistiqueMissions } from './StatistiqueMissions';

interface ProprietesEnTeteAccueil {
  profil: ProfilUtilisateur;
  missionsEnCours: number;
  totalMissions: number;
}

export function EnTeteAccueil({
  profil,
  missionsEnCours,
  totalMissions,
}: ProprietesEnTeteAccueil) {
  return (
    <View style={styles.conteneur}>
      <View style={styles.lignePrincipale}>
        <View>
          <Text style={styles.bonjour}>
            Bonjour,
          </Text>

          <Text style={styles.nomAgent}>
            {profil.first_name} {profil.last_name}
          </Text>
        </View>

        <View style={styles.avatarConteneur}>
          {profil.photo ? (
            <Image
              source={{ uri: profil.photo }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarSansPhoto}>
              <Text style={styles.initiales}>
                {profil.first_name.charAt(0)}
                {profil.last_name.charAt(0)}
              </Text>
            </View>
          )}

          <View style={styles.indicateurEnLigne} />
        </View>
      </View>

      <StatistiqueMissions
        missionsEnCours={missionsEnCours}
        totalMissions={totalMissions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    backgroundColor: '#0F2A4A',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 20,
  },

  lignePrincipale: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bonjour: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },

  nomAgent: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  avatarConteneur: {
    position: 'relative',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F5821F',
  },

  avatarSansPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C5C8A',
    borderWidth: 2,
    borderColor: '#F5821F',
  },

  initiales: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  indicateurEnLigne: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2E9E6B',
    borderWidth: 2,
    borderColor: '#0F2A4A',
  },
});