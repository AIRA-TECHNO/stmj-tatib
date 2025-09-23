'use client'

import Link from 'next/link'
import React from 'react'
import { CaretRightIcon } from '@phosphor-icons/react';
import { typeBreadcumbItems } from './BreadcrumbSlash';



export default function BreadcrumbLine({ items }: { items: typeBreadcumbItems }) {

  return (
    <div className='border-t'>
      <section className="border-primary bg-white border-b-2">
        <div className='px-2 pt-2 pb-3'>
          <div className="flex text-xs capitalize font-semibold">
            {items?.map((navigation, index) => {
              return (
                <div key={index}>
                  {((index + 1) < items.length) ? (
                    <div className='text-slate-600 flex items-center'>
                      <Link href={String(navigation?.url)}>{navigation?.label}</Link>
                      <CaretRightIcon className="mx-1 mt-[1px]" />
                    </div>
                  ) : (
                    <div className='cursor-default text-slate-800'>{navigation?.label}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}