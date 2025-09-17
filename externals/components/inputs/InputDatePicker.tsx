/**
 * Input date with minimal props. unintegrated with useFormManager
 */

'use client'

import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { changeAttr, cn } from '@/externals/utils/frontend';
import { DayPicker } from 'react-day-picker';
import { id as localeID } from "react-day-picker/locale";
import Dropdown from '../popups/Dropdown';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import DateField from './_partials/DateField';

export default function InputDatePicker({
  mode = "single",
  label,
  noLabel,
  required,
  invalidMessages,
  className,
  onChange,
  value,
  name,
  type,
  id,
}: {
  mode?: "single" | "multiple" | "range";
  label?: ReactNode;
  noLabel?: boolean;
  required?: boolean;
  invalidMessages?: string[];

  className?: string;
  onChange?: (newVal: ChangeEvent<HTMLInputElement>, index?: any) => any;
  value?: any;
  name: string;
  type?: "date" | "datetime-local";
  id?: string;
}) {
  const isDateTime = type == "datetime-local";
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
  const [Selected, setSelected] = useState<any>();



  /**
   * Function handler
   */
  function onChangeMultiple() {
    (Selected as any[]).forEach((val, index) => {
      changeAttr(refDateMultiples.current[index], 'value', val)
    })
  }

  function toFormatInput(date: any, withTime?: boolean) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(Number(d))) return '';
    let result = String(d.getFullYear());
    result += '-' + String(d.getMonth() + 1).padStart(2, '0');
    result += '-' + String(d.getDate()).padStart(2, '0');
    if (withTime) {
      result += "T" + String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0');
    }
    return result;
  }



  /**
   * useEffect
   */
  useEffect(() => {
    if (value != undefined && JSON.stringify(value) != JSON.stringify(Selected)) {
      if (mode == "multiple") {
        const newSelecteds: any[] = (Array.isArray(value) ? value : [value?.start_at ?? value, value?.end_at])
          .filter((ns) => ns).map((ns) => toFormatInput(ns, isDateTime));
        setSelected(newSelecteds);
        onChangeMultiple();
      } else if (mode == "range") {
        const newStartAt = toFormatInput(value?.start_at ?? (Array.isArray(value) ? value?.[0] : value));
        const newEndAt = toFormatInput(value?.end_at ?? (Array.isArray(value) ? value?.[1] : value));
        changeAttr(refDateStart.current, 'value', newStartAt);
        changeAttr(refDateEnd.current, 'value', newEndAt);
      } else {
        const newSelected = toFormatInput(value?.start_at ?? (Array.isArray(value) ? value?.[0] : value), isDateTime);
        changeAttr(refDateSingle.current, 'value', newSelected);
      }
    }
  }, [value]);

  useEffect(() => {
    if (refMode.current != mode) {
      if (refMode.current) {
        if (mode == "multiple") {
          if (!Array.isArray(Selected)) {
            const newSelecteds = [Selected?.start_at ?? Selected, Selected?.end_at].filter((s) => s);
            setSelected(newSelecteds);
            onChangeMultiple();
          }
        } else if (mode == "range") {
          if (!["start_at", "end_at"].find((k) => Object.keys(Selected).includes(k))) {
            const newStartAt = (typeof Selected == "string") ? Selected : Selected?.[0];
            const newEndAt = (typeof Selected == "string") ? Selected : Selected?.[0];
            if (newStartAt) changeAttr(refDateStart.current, 'value', newStartAt);
            if (newEndAt) changeAttr(refDateEnd.current, 'value', newEndAt);
          }
        } else if (typeof Selected != "string") {
          changeAttr(refDateSingle.current, 'value', (Selected?.start_at ?? Selected?.[0] ?? ''));
        }
      }
      refMode.current = mode
    }
  }, [mode]);



  /**
   * Render JSX
   */
  const inputRect = refWrapper.current?.parentElement?.getBoundingClientRect() ?? {} as DOMRect;
  const showAbove = (typeof window == 'undefined' ? 0 : window.innerHeight) - inputRect.bottom < dropdownHeight && inputRect.top > dropdownHeight;
  return (
    <div className={cn("input-group relative", className, { "input-group-invalid": invalidMessages?.length })}>
      {!noLabel && (
        <label onClick={() => setIsFocus(true)} className="label-input-form" htmlFor={id ?? name}>
          {label ?? name}{Boolean(required) && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div ref={refWrapper} className='input-form flex items-center gap-1'>
        {(() => {
          if (mode == "multiple") {
            // formatting value
            return ((Array.isArray(Selected) ? Selected : [null]).map((s, indexS) => (
              <div key={indexS} className='flex items-center'>
                <input className='hidden' ref={(el) => { refDateMultiples.current[indexS] = el }} onChange={(e) => onChange?.(e, indexS)} />
                <span>{s}</span>
                <span onClick={() => { setSelected((prev: any[]) => prev.filter((_, rmId) => indexS != rmId)) }}>
                  x
                </span>
              </div>
            )));
          } else if (mode == "range") {
            return (<>
              <input className='hidden' ref={refDateStart} onChange={(e) => {
                onChange?.(e, "start");
                setSelected((prev: any) => ({ start_at: e.target.value, end_at: prev?.end_at ?? "" }));
              }} />
              <DateField
                type={type} value={Selected?.start_at}
                onChange={(newVal) => { changeAttr(refDateStart.current, 'value', newVal) }}
              />
              <span className='pl-2 pr-3'>s/d</span>
              <input className='hidden' ref={refDateEnd} onChange={(e) => {
                onChange?.(e, "end");
                setSelected((prev: any) => ({ start_at: prev?.start_at ?? "", end_at: e.target.value }));
              }} />
              <DateField
                type={type} value={Selected?.end_at}
                onChange={(newVal) => { changeAttr(refDateEnd.current, 'value', newVal) }}
              />
            </>);
          } else {
            return (<>
              <input className='hidden' ref={refDateSingle} onChange={(e) => {
                onChange?.(e);
                setSelected(e.target.value);
              }} />
              <DateField
                type={type} value={Selected}
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
          {(isDateTime && mode != "multiple") && (<>
            {mode == "range" ? (
              <div>
                <input
                  ref={refTimeStart} type="time" className='absolute right-3 top-4 z-[1]'
                  defaultValue={String(Selected?.start_at ?? '').split("T")[1] ?? "00:00"}
                  onChange={(e) => {
                    changeAttr(refDateStart.current, 'value', `${String(Selected?.start_at ?? '').split("T")[0]}T${e.target.value}`)
                  }}
                />
                <input
                  ref={refTimeEnd} type="time" className='absolute right-3 top-4 z-[1]'
                  defaultValue={String(Selected?.end_at ?? '').split("T")[1] ?? "00:00"}
                  onChange={(e) => {
                    changeAttr(refDateEnd.current, 'value', `${String(Selected?.end_at ?? '').split("T")[0]}T${e.target.value}`)
                  }}
                />
              </div>
            ) : (
              <input
                ref={refTimeSingle} type="time" className='absolute right-3 top-4 z-[1]'
                defaultValue={String(Selected ?? '').split("T")[1] ?? "00:00"}
                onChange={(e) => {
                  changeAttr(refDateSingle.current, 'value', `${String(Selected).split("T")[0]}T${e.target.value}`)
                }}
              />
            )}
          </>)}
          <DayPicker
            animate hideNavigation captionLayout="dropdown" locale={localeID} mode={(mode ?? "single") as any}
            selected={(() => {
              if (mode == "multiple") return (Selected as any[])?.map((s) => new Date(s));
              if (mode == "range") {
                const displayed: any = {};
                if (Selected?.start_at) displayed.start_at = new Date(Selected?.start_at);
                if (Selected?.end_at) displayed.end_at = new Date(Selected?.end_at);
                return displayed;
              }
              return new Date(Selected);
            })()}
            onSelect={(newDate: any) => {
              if (mode == "multiple") {
                return (Selected as any[])?.map((s) => toFormatInput(s));
              } else if (mode == "range") {
                if (newDate?.start_at) newDate.start_at.setHours?.(...(String(refTimeStart.current?.value ?? "").split(":")));
                if (newDate?.end_at) newDate.end_at.setHours?.(...(String(refTimeEnd.current?.value ?? "").split(":")));
                changeAttr(refDateStart.current, 'value', toFormatInput(newDate?.start_at, isDateTime));
                changeAttr(refDateEnd.current, 'value', toFormatInput(newDate?.end_at, isDateTime));
              } else {
                if (newDate) newDate.setHours?.(...(String(refTimeSingle.current?.value ?? "").split(":")));
                changeAttr(refDateSingle.current, 'value', toFormatInput(newDate, isDateTime));
              }
            }}
          />
        </div>
      </Dropdown>
      {invalidMessages?.length && (<div className="invalid-message">{invalidMessages?.[0]}</div>)}
    </div>
  );
}
