import api from './api';

import { DonneesMotDePasse,DonneesProfil,ProfilUtilisateur } from '@/types/profil';

/**
 * Récupère le profil de l'utilisateur actuellement connecté.
 *
 * Le token JWT est ajouté automatiquement par l'intercepteur
 * configuré dans api.ts.
 */
export const recupererProfil = async (): Promise<ProfilUtilisateur> => {
  const reponse = await api.get<ProfilUtilisateur>(
    '/comptes/profil/'
  );

  return reponse.data;
};

/**
 * Modifie les informations du profil.
 * On envoie un FormData pour pouvoir envoyer une photo.
 */
export const modifierProfil = async (
  donnees: DonneesProfil
): Promise<ProfilUtilisateur> => {
  const formData = new FormData();

  formData.append('first_name', donnees.first_name);
  formData.append('last_name', donnees.last_name);
  formData.append('telephone', donnees.telephone);

  // La photo n'est envoyée que si l'utilisateur en a choisi une.
  // En React Native, un fichier est décrit par { uri, name, type }.
  if (donnees.photo) {
    formData.append('photo', {
      uri: donnees.photo.uri,
      name: donnees.photo.name,
      type: donnees.photo.type,
    } as unknown as Blob); // nécessaire pour que TypeScript accepte l'objet
  }

  const reponse = await api.patch<ProfilUtilisateur>(
    '/comptes/profil/',
    formData,
    {
      // En React Native, ce header est nécessaire pour l'envoi de fichiers
      // (React Native ajoute lui-même le "boundary").
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return reponse.data;
};

/**
 * Change le mot de passe de l'utilisateur connecté.
 */
export const modifierMotDePasse = async (
  donnees: DonneesMotDePasse
): Promise<void> => {
  await api.post('/comptes/mot-de-passe/', donnees);
};