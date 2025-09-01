'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { typeInputProps } from './Input'
import { isRequired, useFormManager, validateInput } from '@/externals/utils/frontend'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'

export default function InputPassword({
  fm,
  label,
  noLabel,
  isCleanup,
  validation,

  defaultValue,
  placeholder,
  className,
  onInput,
  value,
  name,
  id,

  ...props
}: typeInputProps) {
  const refInput = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false);
  if (!fm) fm = useFormManager();
    if (!name) name = useId();



  /**
   * useEffect
   */
  useEffect(() => {
    if (validation) fm.validations.current[name] = validation
  }, [validation]);

  useEffect(() => {
    if (![undefined, fm.values?.[name]].includes(value)) {
      fm.setValues((prev) => ({ ...prev, [name]: value }));
    } else if (defaultValue != undefined && fm.values?.[name] == undefined) {
      fm.setValues((prev) => ({ ...prev, [name]: defaultValue }));
    }
  }, [value, defaultValue]);

  useEffect(() => {
    if (fm.validations.current[name]) {
      validateInput(fm, name)
    } else if (fm.invalids?.[name]) {
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
    }
  }, [fm.values?.[name]]);

  useEffect(() => () => {
    if (isCleanup) {
      fm.setValues(({ ...prev }) => { delete prev?.[name]; return prev });
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
    }
  }, []);



  /**
   * Render JSX
   */
  return (
    <div className={`input-group ${className} ${fm.invalids?.[name]?.length ? 'input-group-invalid' : ''}`}>
      {(!noLabel) && (
        <label onClick={() => (refInput.current?.focus())} className='label-input-form'>
          {label ?? name}
          {isRequired(validation) && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div className='flex'>
        <input
          ref={refInput}
          value={fm?.values?.[name] ?? ''}
          onInput={(e) => {
            if (onInput) onInput(e)
            fm.setValues((prev: Record<string, any>) => ({
              ...prev,
              [name]: (e.target as HTMLInputElement).value
            }))
          }}
          name={name}
          id={id ?? name}
          className={`input-form`}
          placeholder={placeholder as string}
          {...props}
          type={isVisible ? 'text' : 'password'}
        />
        <div className='flex'>
          {isVisible ? (
            <EyeSlashIcon
              className='my-auto ml-[-2rem] w-[1.5rem] cursor-pointer'
              onClick={() => setIsVisible(prev => !prev)}
            />
          ) : (
            <EyeIcon
              className='my-auto ml-[-2rem] w-[1.5rem] cursor-pointer'
              onClick={() => setIsVisible(prev => !prev)}
            />
          )}
        </div>
      </div>
      {Boolean(fm.invalids?.[name]?.length) && (
        <div className='invalid-message'>{fm.invalids?.[name][0]}</div>
      )}
    </div>
  )
}
