'use client'

import GradeaPanel from '@/externals/layouts/GradeaPanel'
import TopBarSimbah from '@/externals/layouts/TopBarSimbah';
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <GradeaPanel sidebarHideOnCollapse={true} sidebarLess={true}>
      <TopBarSimbah forcedShow={false} />
      {children}
    </GradeaPanel>
  );
}
