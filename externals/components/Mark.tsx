'use client'

import React, { ReactNode } from 'react'
import { cn } from '../utils/frontend'

function Mark({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <div
            className={cn('mark', className)}>
            {children}
        </div>
    )
}

export default Mark