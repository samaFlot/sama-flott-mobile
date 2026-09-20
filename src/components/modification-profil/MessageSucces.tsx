import { Ionicons } from '@expo/vector-icons';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface MessageSuccesProps {
  visible: boolean;
  onFermer: () => void;
}

export function MessageSucces({
  visible,
  onFermer,
}: MessageSuccesProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.conteneur}>
      <View style={styles.zoneMessage}>
        <View style={styles.iconeSucces}>
          <Ionicons
            name="checkmark"
            size={17}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.message}>
          Informations mises à jour
        </Text>
      </View>

      <Pressable
        style={styles.boutonFermer}
        onPress={onFermer}
      >
        <Ionicons
          name="close"
          size={16}
          color="rgba(255,255,255,0.6)"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    position: 'absolute',

    left: 16,
    right: 16,
    bottom: 16,

    minHeight: 64,

    paddingHorizontal: 20,
    paddingVertical: 16,

    backgroundColor: '#111827',

    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    elevation: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },

  zoneMessage: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeSucces: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: '#22C55E',

    justifyContent: 'center',
    alignItems: 'center',
  },

  message: {
    flex: 1,

    marginLeft: 12,

    color: '#FFFFFF',

    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },

  boutonFermer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});