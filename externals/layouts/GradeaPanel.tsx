'use client'

import React, { ReactNode } from 'react'
import GradeaSidebar from './_partials/GradeaSidebar.p';
import TopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';



export default function GradeaPanel({
  children, sidebarItems, sidebarLess, sidebarHideOnCollapse
}: {
  children?: ReactNode;
  sidebarItems: typeMenuApps;
  sidebarLess?: boolean;
  sidebarHideOnCollapse?: boolean;
}) {

  return (
    <div className='min-h-screen'>{/* sm:bg-slate-100 mx-auto max-w-screen-2xl */}
      <TopLoader color="#fd6300" />
      <ToastContainer />
      <div className="flex whitespace-nowrap">
        {(!sidebarLess) && (<GradeaSidebar sidebarItems={sidebarItems} hideOnCollapse={sidebarHideOnCollapse} />)}
        <div className="app-content pb-[2rem] grow sm:min-w-xl mx-auto transition-[max-width] duration-400 ease-in-out">{children}</div>
      </div>
    </div>
  );
}
