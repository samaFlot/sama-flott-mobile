import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS } from '@/constants/colors';

// Props reçues par le composant.
interface ProprietesBoutonConnexion {
  // Fonction exécutée lorsque l'utilisateur
  // appuie sur le bouton.
  onConnexion: () => void;

  // Indique si la connexion est actuellement en cours.
  loading: boolean;
}

export function BoutonConnexion({
  onConnexion,
  loading,
}: ProprietesBoutonConnexion) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.bouton,

        // Change légèrement l'apparence
        // lorsque le bouton est pressé.
        pressed && styles.boutonPresse,

        // Rend le bouton moins visible pendant
        // le chargement.
        loading && styles.boutonChargement,
      ]}
      // Désactive le bouton pendant la connexion
      // pour éviter plusieurs requêtes.
      disabled={loading}

      // Appelle la fonction de connexion
      // fournie par l'écran Connexion.
      onPress={onConnexion}
    >
      <Text style={styles.texte}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Text>

      {!loading && (
        <Text style={styles.fleche}>→</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 20,

    shadowColor: COLORS.orange,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  boutonPresse: {
    opacity: 0.85,
  },

  // Apparence du bouton pendant le chargement.
  boutonChargement: {
    opacity: 0.7,
  },

  texte: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },

  fleche: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
});