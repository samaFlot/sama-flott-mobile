// Statuts possibles d'une mission.
export type StatutMission =
  | 'PREVU'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'ANNULEE';

// Informations concernant la demande de chargement.
export interface DemandeChargement {
  id: number;
  demandeur: string;
  nombre_vehicules_demandes: number;
  date_chargement: string;
  heure_chargement: string;
  point_depart: string;
  destination: string;
  description: string;
  statut: string;
  date_creation: string;
}

// Informations du véhicule affecté à la mission.
export interface VehiculeMission {
  id: number;
  immatriculation: string;
  type_vehicule: string;
  poids: string;
  hauteur: string;
  largeur: string;
  statut: string;
  date_creation: string;
}

// Informations de l'agent affecté.
export interface AgentMission {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  disponible: boolean;
}

/** * Mission complète retournée par l'endpoint : * GET /api/operations/missions/{id}/ */
export interface Mission {
  id: number;
  demande_chargement: DemandeChargement;
  vehicule: VehiculeMission | null;
  agent: AgentMission | null;

  statut: StatutMission;

  date_creation: string;
  date_debut: string | null;
  date_fin_prevue: string | null;
  date_terminee: string | null;
  date_annulee: string | null;
}

/** * Mission simplifiée retournée par l'endpoint : * GET /api/operations/missions/ */ 
export interface MissionListe { 
    id: number; 
    demandeur: string; 
    point_depart: string; 
    destination: string; 
    date_chargement: string; 
    heure_chargement: string; 
    date_fin_prevue: string; 
    vehicule_immatriculation: string | null; 
    agent_nom: string | null; 
    agent_prenom: string | null; 
    statut: StatutMission; }