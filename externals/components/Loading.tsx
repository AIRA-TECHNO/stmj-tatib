'use client'
import { SpinnerIcon } from '@phosphor-icons/react'
import React, { CSSProperties } from 'react'
import { cn } from '../utils/frontend'

export default function Loading({ style, className }: { style?: CSSProperties, className?: string }) {
    return (
        <div className={cn(`h-screen flex items-center justify-center text-slate-800`, className)} style={style}>
            <SpinnerIcon className='animate-spin text-2xl' />
            <div className='ml-1 tracking-wider'>Loading...</div>
        </div>
    )
}
