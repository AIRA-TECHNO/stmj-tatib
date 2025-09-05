'use client'

import GradeaPanel from '@/externals/layouts/GradeaPanel'
import TopBarSimbah from '@/externals/layouts/TopBarSimbah';
import Link from 'next/link';
import React from 'react'
import menuApps from '../menuApps';
import { ListIcon } from '@phosphor-icons/react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathNames = usePathname().split('/');
  return (
    <GradeaPanel sidebarHideOnCollapse={true}>
      <header className='[&_#top-bar-simbah>.grid]:max-w-[110rem] [&_#top-bar-simbah>.grid]:mx-auto'>
        <TopBarSimbah
          forcedShow={false}
          leftElement={(
            <div className='flex gap-10'>
              <div className='flex items-center'>
                <div
                  className='header-icon-square sm:hidden'
                  onClick={() => ((window as any)?.gradea?.toggleSidebar?.())}
                >
                  <ListIcon className='text-xl m-auto' />
                </div>
                <div className="hidden lg:flex items-center gap-2 px-2 font-medium">
                  <div className={`bg-profile h-[2rem]`} style={{ backgroundImage: `URL(/public/images/main-logo.png)` }} />
                  <div className="text-sm">SMKN 1 JENANGAN</div>
                </div>
              </div>
              <div className={`hidden sm:flex items-center gap-8 text-sm ${true ? 'absolute top-1/2 left-1/2 -translate-1/2' : ''}`}>
                {menuApps.map((menuApp, indexMenuApp) => (
                  (menuApp.href && menuApp.isHeaderItem) ? <Link
                    key={indexMenuApp}
                    href={menuApp.href}
                    className={menuApp?.checkIsActive?.(pathNames) ? 'font-bold border-b-2 border-secondary/80 pb-0.5 -mb-1' : 'hover:text-primary'}
                  >{menuApp.label}</Link> : null
                ))}
              </div>
            </div>
          )}
          centerElement={false}
        />
      </header>
      <main className='max-w-[110rem] mx-auto'>
        {children}
      </main>
    </GradeaPanel>
  );
}
