'use client'

import React, { useEffect, useId } from 'react'
import { typeInputProps } from './Input'
import { useFormManager } from '@/externals/utils/frontend'

export default function InputRadio({
  fm,
  label,
  noLabel,
  isCleanup,
  defaultChecked,

  className,
  onChange,
  checked,
  style,
  value,
  name,
  id,

  ...props
}: Omit<typeInputProps, 'validations' | 'placeholder'>) {
  if (!fm) fm = useFormManager();
  if (!name) name = useId();



  /**
   * useEffect
   */
  useEffect(() => {
    if (defaultChecked !== undefined && fm.values?.[name] == undefined) {
      fm.setValues((prev) => ({ ...prev, [name]: defaultChecked ? 'on' : '' }));
    }
  }, [defaultChecked]);

  useEffect(() => () => {
    if (isCleanup) {
      fm.setValues(({ ...prev }) => { delete prev?.[name]; return prev; });
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
    }
  }, []);



  /**
   * Render JSX
   */
  return (
    <div className={`input-radio ${className}`}>
      <input
        {...props}
        id={id ?? name}
        name={name}
        type="radio"
        value={value}
        checked={checked ?? (fm.values?.[name] === value)}
        onChange={(e) => {
          if (onChange) onChange(e);
          fm.setValues((prev) => ({ ...prev, [name]: e.target.value }));
        }}
        style={{ cursor: 'pointer', ...(style ?? {}) }}
      />
      {!noLabel && (
        <label className="cursor-pointer" htmlFor={id ?? name}>
          {label ?? name}
        </label>
      )}
    </div>
  )
}
