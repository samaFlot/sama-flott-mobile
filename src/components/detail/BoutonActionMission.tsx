import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StatutMission } from '@/types/mission';

interface ProprietesBoutonActionMission {
  statut: StatutMission;
  onAppui?: () => void;

   // Indique si l'Agent a déjà une autre mission en cours.
  // Dans ce cas, il ne peut pas démarrer cette mission.
  demarrageDesactive?: boolean;
}

export function BoutonActionMission({
  statut,
  onAppui,
  demarrageDesactive = false,
}: ProprietesBoutonActionMission) {

  if (statut === 'TERMINEE' || statut === 'ANNULEE') {
    return null;
  }

  const estEnCours = statut === 'EN_COURS';

  //Est-ce que la mission est encore à venir ? et y a-t-il déjà une autre mission en cours ?
  //si ses deux condition sont verifer boutonDesactive = true
  const boutonDesactive = statut === 'PREVU' && demarrageDesactive;

  const texte = estEnCours
    ? 'Terminer la mission'
    : 'Démarrer la mission';

  const nomIcone = estEnCours
    ? 'checkmark-circle-outline'
    : 'play-circle-outline';

  return (
    <View style={styles.conteneur}>
      <Pressable
      //pressed est fourni automatiquement par Pressable dans sa fonction de style
      //il sert à savoir est-ce que l'utilisateur est actuellement en train d'appuyer sur le Pressable
        style={({ pressed }) => [
          styles.bouton,
          boutonDesactive && styles.boutonDesactive,
          //React Native donne automatiquement à pressed une valeur :
          //true  → l'utilisateur appuie actuellement sur le bouton
          //false → l'utilisateur n'appuie pas dessus
          //donc on verifie si l'utilisateur appuie sur le bouton ET le bouton n'est pas désactivé.
          pressed && !boutonDesactive && styles.boutonPresse,
        ]}
        //Si le bouton est désactivé, ne fais rien quand on appuie. Sinon, utilise onAppui
        onPress={boutonDesactive ? undefined : onAppui}
        //La propriété disabled du bouton prend la même valeur que boutonDesactive
        disabled={boutonDesactive}
      >
        <Text style={styles.texte}>
          {texte}
        </Text>

        <Ionicons
          name={nomIcone}
          size={20}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#F7F8FA',
  },

  bouton: {
    minHeight: 56,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 16,

    backgroundColor: '#F5821F',

    paddingHorizontal: 20,
    gap: 8,

    shadowColor: '#F5821F',
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

  texte: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

   boutonDesactive: {
    opacity: 0.45,
  },
});