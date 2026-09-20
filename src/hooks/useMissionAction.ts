import { useState } from 'react';

import { demarrerMission, terminerMission, } from '@/services/missions';

export const useMissionAction = () => {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const demarrer = async (missionId: number) => {
    try {
      setChargement(true);
      setErreur(null);

      // Demande au backend de démarrer la mission.
      const mission = await demarrerMission(missionId);

      return mission;
    } catch (error) {
      console.error(
        'Erreur lors du démarrage de la mission :',
        error
      );

      setErreur(
        'Impossible de démarrer la mission.'
      );

      return null;
    } finally {
      setChargement(false);
    }
  };

  /**
 * Termine la mission en cours.
 */
const terminer = async (missionId: number) => {
  try {
    setChargement(true);
    setErreur(null);

    // Demande au backend de terminer la mission.
    const missionTerminee = await terminerMission(missionId);

    return missionTerminee;
  } catch (error) {
    console.error(
      'Erreur lors de la fin de la mission :',
      error
    );

    setErreur(
      'Impossible de terminer la mission.'
    );

    return null;
  } finally {
    setChargement(false);
  }
};

  return {
    demarrer,
    terminer,
    chargement,
    erreur,
  };
};