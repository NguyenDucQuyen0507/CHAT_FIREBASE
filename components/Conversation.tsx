import { useRecipient } from "@/hooks/useRecipient";
import { Conversation, IMesages } from "@/types";
import {
  converFirestoreTimestampToString,
  generateConversationMessages,
  transformMessages,
} from "@/utils/getMessages";
import IconButton from "@mui/material/IconButton";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import styled from "styled-components";
import RecipientAvatar from "./RecipientAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Mess from "./Mess";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
const StyledTimeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px;
  position: sticky;
  top: 0;
  background: rgb(118, 241, 246);
  height: 80px;
  z-index: 10;
  /* width: 100%; */
  /* border-bottom: 1px solid gray; */
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;
  > span {
    font-size: 14px;
    color: gray;
  }
`;
const StyledUserInfo = styled.div`
  display: flex;
  align-items: center;
`;
const StyledLightDark = styled.div``;
const StyledH3 = styled.div`
  word-break: break-all;
`;
const StyledHeaderIcon = styled.div`
  display: flex;
`;
const StyledMessagesContainer = styled.div`
  position: relative;
  padding: 20px;
  background-color: white;
  min-height: 90vh;
  z-index: 1;
`;

const StyledFormContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: whitesmoke;
  z-index: 1000;
`;
const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 10px;
  margin: 0 15px;
  background-color: white;
  border-radius: 20px;
`;
const EndOfMessagesAutoScrool = styled.div`
  margin-bottom: 15px;
`;
const ConversationsScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMesages[];
}) => {
  const [isLogin, _loading, _error] = useAuthState(auth);
  const conversationUser = conversation.users;
  const { recipentEmail, recipient } = useRecipient(conversationUser);
  //dùng để lưu giá trị thay đổi của input
  const [inputChange, setinputChange] = useState("");
  console.log("change", inputChange);
  const [first, setfirst] = useState(false);
  const router = useRouter();
  const conversationId = router.query.id;
  // console.log("Id", conversationId);

  const toggle = () => {
    setfirst(!first);
  };
  const getqueryMessages = generateConversationMessages(
    conversationId as string
  );
  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(getqueryMessages);
  const showMessages = () => {
    if (messagesLoading) {
      return messages.map((message) => (
        // <p key={index}>{JSON.stringify(message)}</p>
        <Mess key={message.id} messages={message} />
      ));
    }
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        // <p key={index}>{JSON.stringify(transformMessages(message))}</p>
        <Mess key={message.id} messages={transformMessages(message)} />
      ));
    }
    return null;
  };
  const addMessagesUpdateLastSeen = async () => {
    // await setDoc(
    //   doc(db, "users", isLogin?.email as string),
    //   {
    //     lastSeen: serverTimestamp(),
    //   },
    //   { merge: true }
    // );
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: inputChange,
      user: isLogin?.email,
    });
    setinputChange("");
    // scroll
    scrollToBottom();
  };
  const sentMessagesEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!inputChange) return;
      else {
        addMessagesUpdateLastSeen();
      }
    }
  };
  const sentMessagesClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    if (!inputChange) return;
    else {
      addMessagesUpdateLastSeen();
    }
  };
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <StyledTimeHeader>
        <StyledUserInfo>
          <RecipientAvatar
            recipient={recipient}
            recipentEmail={recipentEmail}
          />
          <StyledHeaderInfo>
            <StyledH3>{recipentEmail}</StyledH3>
            {recipient && (
              <span>
                Last active:{" "}
                {converFirestoreTimestampToString(recipient.lastSeen)}
              </span>
            )}
          </StyledHeaderInfo>
        </StyledUserInfo>
        <StyledLightDark>
          <StyledHeaderIcon>
            <IconButton>
              <AttachFileIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={toggle}>
              {first ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </StyledHeaderIcon>
        </StyledLightDark>
      </StyledTimeHeader>
      <StyledMessagesContainer>
        {showMessages()}
        {/* Phần mà khi ta gửi tn thì nó sẽ tự kéo tn xuống cho mình xem khoog cần phải kéo scrool */}
        <EndOfMessagesAutoScrool ref={endOfMessagesRef} />
      </StyledMessagesContainer>
      <StyledFormContainer>
        <InsertEmoticonIcon></InsertEmoticonIcon>
        <StyledInput
          value={inputChange}
          onChange={(event) => setinputChange(event.target.value)}
          onKeyDown={sentMessagesEnter}
        ></StyledInput>
        <IconButton onClick={sentMessagesClick} disabled={!inputChange}>
          <SendIcon style={{ color: !inputChange ? "" : "blue" }} />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledFormContainer>
    </>
  );
};

export default ConversationsScreen;
