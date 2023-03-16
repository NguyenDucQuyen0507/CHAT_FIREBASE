import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "@/types";
import StyledConversationSelect from "./StyledConversationSelect";
const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  //tạo thanh cuộn theo chìu dọc
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  border-right: 1px solid gray;
  /* background-color: #fcf9f9; */
`;

const StyledHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  /* postion và top đi chung với nhau là khi di chuyển trang thì nó vẫn ở trên top */
  position: sticky;
  top: 0;
  z-index: 10;
  /* border-bottom: 1px solid black; */
  background-color: whitesmoke;
`;
const StyledScrollUser = styled.div`
  position: relative;
  z-index: 1;
`;
const StyleSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
`;
const StyleSearchInput = styled.input`
  border-radius: 2px;
  /* flex: 1 để nó chiếm hết phần tử cha của nó */
  flex: 1;
  border: none;
  outline: none;
  padding: 5px;
`;
const StyleSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
  font-weight: 700;
`;
const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log("error login out", error);
  }
};
const Sidebar = () => {
  const [isLogin, loading, _error] = useAuthState(auth);
  const [openDialogForm, setOpenDialogForm] = React.useState(false);
  const [recipientEmail, setrecipientEmail] = useState("");
  // const toogleNewConversationDialog = (isOpen: boolean) => {
  //   setOpenDialogForm(isOpen);
  //   if (!isOpen) setrecipientEmail("");
  // };
  const handleIsOpen = () => {
    setOpenDialogForm(true);
  };
  const handleIsClose = () => {
    setOpenDialogForm(false);
    setrecipientEmail("");
  };
  const isInvitingSelf = recipientEmail === isLogin?.email;

  const queryGetConversationCurentUser = query(
    collection(db, "convarsation"),
    where("users", "array-contains", isLogin?.email)
  );
  const [conversationSnapshot, __loading, __error] = useCollection(
    queryGetConversationCurentUser
  );
  const isConversationAlreadyExit = (recipientEmail: string) => {
    return conversationSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  };
  const createConversation = async () => {
    if (!recipientEmail) return;
    if (isInvitingSelf) {
      alert(
        recipientEmail +
          " là email của người đang đăng nhập nên không thể tạo cuộc trò chuyện!!!"
      );
      setrecipientEmail("");
    } else if (isConversationAlreadyExit(recipientEmail)) {
      alert(recipientEmail + " đã được mời nên không tạo được cuộc trò chuyện");
      setrecipientEmail("");
    } else {
      if (
        EmailValidator.validate(recipientEmail) &&
        !isInvitingSelf &&
        !isConversationAlreadyExit(recipientEmail)
      ) {
        await addDoc(collection(db, "convarsation"), {
          users: [isLogin?.email, recipientEmail],
        });
        handleIsClose();
      }
    }
  };
  return (
    <div>
      <StyledContainer>
        <StyledHeader>
          <Tooltip title={isLogin?.email as string} placement="right">
            <StyledUserAvatar src={isLogin?.photoURL || ""} />
          </Tooltip>
          <div>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
            <IconButton onClick={logOut}>
              <LogoutIcon />
            </IconButton>
          </div>
        </StyledHeader>
        <StyledScrollUser>
          <StyleSearch>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <StyleSearchInput placeholder="Search yourself" />
          </StyleSearch>
          <StyleSidebarButton onClick={handleIsOpen}>
            Start a new conversation
          </StyleSidebarButton>
          {/* Hiển thị cuộc trò chuyện */}
          {conversationSnapshot?.docs.map((conversation) => (
            <StyledConversationSelect
              key={conversation.id}
              id={conversation.id}
              conversationUsers={(conversation.data() as Conversation).users}
            />
          ))}
        </StyledScrollUser>
        {/* Dialog form */}
        <Dialog open={openDialogForm} onClose={handleIsClose}>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a Google email address for user you wish to chat with
            </DialogContentText>
            <TextField
              autoFocus
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={recipientEmail}
              onChange={(event) => {
                setrecipientEmail(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleIsClose}>Cancel</Button>
            <Button onClick={createConversation} disabled={!recipientEmail}>
              Create
            </Button>
            {/* Các giá trị như null undefine 0 false "" mặc định nó sẽ là false. nên trường hợp này ! là ngược lại với false thì là true.Nên Vì thế ban đầu là "" nên nó sẽ ẩn đi*/}
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </div>
  );
};

export default Sidebar;
