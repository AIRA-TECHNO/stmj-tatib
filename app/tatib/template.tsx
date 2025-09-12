import GradeaPanel from '@/externals/layouts/GradeaPanel'
import TopBarSimbah from '@/externals/layouts/TopBarSimbah';
import React from 'react'
import NavBar from '@/externals/layouts/NavBar';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <GradeaPanel sidebarHideOnCollapse={true}>
      <TopBarSimbah />
      <NavBar />
      <main className='max-w-9xl mx-auto'>
        {children}
      </main>
    </GradeaPanel>
  );
}
