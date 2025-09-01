'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import React, { FormEvent } from 'react'
import Cookies from 'js-cookie'
import { api, onInvalid, useFormManager } from '@/externals/utils/frontend'
import InputText from '@/externals/components/inputs/InputText'
import InputPassword from '@/externals/components/inputs/InputPassword'
import Button from '@/externals/components/Button'
import { appConfig } from '@/externals/configs/app'

export default function Page() {
  const fm = useFormManager();

  /**
   * Function handler
   */
  function onSubmitLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    api({ path: '/login', method: 'POST', body: fm?.values ?? {} }).then(async (res) => {
      if (res.status == 200) {
        const { token } = (await res.json()).data
        const cookieConfigs: any = { expires: 7 }

        const domain = process?.env?.NEXT_PUBLIC_PARENT_DOMAIN
        if (domain) cookieConfigs.domain = domain

        Cookies.set(appConfig.COOKIE_AUTH_TOKEN ?? "userToken", token, cookieConfigs)
        window.location.href = '/'
        // window.history.back();
      } else if (res.status == 422) {
        const { errors } = (await res.json());
        fm?.setInvalids((prev) => ({ ...prev, ...onInvalid(errors) }));
      }
    });
  }


  /**
   * Render JSX
   */
  return (
    <section className='h-screen flex pb-[6rem] bg-blue-200/10'>
      <div className="card border shadow max-w-md m-auto">
        <div className='card-body p-8'>
          <Image
            src={'/public/images/main-logo.png'}
            alt='logo-app'
            width={100}
            height={0}
            style={{ height: 'auto', width: '3.5rem' }}
            className='mb-[1.25rem]'
          />
          <div className='mb-2'>
            <div className='text-xl'>Masuk ke akun pengguna</div>
            <div className='text-xs text-gray-700 mt-1'>Jaga username dan password anda tetap aman</div>
          </div>
          <form onSubmit={onSubmitLogin}>
            <InputText fm={fm} name='username' />
            <div className="flex items-end gap-2">
              <div className='grow'>
                <InputPassword fm={fm} name='password' />
              </div>
              <Button
                // className='btn-outline aspect-square px-2 text-sm mt-[1.5rem] bg-primary text-contras-primary disabled:border-gray-200 disabled:bg-white disabled:text-gray-300'
                className={`aspect-square h-[2.25rem] px-2 ${fm?.invalids?.password?.length ? 'mb-6' : ''}`}
                children={<ArrowRightIcon weight={'light'} />}
              />
            </div>
          </form>
          <div className='mt-[3rem]'>
            <p className="text-center text-gray-500 text-xs">
              &copy;2025 IT SMKN 1 JENANGAN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}