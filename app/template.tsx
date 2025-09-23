'use client'

import "@/styles/globals.css";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ContextGlobal } from "@/externals/contexts/ContextGlobal";



declare global {
  type typeMenuApps = Array<{
    href?: string;
    label?: string;
    icon?: ReactNode;
    backroundColor?: string;
    checkIsActive?: (pathNames: string[]) => boolean;
    featureCodes?: string[];
    essentialPaths?: string[];
    groupMenu?: string;
    others?: any;
  }>;
}



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
      let newUserAuthed: typeUserAuthed = { id: 1 };
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
      children={children}
    />
  );
}
