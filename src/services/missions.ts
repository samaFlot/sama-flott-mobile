import api from './api';
import { Mission, MissionListe } from '@/types/mission';

/**
 * Récupère toutes les missions de l'Agent connecté.
 */
export const recupererMissions = async (): Promise<MissionListe[]> => {
  const reponse = await api.get<MissionListe[]>(
    '/operations/missions/'
  );

  return reponse.data;
};

/**
 * Récupère une seule mission grâce à son identifiant.
 *
 * Exemple :
 * missionId = 2
 * → GET /api/operations/missions/2/
 */
export const recupererMission = async (
  missionId: number
): Promise<Mission> => {
  const reponse = await api.get<Mission>(
    `/operations/missions/${missionId}/`
  );

  return reponse.data;
};

export const demarrerMission = async (
  missionId: number
): Promise<Mission> => {
  const reponse = await api.post<Mission>(
    `/operations/missions/${missionId}/demarrer/`
  );

  return reponse.data;
};

/**
 * Termine une mission grâce à son identifiant.
 */
export const terminerMission = async (
  missionId: number
): Promise<Mission> => {
  const reponse = await api.post<Mission>(
    `/operations/missions/${missionId}/terminer/`
  );

  return reponse.data;
};