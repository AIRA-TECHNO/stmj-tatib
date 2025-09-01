'use client'

import GradeaPanel from '@/externals/layouts/GradeaPanel'
import React from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  return (<GradeaPanel>{children}</GradeaPanel>);
}
