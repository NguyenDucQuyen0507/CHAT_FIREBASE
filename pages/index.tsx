import Head from "next/head";
import type { NextPage } from "next";
import { Inter } from "@next/font/google";
import Sidebar from "../components/Sidebar";
import SpaceMess from "@/components/SpaceMess";
import styled from "styled-components";
const inter = Inter({ subsets: ["latin"] });

const StyledContainer = styled.div`
  display: flex;
`;
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CHATCLONE</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/CHATSAP1.png" />
      </Head>
      <StyledContainer>
        <Sidebar />
        <SpaceMess />
      </StyledContainer>
    </>
  );
};

export default Home;
