import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import fondConnexion from '../../../assets/images/fond-connexion.png';
import logoSamaFlott from '../../../assets/images/logo-sama-flott.png';

import { COLORS } from '@/constants/colors';

export function EnteteConnexion() {
  return (
    <View style={styles.conteneur}>
      <ImageBackground
        source={fondConnexion}
        style={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(15, 42, 74, 0.95)',
            'rgba(15, 42, 74, 0.40)',
            'rgba(15, 42, 74, 0.10)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.degrade}
        >
          <View style={styles.logoBloc}>
            <Image
              source={logoSamaFlott}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.espaceAgent}>
              ESPACE AGENT
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 0.95,
    minHeight: 300,
  },

  image: {
    flex: 1,
  },

  degrade: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 32,
  },

  logoBloc: {
    alignItems: 'center',
  },


  logo: {
  width: 180,
  height: 60,
},

  espaceAgent: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});