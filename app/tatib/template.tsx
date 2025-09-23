'use client'

import GradeaPanel from '@/externals/layouts/GradeaPanel'
import TopBarSimbah from '@/externals/layouts/TopBarSimbah';
import React from 'react'
import NavBar from '@/externals/layouts/NavBar';
import menuApp from './menuApp';
import { useContextGlobal } from '@/externals/contexts/ContextGlobal';
import { usePathname } from 'next/navigation';
import { checkAccess, errorMessages } from '@/externals/utils/general';
import Loading from '@/externals/components/Loading';

export default function Template({ children }: { children: React.ReactNode }) {
  const { UserAuthed, StatusCode } = useContextGlobal();
  const pathName = usePathname();



  /**
   * Default RBAC
   */
  const featureCodes = menuApp.find((ma) => (ma.href == pathName) || ma.essentialPaths?.includes(pathName))?.featureCodes ?? [];
  const isCanAccess = checkAccess(featureCodes.filter(Boolean).map((fc) => `${fc}>=1`), UserAuthed.roles);



  /**
   * Render JSX
   */
  if (!UserAuthed?.id) return (<Loading />);
  return (
    <GradeaPanel sidebarItems={menuApp} sidebarHideOnCollapse={true}>
      <TopBarSimbah />
      <NavBar menuApps={menuApp} />
      {(isCanAccess && [200, 202, 422].includes(StatusCode)) ? (
        <main className='max-w-9xl mx-auto'>
          {children}
        </main>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div>{isCanAccess ? 403 : StatusCode} | {(errorMessages as any)[isCanAccess ? 403 : StatusCode] ?? 'Terjadi kesalahan pada server'}</div>
        </div>
      )}
    </GradeaPanel>
  );
}
