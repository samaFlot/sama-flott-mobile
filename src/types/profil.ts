// Informations du profil de l'utilisateur connecté.
export interface ProfilUtilisateur {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  telephone: string;
  photo: string | null;
}

// Photo choisie dans la galerie ou prise avec l'appareil
export interface PhotoProfil {
  uri: string;
  name: string;
  type: string;
}

// Données envoyées pour modifier le profil
// (l'email n'est pas modifiable par l'agent)
export interface DonneesProfil {
  first_name: string;
  last_name: string;
  telephone: string;
  photo?: PhotoProfil;
}

// Données envoyées pour changer le mot de passe
export interface DonneesMotDePasse {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
  confirmation: string;
}