'use client'

import { cn, isRequired, useFormManager, validateInput } from '@/externals/utils/frontend'
import { TAnySchema } from '@sinclair/typebox';
import { DetailedHTMLProps, ReactNode, TextareaHTMLAttributes, useEffect, useId, useRef } from 'react'

interface typeTextAreaProps extends DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement
> {
  name?: string;

  fm?: ReturnType<typeof useFormManager>;
  label?: ReactNode;
  noLabel?: boolean;
  isCleanup?: boolean;
  validation?: TAnySchema;
}

export default function TextArea({
  fm,
  label,
  noLabel,
  isCleanup,
  validation,

  defaultValue,
  className,
  onInput,
  value,
  name,
  id,

  ...props
}: typeTextAreaProps) {
  const refInput = useRef<HTMLTextAreaElement>(null);
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
    } else if (fm.invalids[name]) {
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
    <div className={cn("input-group", className, { 'input-group-invalid': fm.invalids?.[name]?.length })}>
      {(!noLabel) && (
        <label onClick={() => (refInput.current?.focus())} className='label-input-form'>
          {label ?? name}
          {isRequired(validation) && <span className="text-rose-600">*</span>}
        </label>
      )}
      <textarea
        ref={refInput}
        value={fm.values?.[name] ?? ''}
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
        {...props}
      ></textarea>
      {Boolean(fm.invalids?.[name]?.length) && (
        <div className='invalid-message'>{fm.invalids?.[name]?.[0]}</div>
      )}
    </div>
  )
}
