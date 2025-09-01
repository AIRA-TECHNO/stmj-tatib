'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { typeInputProps } from './Input'
import { changeAttr, cn, isRequired, useFormManager, validateInput } from '@/externals/utils/frontend';
import { DayPicker } from 'react-day-picker';
import { id as localeID } from "react-day-picker/locale";
import DateField from './_partials/DateField';
import { CalendarBlankIcon, XIcon } from '@phosphor-icons/react';
import Dropdown from '../popups/Dropdown';



export interface typeInputDateProps {
  mode?: "single" | "multiple" | "range";
}

export default function InputDate({
  mode = "single",

  fm,
  label,
  noLabel,
  isCleanup,
  validation,

  defaultValue,
  className,
  onChange,
  value,
  name,
  type,
  id,

  ...props
}:
  Omit<typeInputProps, "type" | "placeholder"> &
  { type?: "date" | "datetime-local"; } &
  typeInputDateProps
) {
  const dropdownHeight = 150;
  const refWrapper = useRef<HTMLDivElement>(null);
  const refDateStart = useRef<HTMLInputElement>(null);
  const refTimeStart = useRef<HTMLInputElement>(null);
  const refDateEnd = useRef<HTMLInputElement>(null);
  const refTimeEnd = useRef<HTMLInputElement>(null);
  const refDateMultiples = useRef<(HTMLInputElement | null)[]>([]);
  const refDateSingle = useRef<HTMLInputElement>(null);
  const refTimeSingle = useRef<HTMLInputElement>(null);
  const refMode = useRef('');
  const [IsFocus, setIsFocus] = useState(false);
  if (!fm) fm = useFormManager();
  if (!name) name = useId();



  /**
   * Function handler
   */
  function toFormatInput(date: any, withTime?: boolean) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(Number(d))) return '';
    let result = String(d.getFullYear());
    result += '-' + String(d.getMonth() + 1).padStart(2, '0');
    result += '-' + String(d.getDate()).padStart(2, '0');
    if (withTime ?? (type == "datetime-local")) {
      result += "T" + String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0');
    }
    return result;
  }



  /**
   * useEffect
   */
  useEffect(() => {
    if (validation) fm.validations.current[name] = validation
  }, [validation]);

  useEffect(() => {
    if (fm.validations.current[name]) {
      validateInput(fm, name)
    } else if (fm.invalids[name]) {
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
    }
  }, [fm.values?.[name]]);

  useEffect(() => {
    if (refMode.current != mode) refMode.current = mode;
    let newValue = value;
    if (!newValue && defaultValue) newValue = defaultValue;
    if (newValue == undefined) newValue = fm.values[name];
    if (mode == "multiple") {
      const newSelecteds: any[] = (Array.isArray(newValue) ? newValue : [newValue?.start_at ?? newValue, newValue?.end_at])
        .filter((ns) => ns).map((ns) => toFormatInput(ns));
      if (JSON.stringify(newSelecteds) != JSON.stringify(newValue)) {
        fm.setValue(name, newSelecteds);
        setTimeout(() => {
          (newSelecteds as any[]).forEach((val, index) => changeAttr(refDateMultiples.current[index], 'value', val));
        }, 100);
      }
    } else if (mode == "range") {
      if (
        !["start_at", "end_at"].find((k) => Object.keys(newValue ?? {}).includes(k)) ||
        JSON.stringify(fm.values[name]) != JSON.stringify(newValue)
      ) {
        const newStartAt = toFormatInput(newValue?.start_at ?? (Array.isArray(newValue) ? newValue?.[0] : newValue));
        const newEndAt = toFormatInput(newValue?.end_at ?? (Array.isArray(newValue) ? newValue?.[1] : newValue));
        changeAttr(refDateStart.current, 'value', newStartAt);
        changeAttr(refDateEnd.current, 'value', newEndAt);
      }
    } else {
      if (fm.values[name] != newValue) {
        const newSelected = toFormatInput(newValue?.start_at ?? (Array.isArray(newValue) ? newValue?.[0] : newValue));
        changeAttr(refDateSingle.current, 'value', newSelected);
      }
    }
  }, [fm.values?.[name], value, defaultValue, mode]);

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
  const inputRect = refWrapper.current?.parentElement?.getBoundingClientRect() ?? {} as DOMRect;
  const showAbove = (typeof window == 'undefined' ? 0 : window.innerHeight) - inputRect.bottom < dropdownHeight && inputRect.top > dropdownHeight;
  return (
    <div className={cn("input-group relative", className, { "input-group-invalid": fm.invalids?.[name]?.length })}>
      {!noLabel && (
        <label onClick={() => setIsFocus(true)} className="label-input-form" htmlFor={id ?? name}>
          {label ?? name}{isRequired(validation) && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div ref={refWrapper} className='input-form flex items-center gap-1'>
        {(() => {
          if (mode == "multiple") {
            return ((Array.isArray(fm.values[name]) ? fm.values[name] : []).map((s: any, indexS: any) => (
              <div key={indexS} className='flex items-center gap-1.5 border border-gray-300 text-[13px] font-medium py-[2px] rounded-full px-2'>
                <input
                  ref={(el) => { refDateMultiples.current[indexS] = el }}
                  {...props} name={name} id={id ?? name} className='hidden'
                  value={toFormatInput(s)} onChange={(e) => onChange?.(e, indexS)}
                />
                <span className='ml-1'>{toFormatInput(s, false).split('-').reverse().join('/')}</span>
                <span
                  className='cursor-pointer hover:text-red-500'
                  onClick={() => { fm.setValue(name, (prev: any[]) => prev.filter((_, rmId) => indexS != rmId)) }}
                >
                  <XIcon weight='bold' className='text-2xs' />
                </span>
              </div>
            )));
          } else if (mode == "range") {
            return (<>
              <input
                {...props} ref={refDateStart} name={name} id={id ?? name} className='hidden'
                value={fm.values?.[name]?.start_at ?? ""} onChange={(e) => {
                  const newValue = e.target.value;
                  onChange?.(e, "start");
                  fm.setValue(name, (prev: any) => ({ start_at: newValue, end_at: prev?.end_at ?? "" }));
                }}
              />
              <DateField
                type={type} value={fm.values[name]?.start_at}
                onChange={(newVal) => { changeAttr(refDateStart.current, 'value', newVal) }}
              />
              <span className='pl-2 pr-3'>s/d</span>
              <input
                {...props} ref={refDateEnd} name={name} id={id ?? name} className='hidden'
                value={fm.values?.[name]?.end_at ?? ""} onChange={(e) => {
                  const newValue = e.target.value;
                  onChange?.(e, "end");
                  fm.setValue(name, (prev: any) => ({ start_at: prev?.start_at ?? "", end_at: newValue }));
                }}
              />
              <DateField
                type={type} value={fm.values[name]?.end_at}
                onChange={(newVal) => { changeAttr(refDateEnd.current, 'value', newVal) }}
              />
            </>);
          } else {
            return (<>
              <input
                {...props} ref={refDateSingle} name={name} id={id ?? name} className='hidden'
                value={fm.values?.[name] ?? ""} onChange={(e) => {
                  onChange?.(e);
                  fm.setValue(name, e.target.value);
                }}
              />
              <DateField
                type={type} value={fm.values[name]}
                onChange={(newVal) => { changeAttr(refDateSingle.current, 'value', newVal) }}
              />
            </>);
          }
        })()}
        <div className='grow h-full flex items-center justify-end cursor-pointer' onClick={() => setIsFocus(true)}>
          <CalendarBlankIcon weight='duotone' style={{ fontSize: "18px" }} />
        </div>
      </div>

      <Dropdown show={IsFocus} toHide={setIsFocus} className={`w-min shadow-none my-2 ${showAbove ? "bottom-full" : "top-full"}`}>
        <div className='[&_.rdp-dropdowns]:ml-2 py-1 px-2'>
          {(type == "datetime-local" && mode != "multiple") && (<>
            {mode == "range" ? (
              <div className='mt-3'>
                <div className='absolute right-3 top-4 z-[1]'>
                  <input
                    ref={refTimeStart} type="time" className=''
                    defaultValue={String(fm.values[name]?.start_at ?? '').split("T")[1] ?? "00:00"}
                    onChange={(e) => {
                      changeAttr(refDateStart.current, 'value', `${String(fm.values[name]?.start_at ?? '').split("T")[0]}T${e.target.value}`)
                    }}
                  />
                  <input
                    ref={refTimeEnd} type="time" className=''
                    defaultValue={String(fm.values[name]?.end_at ?? '').split("T")[1] ?? "00:00"}
                    onChange={(e) => {
                      changeAttr(refDateEnd.current, 'value', `${String(fm.values[name]?.end_at ?? '').split("T")[0]}T${e.target.value}`)
                    }}
                  />
                </div>
              </div>
            ) : (
              <input
                ref={refTimeSingle} type="time" className='absolute right-3 top-4 z-[1]'
                defaultValue={String(fm.values[name] ?? '').split("T")[1] ?? "00:00"}
                onChange={(e) => {
                  changeAttr(refDateSingle.current, 'value', `${String(fm.values[name]).split("T")[0]}T${e.target.value}`)
                }}
              />
            )}
          </>)}
          <DayPicker
            animate hideNavigation captionLayout="dropdown" locale={localeID} mode={(mode ?? "single") as any}
            month={(() => {
              const currentMonth = (fm.values[name]?.start_at ?? (Array.isArray(fm.values[name]) ? fm.values[name]?.[0] : fm.values[name]));
              return isNaN(Number(new Date(currentMonth))) ? undefined : new Date(currentMonth);
            })()}
            selected={(() => {
              if (mode == "multiple") return (Array.isArray(fm.values[name]) ? fm.values[name] : [])?.map((s: any) => new Date(s));
              if (mode == "range") {
                const displayed: any = {};
                if (fm.values[name]?.start_at) displayed.from = new Date(fm.values[name]?.start_at);
                if (fm.values[name]?.end_at) displayed.to = new Date(fm.values[name]?.end_at);
                return displayed;
              }
              return new Date(fm.values[name]);
            })()}
            onSelect={(newDate: any) => {
              if (mode == "multiple") {
                fm.setValue(name, (newDate as any[])?.map((s) => toFormatInput(s)));
              } else if (mode == "range") {
                if (newDate?.from) newDate.from.setHours?.(...(String(refTimeStart.current?.value ?? "").split(":")));
                if (newDate?.to) newDate.to.setHours?.(...(String(refTimeEnd.current?.value ?? "").split(":")));
                changeAttr(refDateStart.current, 'value', toFormatInput(newDate?.from));
                changeAttr(refDateEnd.current, 'value', toFormatInput(newDate?.to));
              } else {
                if (newDate) newDate.setHours?.(...(String(refTimeSingle.current?.value ?? "").split(":")));
                changeAttr(refDateSingle.current, 'value', toFormatInput(newDate));
              }
            }}
          />
        </div>
      </Dropdown>
      {fm.invalids?.[name]?.length && (<div className="invalid-message">{fm.invalids?.[name]?.[0]}</div>)}
    </div>
  );
}