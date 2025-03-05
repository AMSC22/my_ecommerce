import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
// import { Notifications } from "../entities/Notification.tsx";

const api = apiAxios("/api/v1/");

// Fonction pour toutes les notifications d'un utilisateur
export const fetchNotifications = async (user_id: string) => {
  try {
    const { data } = await api.get(`notifications/user_id/`, {params: {user_id: user_id}});
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour toutes les notifications non lu d'un utilisateur
export const fetchUnReadNotifications = async (is_read: boolean = false) => {
    try {
        const { data } = await api.get(`notifications/is_read/`, {params: {is_read: is_read}});
        return data;
    } catch (error) {
        ErreurMessage(error);
        return [];
    }
};