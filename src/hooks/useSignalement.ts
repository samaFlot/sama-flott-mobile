import { useState } from 'react';

import {
  creerSignalement,
  SignalementCreation,
  Signalement,
} from '@/services/signalements';

export const useSignalement = () => {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const envoyerSignalement = async (
    donnees: SignalementCreation
  ): Promise<Signalement | null> => {
    try {
      setChargement(true);
      setErreur(null);

      // Le service s'occupe d'envoyer les données
      // et éventuellement la photo au backend.
      const signalement = await creerSignalement(donnees);

      return signalement;
    } catch (error) {
      console.error(
        'Erreur lors de la création du signalement :',
        error
      );

      setErreur(
        'Impossible d’envoyer le signalement.'
      );

      return null;
    } finally {
      setChargement(false);
    }
  };

  return {
    envoyerSignalement,
    chargement,
    erreur,
  };
};
