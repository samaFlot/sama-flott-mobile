import { useCallback, useEffect, useState } from 'react';

import { recupererMissions } from '@/services/missions';
import { MissionListe } from '@/types/mission';

/**
 * Hook qui gère la récupération des missions
 */
export const useMissions = () => {
  // Contient les missions récupérées depuis Django.
  const [missions, setMissions] = useState<MissionListe[]>([]);

  // Indique si la récupération est en cours.
  const [chargement, setChargement] = useState(true);

  // Contient une éventuelle erreur.
  const [erreur, setErreur] = useState<string | null>(null);

  /**
   * Récupère les missions depuis le backend.
   */
  const chargerMissions = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      // Appel du service qui communique avec Django.
      const donnees = await recupererMissions();

      // Enregistre les missions reçues.
      setMissions(donnees);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des missions :',
        error
      );

      setErreur(
        'Impossible de récupérer les missions.'
      );
    } finally {
      // Termine le chargement.
      setChargement(false);
    }
  },[]);

  /**
   * Charge les missions lorsque le hook est utilisé
   * pour la première fois.
   */
  useEffect(() => {
    chargerMissions();
  }, []);

  return {
    missions,
    chargement,
    erreur,
    chargerMissions,
  };
};