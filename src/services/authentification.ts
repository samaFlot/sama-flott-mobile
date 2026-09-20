// On importe notre instance Axios déjà configurée.
// Elle contient notamment l'URL de base de notre API Django.
import api from "./api";

// Données envoyées au backend pour la connexion.
interface LoginData {
  email: string;
  password: string;
}

// Informations retournées par Django après la connexion.
export interface LoginResponse {
  // Token utilisé pour accéder aux endpoints protégés.
  access: string;

  // Token utilisé pour renouveler l'access token.
  refresh: string;

  // Rôle de l'utilisateur connecté.
  role: string;

  // Email de l'utilisateur.
  email: string;

  // Nom de l'utilisateur.
  nom: string;

  // Prénom de l'utilisateur.
  prenom: string;

  // ID du responsable auquel l'utilisateur est rattaché.
  // Il peut être null selon ton backend.
  responsable_id: number | null;

  // Nom de l'entreprise de l'utilisateur.
  nom_entreprise: string;

  // Indique si l'agent est actuellement disponible.
  disponible: boolean;
}

// Fonction responsable de la connexion.
export const login = async (
  data: LoginData
): Promise<LoginResponse> => {
  // Envoie l'email et le mot de passe
  // à l'endpoint de connexion.
  const response = await api.post<LoginResponse>(
    "/comptes/connexion/",
    data
  );

  // Retourne les données reçues du backend.
  return response.data;
};