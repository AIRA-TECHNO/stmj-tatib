import { cn, useFormManager } from '@/externals/utils/frontend';
import React, { ChangeEventHandler, ReactNode, useEffect, useId, useRef } from 'react'

export default function RadioSwitch({
  name,
  onChange,
  disabled,
  className,

  isSmall,
  options,
  fm,
}: {
  name?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  className?: string;

  isSmall?: boolean;
  options?: Array<string | number | { label: ReactNode; value: any }>;
  fm?: ReturnType<typeof useFormManager>;
}) {
  const refRadioInput = useRef<(HTMLInputElement)[]>([]);
  if (!fm) fm = useFormManager();
  if (!name) name = useId();



  /**
   * Use effect
   */
  useEffect(() => {
    if (refRadioInput.current.length && !fm?.values?.[name] && options?.[0]) {
      refRadioInput.current[0]?.click()
    }
  }, [refRadioInput.current, fm?.values?.[name], options])



  /**
   * Render JSX
   */
  return (
    <div className={`radio-switch ${className ?? ""}`}>
      {options?.map((option: any, indexOption) => {
        const label = String(option.label ?? option);
        return (
          <label
            key={indexOption}
            className={cn({ 'hidden': isSmall && (option?.value ?? option) != fm.values?.[name] })}
          >
            {isSmall ? label?.[0] : label}
            <input
              name={name}
              disabled={disabled}
              type="radio"
              className='hidden'
              value={option?.value ?? option}
              ref={(element) => { if (element) refRadioInput.current[indexOption] = element }}
              checked={fm.values?.[name] == (option?.value ?? option)}
              onClick={(event) => {
                if (isSmall) {
                  event.preventDefault();
                  refRadioInput.current[(indexOption + 1) % options.length]?.click();
                }
              }}
              onChange={(e) => {
                if (!disabled) {
                  if (onChange) onChange(e);
                  fm.setValues((prev: any) => ({ ...prev, [name]: option?.value ?? option }));
                }
              }}
            />
          </label>
        )
      })}
    </div>
  )
}
