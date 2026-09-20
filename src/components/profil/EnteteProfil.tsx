import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";

interface EnteteProfilProps {
  onRetour: () => void;
}

export default function EnteteProfil({
  onRetour,
}: EnteteProfilProps) {
  return (
    <View style={styles.conteneur}>
      <Pressable
        style={styles.boutonRetour}
        onPress={onRetour}
        accessibilityLabel="Retour"
      >
        <ArrowLeft
          size={20}
          color="#111827"
          strokeWidth={2}
        />
      </Pressable>

      <Text style={styles.titre}>
        Profil
      </Text>

      {/* Espace invisible pour garder le titre centré */}
      <View style={styles.espaceDroite} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  boutonRetour: {
    width: 44,
    height: 44,

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",
  },

  titre: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 28,
    letterSpacing: -0.3,
  },

  espaceDroite: {
    width: 44,
    height: 44,
  },
});