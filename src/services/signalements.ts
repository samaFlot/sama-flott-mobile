import api from './api';

export interface SignalementCreation {
  mission: number;
  type_probleme: string;
  description: string;
  photo?: {
    uri: string;
    name: string;
    type: string;
  } | null;
}

export interface Signalement {
  id: number;
  mission: number;
  type_probleme: string;
  description: string;
  photo: string | null;
  statut: string;
  date_creation: string;
}

/**
 * Crée un signalement pour une mission.
 */
export const creerSignalement = async (
  donnees: SignalementCreation
): Promise<Signalement> => {

  const formulaire = new FormData();

  formulaire.append(
    'mission',
    String(donnees.mission)
  );

  formulaire.append(
    'type_probleme',
    donnees.type_probleme
  );

  formulaire.append(
    'description',
    donnees.description
  );

  // Ajouter la photo uniquement si l'Agent en a sélectionné une.
  if (donnees.photo) {
    formulaire.append(
      'photo',
      {
        uri: donnees.photo.uri,
        name: donnees.photo.name,
        type: donnees.photo.type,
      } as any
    );
  }

  const reponse = await api.post<Signalement>(
    '/signalements/',
    formulaire,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return reponse.data;
};
