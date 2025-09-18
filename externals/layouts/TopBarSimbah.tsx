'use client'

import { CaretRightIcon, CaretUpDownIcon, DotsNineIcon, HouseIcon } from '@phosphor-icons/react';
import { UserCircleIcon } from '@phosphor-icons/react/dist/ssr'

export default function TopBarSimbah() {
  return (
    <header
      className={`text-white h-[2.5rem] text-sm flex items-center sm:px-4`}
      style={{
        // background: `#1d291e`,
        // background: `#083033`,
        // background: `#304544`,
        // background: `#083c3c`,
        background: `#0b2c2c`, // seattle
      }}
    >
      <div className='flex items-center'>
        <div className='flex items-center'>
          <div className='h-[2rem] aspect-square rounded-full flex justify-center items-center cursor-pointer hover:bg-white/20 hover:text-secondary'>
            <HouseIcon className='text-xl mb-[1px]' weight='bold' />
          </div>
          <CaretRightIcon className='mt-[2px]' />
          <div className='mt-[2px] ml-1 tracking-widest font-medium font-roboto'>SiKAP</div>
        </div>
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <div className='h-[2rem] aspect-square rounded-full flex justify-center items-center cursor-pointer hover:bg-white/20 hover:text-secondary'>
          <DotsNineIcon className='text-2xl ml-[1px] mt-[1px]' weight='bold' />
        </div>
        <div className='flex items-center gap-1 hover:bg-white/20 rounded-full px-1 cursor-pointer'>
          <UserCircleIcon className='text-3xl mt-1' />
          <div className='max-sm:hidden'>
            <div className='text-2xs tracking-wide font-semibold leading-3'>Dwiki</div>
            <div className='text-2xs tracking-wide leading-2 my-[1px]'>guru@01992999</div>
          </div>
          <CaretUpDownIcon weight='bold' />
        </div>
      </div>
    </header>
  )
}
