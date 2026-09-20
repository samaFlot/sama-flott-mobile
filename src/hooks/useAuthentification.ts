import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { login, LoginResponse } from "../services/authentification";

// Hook qui gère l'authentification de l'utilisateur.
export const useAuthentification = () => {
  // Indique si la connexion est en cours.
  const [loading, setLoading] = useState(false);

  // Contient le message d'erreur en cas d'échec.
  const [error, setError] = useState<string | null>(null);

  // Contient les informations de l'utilisateur connecté.
  const [user, setUser] = useState<LoginResponse | null>(null);

  // Fonction utilisée pour connecter l'utilisateur.
  const authentifier = async (
    email: string,
    password: string
  ) => {
    try {
      // Supprime l'ancienne erreur.
      setError(null);

      // Indique que la connexion est en cours.
      setLoading(true);

      // Appelle notre service d'authentification.
      const response = await login({
        email,
        password,
      });

      // Affiche la réponse complète de Django
      // dans la console Expo.
      console.log('Réponse connexion :', response);

      // Sauvegarde le token d'accès.
      // Axios pourra ensuite le récupérer pour
      // les endpoints protégés.
      await AsyncStorage.setItem(
        "accessToken",
        response.access
      );

      // Sauvegarde le refresh token.
      // Il servira plus tard à renouveler
      // l'access token lorsqu'il expirera.
      await AsyncStorage.setItem(
        "refreshToken",
        response.refresh
      );

      // Sauvegarde les informations de l'utilisateur
      // dans l'état du hook.
      setUser(response);

      // Retourne la réponse complète.
      return response;

    } catch (error) {
      // Enregistre un message d'erreur.
      setError("Email ou mot de passe incorrect.");

       // Affiche l'erreur réelle dans la console.
      console.error(
        'Erreur authentification :',
        error)

        // Vérifie si l'erreur vient d'Axios.
      if (axios.isAxiosError(error)) {

        // Si Django a envoyé une réponse,
        // on affiche son contenu.
        if (error.response) {
          console.error(
            'Status Django :',
            error.response.status
          );

          console.error(
            'Réponse Django :',
            error.response.data
          );
        }

        // Si aucune réponse n'a été reçue,
        // il peut s'agir d'un problème réseau.
        if (!error.response) {
          setError(
            'Impossible de contacter le serveur.'
          );
        } else {
          setError(
            'Email ou mot de passe incorrect.'
          );
        }

        // Indique que la connexion a échoué.
        return null;
        
      }

    } finally {
      // Arrête le chargement dans tous les cas.
      setLoading(false);
    }
  };

  // Retourne les éléments nécessaires
  // aux écrans qui utilisent le hook.
  return {
    authentifier,
    loading,
    error,
    user,
  };
};