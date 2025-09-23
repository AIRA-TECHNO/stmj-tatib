'use client'

import Link from 'next/link'
import React from 'react'
import { CaretRightIcon } from '@phosphor-icons/react';
import { typeBreadcumbItems } from './BreadcrumbSlash';



export default function BreadcrumbCarded({ items }: { items: typeBreadcumbItems }) {

  return (
    <section className='mt-4'>
      <div className="card w-auto inline-flex text-xs p-3 capitalize shadow-sm -mb-2">
        {items?.map((item, index) => {
          return (
            <div key={index}>
              {((index + 1) < items.length) ? (
                <div className='text-slate-600 flex items-center'>
                  <Link href={String(item?.url)}>{item?.label}</Link>
                  <CaretRightIcon className="mx-1 mt-[1px]" />
                </div>
              ) : (
                <div className='cursor-default font-medium text-slate-800'>{item?.label}</div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}