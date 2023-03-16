import { Conversation } from "@/types";
import { User } from "firebase/auth";

export const getRecipentEmail = (
  conversationUsers: Conversation["users"],
  isLogin?: User | null
) => conversationUsers.find((userEmail) => userEmail !== isLogin?.email);
