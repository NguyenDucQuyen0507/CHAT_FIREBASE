import { auth, db } from "@/config/firebase";
import { AppUser, Conversation } from "@/types";
import { getRecipentEmail } from "@/utils/getRecipient";
import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [isLogin, _loading, _error] = useAuthState(auth);
  //get email từ phương thức getRecipentEmail
  const recipentEmail = getRecipentEmail(conversationUsers, isLogin);
  //get avatar
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipentEmail)
  );
  //dùng để thực thi câu lệnh
  const [recipientSnapshot, __loading, __error] =
    useCollection(queryGetRecipient);
  const recipient = recipientSnapshot?.docs[0]?.data() as AppUser | undefined;
  return {
    recipentEmail,
    recipient,
  };
};
