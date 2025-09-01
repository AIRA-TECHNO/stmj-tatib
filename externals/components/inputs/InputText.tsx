'use client'

import React, { HTMLInputTypeAttribute, useEffect, useId, useRef } from 'react'
import { typeInputProps } from './Input'
import { isRequired, useFormManager, validateInput } from '@/externals/utils/frontend'

export default function InputText({
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
}: typeInputProps & { type?: HTMLInputTypeAttribute }) {
  const refInput = useRef<HTMLInputElement>(null);
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
      fm.setValues(({ ...prev }) => { delete prev?.[name]; return prev; });
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
      delete fm.validations.current[name];
    }
  }, []);



  /**
   * Render JSX
   */
  return (
    <div className={`input-group ${className} ${fm.invalids?.[name]?.length ? 'input-group-invalid' : ''}`}>
      {Boolean(!noLabel && props.type != 'hidden') && (
        <label onClick={() => (refInput.current?.focus())} className='label-input-form'>
          {label ?? name}
          {isRequired(validation) && <span className="text-rose-600">*</span>}
        </label>
      )}
      <input
        ref={refInput}
        name={name}
        id={id ?? name}
        className={`input-form`}
        value={fm.values?.[name] ?? ''}
        onInput={(e) => {
          if (onInput) onInput(e);
          fm.setValues((prev: Record<string, any>) => ({
            ...prev, [name]: (e.target as any).value
          }));
        }}
        placeholder={placeholder as string}
        {...props}
      />
      {Boolean(fm.invalids?.[name]?.length) && (
        <div className='invalid-message'>{fm.invalids?.[name]?.[0]}</div>
      )}
    </div>
  )
}