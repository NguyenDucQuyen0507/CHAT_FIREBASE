import Head from "next/head";
import type { NextPage } from "next";
import { Inter } from "@next/font/google";
import Sidebar from "../components/Sidebar";
const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>CHATCLONE</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
    </>
  );
};

export default Home;
