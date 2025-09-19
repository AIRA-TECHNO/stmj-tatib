'use client'

import React, { useEffect, useId, useRef } from "react"
import { typeInputProps } from "../Input"
import { cn, isRequired, useFormManager } from "@/externals/utils/frontend"
import { DownloadSimpleIcon, FileArrowUpIcon, XCircleIcon } from "@phosphor-icons/react"

export default function InputFile({
  fm,
  noLabel,
  isCleanup,
  noUnset,
  validation,

  placeholder,
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
}: Omit<typeInputProps, "defaultValue"> & { noUnset?: boolean }) {
  const refInput = useRef<HTMLInputElement>(null);
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
  return (
    <div className={cn("input-group", { "input-group-invalid": fm.invalids?.[name]?.length })}>
      {!noLabel && (
        <div className={cn("label-input-form", 'mx-2 px-1')} onClick={() => refInput.current?.click()}>
          {label ?? name} {isRequired(validation) && <span className="text-rose-600">*</span>}
        </div>
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
          onClick={() => !(disabled || readOnly) && refInput.current?.click()}
          className={cn(
            "input-form flex items-center gap-1 border pl-1 pr-3",
            { "cursor-pointer": !(disabled || readOnly) },
            className
          )}
        >
          <div className="h-3/4 aspect-square flex items-center justify-center">
            <FileArrowUpIcon className="text-xl h-[calc(100%-10px)]" />
          </div>
          <div>{placeholder ?? "Pilih file"}</div>
        </div>
      ) : (
        <div className={cn("input-form flex items-center px-2", 'border pl-1 pr-3', className)}>
          <div className="flex items-center gap-1 h-full">
            <a
              className="h-3/4 aspect-square flex items-center justify-center rounded-full hover:bg-primary/10 hover:text-primary"
              target="_blank" rel="noreferrer"
              href={fm.values[name] instanceof File ? URL.createObjectURL(fm.values[name]) : fm.values[name]}
            ><DownloadSimpleIcon className="h-[calc(100%-10px)]" /></a>
            <div className="truncate block max-w-[12rem]">{fm.values[name]?.name ?? fm.values[name]}</div>
          </div>
          {!(noUnset || disabled || readOnly) && (
            <div className="ml-auto h-full flex items-center justify-center">
              <XCircleIcon
                className="h-[calc(75%-6px)] cursor-pointer hover:text-danger"
                onClick={() => {
                  if (refInput.current) {
                    (Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set)?.call?.(refInput.current, null);
                    refInput.current.dispatchEvent(new Event("change", { bubbles: true }));
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      {Boolean(fm.invalids?.[name]?.length) && (<div className="invalid-message">{fm.invalids[name][0]}</div>)}
    </div>
  )
}
