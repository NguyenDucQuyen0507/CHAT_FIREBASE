import { db } from "@/config/firebase";
import { IMesages } from "@/types";
import {
  collection,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";

export const generateConversationMessages = (conversationId?: string) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );

export const transformMessages = (
  messages: QueryDocumentSnapshot<DocumentData>
) =>
  ({
    id: messages.id,
    ...messages.data(), // lấy ra conversation_Id,text,sent_at,user
    sent_at: messages.data().sent_at
      ? converFirestoreTimestampToString(messages.data().sent_at as Timestamp)
      : null,
  } as IMesages);
export const converFirestoreTimestampToString = (timesTamp: Timestamp) =>
  new Date(timesTamp.toDate().getTime()).toLocaleString();
