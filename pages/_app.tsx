import Loading from "@/components/Loading";
import { auth, db } from "@/config/firebase";
import "@/styles/globals.css";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
export default function App({ Component, pageProps }: AppProps) {
  const [isLogin, loading, _error] = useAuthState(auth);
  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          doc(db, "users", isLogin?.email as string),
          {
            email: isLogin?.email,
            lastSeen: serverTimestamp(),
            photoUrl: isLogin?.photoURL,
          },
          {
            merge: true,
          }
        );
      } catch (error) {
        console.log("Lỗi!!", error);
      }
    };
    if (isLogin) {
      setUserInDb();
    }
  }, [isLogin]);

  if (loading) return <Loading />;
  // const isLogin = false;
  if (!isLogin) return <Login />;
  return <Component {...pageProps} />;
}
