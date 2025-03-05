import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { Users } from "../entities/Users.tsx";

const api = apiAxios("/api/v1/");

// Fonction pour compter les vendeurs et les acheteurs
export const UserCount = async () => {
  try {
    const { data } = await api.get("users/count/");
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste de tous les utilisateurs
export const fetchAllUsers = async (): Promise<Users[]> => {
  try {
    const { data } = await api.get("users/");
    const UserData: Users[] = data.map((value: any) => ({
        id: value.id,  // ID de l'utilisateur
        first_name: value.first_name, // Prénom de l'utilisateur
        last_name: value.last_name, // Nom de l'utilisateur
        email: value.email, // Email de l'utilisateur
        hashed_password: value.hashed_password, // Mot de passe haché de l'utilisateur
        role: value.role, // Rôle de l'utilisateur (e.g., buyer, seller, admin)
        phone: value.phone || "", // Numéro de téléphone de l'utilisateur
        address: value.address || "", // Adresse de l'utilisateur
        profile_image_url: value.profile_image_url || "", // URL de l'image de profil de l'utilisateur
        is_active: value.is_active, // Statut de vérification de l'utilisateur
        created_at: value.created_at // Date de creation du compte
    }));
    return UserData;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer un utilistateur par son ID
export const fetchUser = async (user_id: string[] = []): Promise<Users[]> => {
    try {
      const { data } = await api.get(`users/${user_id}`);
      return [data];
    } catch (error) {
      ErreurMessage(error);
      return [];
    }
  };

// Fonction pour modifier un élément d'un utilistateur
export const UpdateUserData = async (user_id: string, user_data: Users) => {
    try {
      const { data } = await api.put(`users/${user_id}`, user_data);
      return data;
    } catch (error) {
      ErreurMessage(error);
      return null;
    }
  };

// Fonction pour supprimer un utilistateur
export const DeleteUser = async (user_id: string) => {
    try {
      const { data } = await api.delete(`users/${user_id}`);
      return data;
    } catch (error) {
      ErreurMessage(error);
      return null;
    }
  };