'use client'

import React, { ReactNode } from 'react'
import GradeaSidebar from './_partials/GradeaSidebar.p';
import TopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import { useContextGlobal } from '../contexts/ContextGlobal';

export default function GradeaPanel({
  children, sidebarItems, sidebarLess = Boolean(process.env.NEXT_PUBLIC_SIDEBARLESS)
}: {
  children?: ReactNode;
  sidebarItems?: typeMenuApps;
  sidebarLess?: boolean;
}) {
  const { ScreenWidth } = useContextGlobal();



  return (
    <main className='sm:bg-slate-100 min-h-screen'>
      <TopLoader color="#fd6300" />
      <ToastContainer />
      <div>{/* sm:bg-slate-100 mx-auto max-w-screen-2xl */}
        <div className="flex whitespace-nowrap">
          {(ScreenWidth >= 640 && !sidebarLess) && (<GradeaSidebar sidebarItems={sidebarItems} />)}
          <div className="app-content pb-[2rem] grow sm:min-w-xl mx-auto transition-[max-width] duration-400 ease-in-out">{children}</div>
        </div>
      </div>
    </main >
  );
}
