export interface Message {
    id: number;
    sender: "user" | "other"; // "user" représente l'utilisateur actuel
    text: string;
    time: string;
  }