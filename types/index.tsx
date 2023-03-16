import { Timestamp } from "firebase/firestore";

export interface Conversation {
  users: string[];
}
export interface AppUser {
  email: string;
  lastSeen: Timestamp;
  photoUrl: string;
}
export interface IMesages {
  id: string;
  conversation_Id: string;
  text: string;
  sent_at: string;
  user: string;
}
