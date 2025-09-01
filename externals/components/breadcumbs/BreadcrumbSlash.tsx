'use client'

import Link from 'next/link'
import React from 'react'



export default function BreadcrumbSlash({ items }: { items: typeBreadcumbProps }) {

  return (
    <div className='capitalize font-roboto'>
      <div className="flex items-center text-sm">
        {items?.map((navigation, indexNavigation) => {
          return (
            <div key={indexNavigation}>
              {((indexNavigation + 1) < items.length) ? (
                <>
                  <Link href={navigation.url}>{navigation?.label}</Link>
                  <span className='mx-1'>/</span>
                </>
              ) : (
                <div className="">{navigation?.label}</div>
              )}
            </div>
          )
        })}
      </div >
      <div className="text-[22px] font-bold">{(items.slice(-1).pop())?.label}</div>
    </div>
  )
}