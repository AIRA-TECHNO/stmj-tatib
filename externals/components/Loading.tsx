'use client'
import { SpinnerIcon } from '@phosphor-icons/react'
import React, { CSSProperties } from 'react'

export default function Loading({ style }: { style?: CSSProperties }) {
    return (
        <div className='w-full h-[15rem] flex items-center justify-center text-2xl' style={style}>
            <SpinnerIcon className='animate-spin' />
        </div>
    )
}
