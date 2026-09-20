import { useEffect, useState } from 'react';

import {
  modifierMotDePasse,
  modifierProfil,
  recupererProfil,
} from '@/services/profil';

import {
  DonneesMotDePasse,
  DonneesProfil,
  ProfilUtilisateur,
} from '@/types/profil';

/**
 * Hook qui gère le profil de l'utilisateur connecté :
 * lecture, modification et changement de mot de passe.
 */
export const useProfil = () => {
  // Profil de l'utilisateur connecté.
  const [profil, setProfil] = useState<ProfilUtilisateur | null>(
    null
  );

  // Indique si le profil est en cours de chargement.
  const [chargement, setChargement] = useState(true);

  // Contient une éventuelle erreur.
  const [erreur, setErreur] = useState<string | null>(null);

  /**
   * Charge le profil depuis Django.
   */
  const chargerProfil = async () => {
    try {
      setChargement(true);
      setErreur(null);

      // Appel de l'API profil.
      const donnees = await recupererProfil();

      // Enregistre le profil.
      setProfil(donnees);
    } catch (error) {
      console.error(
        'Erreur récupération du profil :',
        error
      );

      setErreur(
        'Impossible de récupérer votre profil.'
      );
    } finally {
      setChargement(false);
    }
  };

  /**
   * Modifie les informations du profil.
   */
  const mettreAJourProfil = async (donnees: DonneesProfil) => {
    const profilModifie = await modifierProfil(donnees);

    setProfil(profilModifie);

    return profilModifie;
  };

  /**
   * Change le mot de passe.
   *
   * Même principe : l'erreur remonte à l'écran
   * (ancien mot de passe incorrect, nouveau mot de passe trop simple...).
   */
  const changerMotDePasse = async (donnees: DonneesMotDePasse) => {
    await modifierMotDePasse(donnees);
  };

  /**
   * Charge le profil au premier affichage.
   */
  useEffect(() => {
    chargerProfil();
  }, []);

  return {
    profil,
    chargement,
    erreur,
    chargerProfil,
    mettreAJourProfil,
    changerMotDePasse,
  };
};