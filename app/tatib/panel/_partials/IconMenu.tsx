import Link from 'next/link'
import React, { MouseEventHandler } from 'react'

export default function IconMenu({
  backround, icon, label, href, onClick
}: {
  href?: string;
  backround?: string;
  icon?: any;
  label?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <Link href={href ?? ''} className='text-center' onClick={onClick}>
      <div className={`w-14 aspect-square rounded-xl flex m-auto ${backround}`}>
        <div className='m-auto'>{icon}</div>
      </div>
      <div className='text-xs font-semibold mt-2'>{label}</div>
    </Link>
  )
}
