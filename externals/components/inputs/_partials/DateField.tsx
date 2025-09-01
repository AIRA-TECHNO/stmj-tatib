'use client'

import React, { useEffect, useRef } from 'react';
import { toMiliSecond } from '@/externals/utils/general';

export default function DateField({
  onChange,
  value,
  type,
}: {
  onChange?: (newVal: string) => any;
  value?: string;
  type?: "date" | "datetime-local";
}) {
  const refDate = useRef<HTMLSpanElement>(null);
  const refMonth = useRef<HTMLSpanElement>(null);
  const refYear = useRef<HTMLSpanElement>(null);
  const refTime = useRef<HTMLInputElement>(null);
  const refDateValue = useRef("00");
  const refMonthValue = useRef("00");
  const refYearValue = useRef("0000");
  const refIsReset = useRef(true);



  /**
   * Function handler
   */
  function getValue() {
    let localVal = `${refYearValue.current}-${refMonthValue.current}-${refDateValue.current}`;
    if (type == "datetime-local") localVal += `T${refTime.current?.value || "00:00"}`;
    return isNaN(Number(new Date(localVal))) ? '' : localVal;
  }

  function syncValue(d: Date | null) {
    if (refYear.current) {
      refYearValue.current = !d ? '' : String(d.getFullYear());
      refYear.current.innerText = refYearValue.current;
    }
    if (refMonth.current) {
      refMonthValue.current = !d ? '' : String(d.getMonth() + 1).padStart(2, '0');
      refMonth.current.innerText = refMonthValue.current || 'mm';
    }
    if (refDate.current) {
      refDateValue.current = !d ? '' : String(d.getDate()).padStart(2, '0');
      refDate.current.innerText = refDateValue.current || 'dd';
    }
    if (refTime.current && type == "datetime-local") {
      refTime.current.value = !d ? '' : String(d.getHours()).padStart(2, '0') + ":" + String(d.getMinutes()).padStart(2, '0');
    }
    onChange?.(getValue());
  }

  function markAll(event: any) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(event.target);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handleFocus(event: any) {
    markAll(event);
    refIsReset.current = true;
  }



  /**
   * useEffect
   */
  useEffect(() => {
    if (![undefined, getValue()].includes(value)) syncValue(value ? new Date(toMiliSecond(value)) : null);
  }, [value]);



  /**
   * Render JSX
   */
  return (
    <div className='flex gap-x-[1px] [&_*:focus]:outline-none'>
      <span
        ref={refDate}
        contentEditable suppressContentEditableWarning
        onInput={(e) => {
          const element = e.target as any;
          let newVal = refDateValue.current || "00";
          if (element?.innerText == "\n\n") {
            element.innerText = newVal;
            return refMonth.current?.focus();
          }
          if (element?.innerText == `\n`) {
            element.innerText = "dd";
            refDateValue.current = "00";
            return markAll(e);
          }
          const newChar = Number(element?.innerText);
          if (isNaN(newChar)) {
            element.innerText = Number(refDateValue.current) ? refDateValue.current : "dd";
            return markAll(e);
          }
          newVal = `${refIsReset.current ? "00" : refDateValue.current}${newChar}`.slice(-2);
          if (Number(newVal[0]) > 3) newVal = `0${newVal[1]}`;
          if (Number(newVal) > 31) newVal = `31`;
          element.innerText = newVal;
          refIsReset.current = false;
          refDateValue.current = element.innerText;
          onChange?.(getValue());
          if (element.innerText[0] != "0" || Number(element.innerText[1]) > 3) refMonth.current?.focus();
          else markAll(e);
        }}
        onClick={markAll}
        onFocus={handleFocus}
      >dd</span>
      <span>/</span>
      <span
        ref={refMonth}
        contentEditable suppressContentEditableWarning
        onInput={(e) => {
          const element = e.target as any;
          let newVal = refMonthValue.current || "00";
          if (element?.innerText == "\n\n") {
            element.innerText = newVal;
            return refMonth.current?.focus();
          }
          if (element?.innerText == `\n`) {
            element.innerText = "mm";
            refMonthValue.current = "00";
            return markAll(e);
          }
          const newChar = Number(element?.innerText);
          if (isNaN(newChar)) {
            element.innerText = Number(refMonthValue.current) ? refMonthValue.current : "mm";
            return markAll(e);
          }
          element.innerText = `${refIsReset.current ? "00" : refMonthValue.current}${isNaN(newChar) ? "" : newChar}`.slice(-2);
          refIsReset.current = false;
          refMonthValue.current = element.innerText;
          onChange?.(getValue());
          if (!["00", "01"].includes(element.innerText)) refYear.current?.focus();
          else markAll(e);
        }}
        onClick={markAll}
        onFocus={handleFocus}
      >mm</span>
      <span>/</span>
      <span
        ref={refYear}
        contentEditable suppressContentEditableWarning
        onInput={(e) => {
          const element = e.target as any;
          if (element?.innerText == "\n\n") return refTime.current?.focus();
          let newVal = refYearValue.current || "00";
          if (element?.innerText == "\n\n") {
            element.innerText = newVal;
            return refMonth.current?.focus();
          }
          if (element?.innerText == `\n`) {
            element.innerText = "yyyy";
            refYearValue.current = "0000";
            return markAll(e);
          }
          const newChar = Number(element?.innerText);
          if (isNaN(newChar)) {
            element.innerText = Number(refYearValue.current) ? refYearValue.current : "yyyy";
            return markAll(e);
          }
          element.innerText = `${refIsReset.current ? "0000" : refYearValue.current}${isNaN(newChar) ? "" : newChar}`.slice(-4);
          refIsReset.current = false;
          refYearValue.current = element.innerText;
          onChange?.(getValue());
          if (element.innerText[0] != "0") refTime.current?.focus();
          else markAll(e);
        }}
        onClick={markAll}
        onFocus={handleFocus}
      >yyyy</span>
      {type == "datetime-local" && (
        <input
          ref={refTime} type="time" className='hide-icon ml-1 cursor-text w-[4.5rem]'
          onChange={() => onChange?.(getValue())}
        />
      )}
    </div>
  );
}
