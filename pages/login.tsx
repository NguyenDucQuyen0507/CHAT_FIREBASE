import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import LogoGoogle from "../assets/google-logo.png";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase";
const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`;

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

export const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`;
const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  const signIn = () => {
    signInWithGoogle();
  };
  return (
    <StyledContainer>
      <Head>
        <title>Login</title>
      </Head>
      <StyledLoginContainer>
        <StyledImageWrapper>
          <Image
            src={LogoGoogle}
            alt="logo"
            style={{ width: "300px", height: "300px", objectFit: "contain" }}
          />
        </StyledImageWrapper>
        <Button
          onClick={signIn}
          // style={{ width: "100%", height: "100px", fontSize: "50px" }}
          variant="outlined"
        >
          Sign with Google
        </Button>
      </StyledLoginContainer>
    </StyledContainer>
  );
};

export default Login;
