import { auth } from "@/config/firebase";
import { IMesages } from "@/types";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

const StylesMessages = styled.p`
  width: fit-content;
  word-wrap: break-word;
  max-width: 100%;
  min-width: 30%;
  padding: 15px 15px 30px;
  border-radius: 8px;
  margin: 10px;
  position: relative;
`;
const StyledSentMessages = styled(StylesMessages)`
  margin-left: auto;
  //nằm hết phía bên phải
  background-color: #dcf8d6;
`;
const StyledTimeTamp = styled.div`
  position: absolute;
  bottom: 5px;
  right: 15px;
  text-align: center;
  font-size: x-small;
  color: gray;
`;
const StyledRecieveMessages = styled(StylesMessages)`
  background-color: whitesmoke;
`;
const Mess = ({ messages }: { messages: IMesages }) => {
  const [isLogin, _loading, _error] = useAuthState(auth);
  const MessType =
    isLogin?.email === messages.user
      ? StyledSentMessages
      : StyledRecieveMessages;
  return (
    <MessType>
      {messages.text}
      <StyledTimeTamp>{messages.sent_at}</StyledTimeTamp>
    </MessType>
  );
};

export default Mess;
