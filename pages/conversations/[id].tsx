import ConversationsScreen from "@/components/Conversation";
import Sidebar from "@/components/Sidebar";
import { auth, db } from "@/config/firebase";
import { Conversation, IMesages } from "@/types";
import {
  generateConversationMessages,
  transformMessages,
} from "@/utils/getMessages";
import { getRecipentEmail } from "@/utils/getRecipient";
import styled from "@emotion/styled";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  conversation: Conversation;
  messages: IMesages[];
}
const StyledContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StyledConversation = styled.div`
  height: 100vh;
  flex-grow: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
const Conversations = ({ conversation, messages }: Props) => {
  const [isLogin, __loading, __error] = useAuthState(auth);
  return (
    <StyledContainer>
      <Head>
        <title>
          Conversantion with {getRecipentEmail(conversation.users, isLogin)}
        </title>
      </Head>
      <Sidebar />

      {/* {messages.map((mess) => (
        <p key={mess.id}>{JSON.stringify(mess)}</p>
      ))} */}
      <StyledConversation>
        <ConversationsScreen conversation={conversation} messages={messages} />
      </StyledConversation>
    </StyledContainer>
  );
};

export default Conversations;

// export async function getServerSideProps<any,{id: string}>(context:any) {
//   const converSationId = context.params?.id
// }
export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  //lấy conversaion(nơi mà chứa id của 2 thằng email chứ kho phải id trong messages vừa tạo)
  const conversationId = context.params?.id;
  //lấy conversation ra, người mà ta muốn chát
  //nó sẽ liên kết với firebase tới collection convasation và tìm thằng document chưa email của 2 người đã tìm dc ở trên.
  //Đó là ta đã truy xuát được nó
  const conversaionRef = doc(db, "convarsation", conversationId as string);
  //H ta sẽ lấy nó ra và gán cho một đối tượng.
  const conversationSnapshot = await getDoc(conversaionRef);
  //lấy messages ra
  const queryMessages = generateConversationMessages(conversationId);
  const messagesSnapShot = await getDocs(queryMessages);
  // console.log("Messages", messagesSnapShot.docs[0].data());
  const messages = messagesSnapShot.docs.map((messagesDoc) =>
    transformMessages(messagesDoc)
  );
  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
