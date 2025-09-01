'use client'

import React, { useEffect, useId } from 'react'
import { typeInputProps } from './Input'
import { useFormManager } from '@/externals/utils/frontend'

export default function InputCheck({
  fm,
  label,
  noLabel,
  isCleanup,
  defaultChecked,

  className,
  onChange,
  checked,
  style,
  name,
  id,

  ...props
}: Omit<typeInputProps, "validations" | "placeholder">) {
  if (!fm) fm = useFormManager();
    if (!name) name = useId();



  /**
   * useEffect
   */
  useEffect(() => {
    if (defaultChecked != undefined && fm.values?.[name] == undefined) {
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
    <div className={`input-checkbox ${className}`}>
      <input
        {...props}
        id={id ?? name}
        name={name}
        type="checkbox"
        checked={Boolean(checked ?? fm.values?.[name])}
        onChange={(e) => {
          if (onChange) onChange(e);
          fm.setValues((prev) => ({
            ...prev, [name]: e.target.checked ? 'on' : ''
          }));
        }}
        style={{ cursor: 'pointer', ...(style ?? {}) }}
      />
      {!noLabel && (
        <label htmlFor={id ?? name}>
          {label ?? name}
        </label>
      )}
    </div>
  )
}
