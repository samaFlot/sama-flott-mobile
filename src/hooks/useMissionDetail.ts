import { useEffect, useState } from 'react';

import { recupererMission } from '@/services/missions';
import { Mission } from '@/types/mission';

/**
 * Hook permettant de récupérer une mission précise.
 */
export const useMissionDetail = (missionId: number) => {
  // Mission récupérée depuis Django.
  const [mission, setMission] = useState<Mission | null>(
    null
  );

  // Indique si la requête est en cours.
  const [chargement, setChargement] = useState(true);

  // Message d'erreur éventuel.
  const [erreur, setErreur] = useState<string | null>(
    null
  );

  const mettreAJourMission = (missionMiseAJour: Mission) => {
    setMission(missionMiseAJour);
  };

  /**
   * Charge une mission précise depuis l'API.
   */
  const chargerMission = async () => {
    try {
      setChargement(true);
      setErreur(null);

      // Appel direct :
      // GET /api/operations/missions/{id}/
      const donnees = await recupererMission(missionId);

      setMission(donnees);
    } catch (error) {
      console.error(
        'Erreur récupération mission :',
        error
      );

      setErreur(
        error instanceof Error
          ? error.message
          : 'Impossible de récupérer la mission.'
      );
    } finally {
      setChargement(false);
    }
  };

  /**
   * Charge la mission lorsque son ID change.
   */
  useEffect(() => {
    chargerMission();
  }, [missionId]);

  return {
    mission,
    chargement,
    erreur,
    chargerMission,
    mettreAJourMission,
  };
};