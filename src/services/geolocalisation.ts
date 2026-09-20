import api from './api';
import * as Location from 'expo-location';


/**
 * Demande à l'Agent l'autorisation d'utiliser
 * la localisation de son téléphone.
 *
 * Retourne true si l'autorisation est accordée,
 * sinon false.
 */
export const demanderAutorisationLocalisation =
  async (): Promise<boolean> => {
    // Vérifie l'état actuel de la permission.
    const permission =
      await Location.getForegroundPermissionsAsync();

    console.log(
      'Permission actuelle :',
      permission.status
    );

    // Si la permission est déjà accordée,
    // il n'est pas nécessaire de refaire une demande.
    if (permission.status === 'granted') {
      return true;
    }

    // Demande la permission au système Android.
    const demande =
      await Location.requestForegroundPermissionsAsync();

    console.log(
      'Résultat de la demande :',
      demande.status
    );

    return demande.status === 'granted';
  };



interface PositionEnvoyee {
  // ID du véhicule associé à la mission en cours.
  vehicule: number;

  // Coordonnées GPS du téléphone.
  latitude: number;
  longitude: number;
}

/**
 * Envoie la position actuelle du véhicule au backend.
 */
export const envoyerPosition = async (
  position: PositionEnvoyee
) => {
    console.log('Position envoyée au backend :', position);
  const reponse = await api.post(
    '/geolocalisation/positions/',
    position
  );

  return reponse.data;
};