'use client'

import { useContext } from 'react';

import { createContext, Dispatch, SetStateAction } from 'react';

interface SidebarContextProps {
  UserAuthed: typeUserAuthed;
  setUserAuthed: Dispatch<SetStateAction<typeUserAuthed>>;
  StatusCode: number;
  setStatusCode: Dispatch<SetStateAction<number>>;
  ScreenWidth: number;
  setScreenWidth: Dispatch<SetStateAction<number>>;
}
export const ContextGlobal = createContext<SidebarContextProps>({} as SidebarContextProps);

export function useContextGlobal() {
  return useContext(ContextGlobal);
}