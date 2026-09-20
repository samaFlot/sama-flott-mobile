import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ChevronRight } from "lucide-react-native";

interface CarteOptionProfilProps {
  titre: string;
  icone: React.ReactNode;
  onPress: () => void;
}

export default function CarteOptionProfil({
  titre,
  icone,
  onPress,
}: CarteOptionProfilProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.carte,
        pressed && styles.carteAppuyee,
      ]}
      onPress={onPress}
    >
      {/* Icône */}
      <View style={styles.conteneurIcone}>
        {icone}
      </View>

      {/* Titre */}
      <Text style={styles.titre}>
        {titre}
      </Text>

      {/* Flèche */}
      <ChevronRight
        size={20}
        color="#9CA3AF"
        strokeWidth={2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    width: "100%",
    minHeight: 72,

    padding: 16,

    backgroundColor: "#FFFFFF",
    borderRadius: 16,

    flexDirection: "row",
    alignItems: "center",

    gap: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    elevation: 1,
  },

  carteAppuyee: {
    opacity: 0.7,
  },

  conteneurIcone: {
    width: 40,
    height: 40,

    borderRadius: 12,
    backgroundColor: "#F9FAFB",

    justifyContent: "center",
    alignItems: "center",
  },

  titre: {
    flex: 1,

    color: "#111827",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
});