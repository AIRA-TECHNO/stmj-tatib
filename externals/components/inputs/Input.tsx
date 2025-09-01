'use client'

import { ChangeEvent, DetailedHTMLProps, HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode, useId } from 'react'
import InputText from './InputText'
import TextArea from './TextArea'
import InputCheck from './InputCheck'
import InputPassword from './InputPassword'
import InputFile from './InputFile/InputFile'
import Select, { typeSelectProps } from './Select'
import InputDate, { typeInputDateProps } from './InputDate'
import InputRadio from './InputRadio'
import { cn, useFormManager } from '@/externals/utils/frontend'
import { TAnySchema } from '@sinclair/typebox'
import { TrashIcon } from '@phosphor-icons/react'



export interface typeInputProps extends Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "type" | "placeholder" | "value" | "onChange"
> {
  placeholder?: ReactNode;
  onChange?: (newVal: ChangeEvent<HTMLInputElement>, index?: any) => any;
  value?: any;
  name?: string;

  fm?: ReturnType<typeof useFormManager>;
  label?: ReactNode;
  noLabel?: boolean;
  isCleanup?: boolean;
  validation?: TAnySchema;
}

export type typeInputType = HTMLInputTypeAttribute | 'select' | 'textarea';



function renderInputByType(props: any, typeField = "text") {
  switch (typeField) {
    case 'radio':
      return <InputRadio {...props} />
    case 'checkbox':
      return <InputCheck {...props} />
    case 'textarea':
      return <TextArea {...props} />
    case 'file':
      return <InputFile {...props} />
    case 'password':
      return <InputPassword {...props} />
    case 'select':
      return <Select {...props} />
    case 'date':
    case 'datetime-local':
      return <InputDate {...props} />
    default:
      return <InputText {...props} />
  }
}



function Input({ isBulk, fm, ...props }:
  typeInputProps &
  typeSelectProps &
  typeInputDateProps &
  {
    type?: HTMLInputTypeAttribute | 'select' | 'textarea';
    isBulk?: boolean;
  }
) {
  if (!fm) fm = useFormManager();
  if (!props.name) props.name = useId();
  const { name, type, onChange, label, noLabel } = props;
  if (!isBulk) return renderInputByType({ ...props, fm }, type);
  return (
    <div>
      {!noLabel && (<div className='text-sm font-semibold capitalize mb-1 pt-4'>{label ?? name}</div>)}
      {[...(fm.values?.[name] ?? []), null].map((itemVal, indexVal) => (
        <div key={indexVal} className='flex items-start gap-2 pt-2'>
          <div className='grow'>
            <Input
              {...props} fm={fm} noLabel={true} name={`${name}[${indexVal}]`} type={type}
              value={itemVal ?? null}
              onChange={(event) => {
                if (onChange) onChange(event, indexVal);

                let newValue: any = event.target.value;
                if (['file', 'image'].includes(type ?? '')) newValue = event.target.files?.[0];

                if (newValue != undefined) {
                  fm.setValues((prev) => {
                    const newValues = prev?.[name] ?? [];
                    if (indexVal >= newValues.length) {
                      newValues.push(newValue);
                    } else {
                      newValues[indexVal] = newValue;
                    }
                    return { ...prev, [name]: newValues }
                  });
                }
              }}
            />
          </div>
          <div className='w-[2.25rem]'>
            {(fm.values?.[name] ?? []).length != indexVal && (
              <div
                className={cn(
                  "w-full aspect-square rounded-md flex",
                  "text-danger border-danger border",
                  "cursor-pointer hover:bg-danger hover:text-white",
                )}
                onClick={() => fm.setValues((prev: Record<string, any[]>) => ({
                  ...prev, [name]: prev?.[name]?.filter((_, index) => (index != indexVal))
                }))}
              >
                <TrashIcon weight='fill' className="text-lg m-auto" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}



export default Input