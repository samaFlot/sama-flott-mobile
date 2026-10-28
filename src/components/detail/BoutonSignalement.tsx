import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProprietesBoutonSignalement {
  onAppui?: () => void;
}

export function BoutonSignalement({
  onAppui,
}: ProprietesBoutonSignalement) {

  return (
    <View style={styles.conteneur}>
      <Pressable
        style={({ pressed }) => [
          styles.bouton,
          pressed && styles.boutonPresse,
        ]}
        onPress={onAppui}
      >
        <Ionicons
          name="warning-outline"
          size={20}
          color="#F5821F"
        />

        <Text style={styles.texte}>
          Faire un signalement
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    paddingTop: 4,
  },

  bouton: {
    minHeight: 52,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    borderWidth: 1.5,
    borderColor: '#F5821F',

    paddingHorizontal: 20,
    gap: 8,
  },

  boutonPresse: {
    opacity: 0.7,
  },

  texte: {
    color: '#F5821F',
    fontSize: 15,
    fontWeight: '700',
  },
});
