import { useRecipient } from "@/hooks/useRecipient";
import { Conversation } from "@/types";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";
import styled from "styled-components";
import RecipientAvatar from "./RecipientAvatar";
// import RecipientAvatar from "./RecipientAvatar";
const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  word-break: break-all;
  cursor: pointer;
  :hover {
    background: rgb(142, 248, 252);
  }
`;
const StyledAvatar = styled(Avatar)`
  margin: 10px;
`;
interface Iuser {
  id: string;
  conversationUsers: Conversation["users"];
}
const StyledConversationSelect = ({ id, conversationUsers }: Iuser) => {
  const { recipentEmail, recipient } = useRecipient(conversationUsers);
  const router = useRouter();
  const onSelectConversation: any = () => {
    router.push(`/conversations/${id}`);
  };
  return (
    <StyledContainer onClick={onSelectConversation}>
      {/* {recipient?.photoUrl ? (
        <StyledAvatar src={recipient.photoUrl} />
      ) : (
        <StyledAvatar>
          {recipentEmail && recipentEmail[0].toLowerCase()}
        </StyledAvatar>
      )} */}
      <RecipientAvatar recipient={recipient} recipentEmail={recipentEmail} />

      <span>{recipentEmail}</span>
    </StyledContainer>
  );
};

export default StyledConversationSelect;
