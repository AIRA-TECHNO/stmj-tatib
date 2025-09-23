import GradeaPanel from '@/externals/layouts/GradeaPanel'
import TopBarSimbah from '@/externals/layouts/TopBarSimbah';
import React from 'react'
import NavBar from '@/externals/layouts/NavBar';
import menuApp from './menuApp';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <GradeaPanel sidebarItems={menuApp} sidebarHideOnCollapse={true}>
      <TopBarSimbah />
      <NavBar menuApps={menuApp} />
      <main className='max-w-9xl mx-auto'>
        {children}
      </main>
    </GradeaPanel>
  );
}
