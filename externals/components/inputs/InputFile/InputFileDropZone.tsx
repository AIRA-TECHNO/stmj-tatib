'use client'

import React, { useEffect, useId, useRef } from "react"
import { typeInputProps } from "../Input"
import { cn, isRequired, useFormManager } from "@/externals/utils/frontend"
import { DownloadSimpleIcon, FileArrowUpIcon, FileTextIcon, TrashIcon, XCircleIcon } from "@phosphor-icons/react"
import { formatFileSize } from "@/externals/utils/general"

export default function InputFileDropZone({
  fm,
  noLabel,
  isCleanup,
  noUnset,
  validation,

  disabled,
  readOnly,
  className,
  onChange,
  required,
  accept,
  label,
  value,
  name,
  id,

  ...props
}: Omit<typeInputProps, "defaultValue" | "placeholder"> & { noUnset?: boolean }) {
  const refInput = useRef<HTMLInputElement>(null);
  const refDropZone = useRef<HTMLDivElement>(null);
  if (!fm) fm = useFormManager();
  if (!name) name = useId();



  /**
   * Use effect
   */
  useEffect(() => {
    if (validation) fm.validations.current[name] = validation
  }, [validation]);

  useEffect(() => {
    if (refInput.current && refInput.current?.files?.[0] != value) {
      if (value instanceof File) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(value)
        refInput.current.files = dataTransfer.files
      } else (Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set)?.call?.(refInput.current, null);
      refInput.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [value]);

  useEffect(() => {
    if (fm.values?.[name] instanceof File && refInput.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(fm.values[name])
      refInput.current.files = dataTransfer.files
    }
  }, [fm.values?.[name]]);

  useEffect(() => () => {
    if (isCleanup) {
      fm.setValues(({ ...prev }) => { delete prev?.[name]; return prev; });
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
    }
  }, []);



  /**
   * Render JSX
   */
  const isFile = fm.values[name] instanceof File;
  return (
    <div className={cn("input-group rounded-xl sm:border sm:shadow sm:p-4 sm:pb-6", className)}>
      {!noLabel && (
        <div className="text-lg font-semibold mb-6">{label ?? name} {isRequired(validation) && <span className="text-rose-600">*</span>}</div>
      )}

      <input
        ref={refInput}
        type="file"
        id={id ?? name}
        name={name}
        style={{ display: "none" }}
        accept={accept}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(e) => {
          const blobFile = e.target.files?.[0];
          const invalids: string[] = [];
          if (!blobFile && required) invalids.push("Field tidak boleh kosong!");
          if (accept && blobFile) {
            const rule = accept.replaceAll(" ", "").replaceAll(",", "|").replaceAll("/*", "[/*]")
            const extName = blobFile.name.split(".").pop() ?? ""
            if (!(new RegExp(rule).test(blobFile.type) || new RegExp(rule).test(`.${extName}`))) {
              invalids.push(`File harus bertipe ${accept}`)
            }
          }
          fm.setValues((prev) => ({ ...prev, [name]: blobFile }));
          if (JSON.stringify(invalids) != JSON.stringify(fm.invalids[name])) fm.setInvalids((prev) => ({ ...prev, [name]: invalids }));
          if (onChange) onChange(e);
        }}
        {...props}
      />
      {!fm.values?.[name] ? (
        <div
          onDrop={(e) => {
            e.preventDefault();
            if (refInput.current) {
              refInput.current.files = e.dataTransfer.files;
              refInput.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (refDropZone.current) refDropZone.current.style.position = 'absolute';
          }
          }
          onDragLeave={(e) => {
            e.preventDefault();
            if (refDropZone.current && refDropZone.current == e.target) refDropZone.current.style.removeProperty('position');
          }}
        >
          <div className="rounded-2xl border border-dashed border-primary pt-[2rem] pb-[1.5rem] text-center relative overflow-hidden">
            <div ref={refDropZone} className="inset-0 bg-primary/10"></div>
            <FileArrowUpIcon className='m-auto text-7xl text-gray-500' />
            <div className='mt-2 font-semibold'>Seret & lepas file disini</div>
            <div className='text-sm mt- mb-1 text-gray-600'>atau</div>
            <div
              className='btn tracking-widest rounded-lg font-normal' onClick={() => !(disabled || readOnly) && refInput.current?.click()}
            >Pilih File</div>
          </div>
        </div>
      ) : (
        <div className={cn("rounded-xl border flex items-center px-2 sm:px-4 py-4 gap-2 sm:gap-3", { "border-danger bg-danger/5": fm.invalids?.[name]?.length })}>
          <FileTextIcon className='text-6xl text-gray-500' />
          <div>
            <div className="text-sm truncate max-w-[14rem]">{fm.values[name]?.name ?? fm.values[name]}</div>
            <div className="text-xs text-gray-500 font-medium">{isFile ? formatFileSize(fm.values[name]?.size) : '-'}</div>
            <div className="flex items-center text-xs gap-4 mt-2">
              {!noUnset && (
                <div
                  className="flex items-center gap-1 font-medium text-danger cursor-pointer rounded hover:bg-danger/10 py-0.5"
                  onClick={() => {
                    if (refInput.current) {
                      (Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set)?.call?.(refInput.current, null);
                      refInput.current.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                  }}
                >
                  <TrashIcon weight="bold" />
                  <span>Delete</span>
                </div>
              )}
              <a
                className="flex items-center gap-1 font-medium text-primary cursor-pointer rounded hover:bg-primary/10 py-0.5"
                target="_blank" rel="noreferrer"
                href={isFile ? URL.createObjectURL(fm.values[name]) : fm.values[name]}
              >
                <DownloadSimpleIcon weight="bold" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      )}
      {Boolean(fm.invalids?.[name]?.length) && (<div className="invalid-message">{fm.invalids[name][0]}</div>)}
    </div>
  )
}
