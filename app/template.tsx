'use client'

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import Error from "next/error";
import { usePathname } from "next/navigation";
import { ContextGlobal } from "@/externals/contexts/ContextGlobal";

export default function Template({ children }: { children: React.ReactNode }) {
  const prefix = usePathname().split('/')[0]
  const [UserAuthed, setUserAuthed] = useState<typeUserAuthed>({});
  const [StatusCode, setStatusCode] = useState(200);
  const [ScreenWidth, setScreenWidth] = useState(0);



  /**
   * Use effect
   */
  useEffect(() => {
    if (!["signin", "/_error"].includes(prefix) && !UserAuthed.id) {
      let newUserAuthed: typeUserAuthed = {};
      setUserAuthed(newUserAuthed)
    }
  }, [prefix]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    function handleResize() {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  /**
   * Render JSX
   */
  return (
    <ContextGlobal.Provider
      value={{
        UserAuthed, setUserAuthed,
        StatusCode, setStatusCode,
        ScreenWidth, setScreenWidth
      }}
      children={![200, 202, 422].includes(StatusCode) ? (<Error statusCode={StatusCode} />) : (children)}
    />
  );
}
