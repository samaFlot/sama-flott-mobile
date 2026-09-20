import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

import { envoyerPosition } from '@/services/geolocalisation';
import axios from 'axios';

export const useGeolocalisation = (
  vehiculeId: number | null,
  active: boolean
) => {
  // Conserve l'abonnement au suivi GPS
  // afin de pouvoir l'arrêter proprement.
  const abonnement = useRef<Location.LocationSubscription | null>(null);

  // Indique si le suivi GPS est actif.
  const [suiviActif, setSuiviActif] = useState(false);

  // Contient une éventuelle erreur.
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    // S'il n'y a pas de véhicule ou si le suivi n'est pas demandé,
    // on ne démarre pas la géolocalisation.
    if (!vehiculeId || !active) {
      return;
    }

    const demarrerSuivi = async () => {
      try {
        setErreur(null);

        // Évite de créer plusieurs abonnements GPS.
        if (abonnement.current) {
          return;
        }

        // Écoute les changements de position du téléphone.
        abonnement.current =
          await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 10000,
              distanceInterval: 0,
            },
            async (location) => {
              try {
                // Récupère les coordonnées GPS.
                const latitude = Number(
                location.coords.latitude.toFixed(6)
                );

                const longitude = Number(
                location.coords.longitude.toFixed(6)
                );

                // Envoie la position du véhicule au backend.
                await envoyerPosition({
                  vehicule: vehiculeId,
                  latitude,
                  longitude,
                });

                console.log(
                  'Position envoyée :',
                  latitude,
                  longitude
                );
              } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(
                    'Erreur envoi position :',
                    error.response?.status,
                    error.response?.data
                    );
                } else {
                    console.error(
                    'Erreur lors de l’envoi de la position :',
                    error
                    );
                }
              }
            }
          );

        setSuiviActif(true);
      } catch (error) {
        console.error(
          'Erreur lors du démarrage du suivi GPS :',
          error
        );

        setErreur(
          'Impossible de démarrer la géolocalisation.'
        );
      }
    };

    demarrerSuivi();

    // Arrête le suivi lorsque le composant est démonté
    // ou lorsque la mission n'est plus active.
    return () => {
      if (abonnement.current) {
        abonnement.current.remove();
        abonnement.current = null;
      }

      setSuiviActif(false);
    };

  }, [vehiculeId, active]);

  return {
    suiviActif,
    erreur,
  };
};