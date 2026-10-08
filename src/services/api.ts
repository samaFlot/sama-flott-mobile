import axios from "axios";
//On installe AsyncStorage parce qu'on a besoin de conserver le token JWT après la connexion.
//AsyncStorage est une petite zone de stockage persistante sur le téléphone.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Création d'une instance Axios dédiée à notre API Django.
const api = axios.create({
  // Adresse de base de notre backend Django.192.168.1.16 ,  192.168.1.121
  baseURL: "http://192.168.1.16:8000/api",

  // Temps maximum d'attente d'une requête.
  timeout: 30000,
});

// Intercepteur exécuté AVANT chaque requête Axios.
api.interceptors.request.use(
  async (config) => {
    // On récupère le token d'accès enregistré
    // après la connexion.
    const token = await AsyncStorage.getItem("accessToken");

    // Si un token existe, on l'ajoute dans
    // l'en-tête Authorization.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // On retourne la configuration modifiée.
    return config;
  },
  (error) => {
    // Si une erreur se produit avant l'envoi
    // de la requête, on la transmet.
    return Promise.reject(error);
  }
);

export default api;