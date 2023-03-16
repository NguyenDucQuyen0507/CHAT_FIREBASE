import { useRecipient } from "@/hooks/useRecipient";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import React from "react";

const StyledAvatar = styled(Avatar)`
  margin: 10px;
`;
type Props = ReturnType<typeof useRecipient>;
const RecipientAvatar = ({ recipient, recipentEmail }: Props) => {
  return recipient?.photoUrl ? (
    <StyledAvatar src={recipient.photoUrl} />
  ) : (
    <StyledAvatar>
      {recipentEmail && recipentEmail[0].toLowerCase()}
    </StyledAvatar>
  );
};

export default RecipientAvatar;
