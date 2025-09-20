'use client'

import Form from '@/externals/components/Form'
import Confirm from '@/externals/components/popups/Confirm'
import GradeaPanel from '@/externals/layouts/GradeaPanel'
import HeaderApp from '@/externals/layouts/HeaderApp'
import { onLogout } from '@/externals/utils/frontend'
import { PowerIcon } from '@phosphor-icons/react'
import React, { useState } from 'react'

export default function Page() {
  const [IsShowConfirmLogout, setIsShowConfirmLogout] = useState(false);
  return (
    <GradeaPanel>
      <HeaderApp breadcumbs={[
        { label: 'Home', url: '/tatib/panel' },
        { label: 'Profil akun', url: '#' }
      ]} />
      <section className='mt-4'>
        <div className="card overflow-hidden max-w-md">
          <div className='bg-primary h-[6rem]'></div>
          <div className='bg-profile bg-gray-500 mx-auto h-[6rem] mt-[-3rem]'></div>
          <div className='text-center pt-2 pb-8'>
            <div className='text-lg font-medium'>Ahmad Nasir</div>
            <div className='text-sm'>91201399249329</div>
            <div className='btn bg-red-500 mt-6' onClick={() => setIsShowConfirmLogout(true)}>
              <PowerIcon weight='bold' className='text-base' />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </section>
      <section className='mt-4'>
        <div className="card max-w-md">
          <div className="card-header">
            <div className="card-title">Form Ubah Sandi</div>
          </div>
          <div className="card-body">
            <Form
              fields={[
                { name: 'old_password', label: 'Sandi Lama' },
                { name: 'password', label: 'Sandi Baru' },
              ]}
            />
          </div>
        </div>
      </section>
      <Confirm show={IsShowConfirmLogout} toHide={setIsShowConfirmLogout} onApproved={() => onLogout()} />
    </GradeaPanel>
  )
}
