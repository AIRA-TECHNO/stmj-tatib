'use client'
import { ReactNode, useEffect, useId, useRef, useState } from 'react'
import { api, changeAttr, cn, isRequired, useFormManager } from '@/externals/utils/frontend';
import { CaretDown } from '@phosphor-icons/react';
import { typeInputProps } from './Input';

export interface typeSelectProps {
  options?: Array<string | number | { label: ReactNode; value: any }>;
  optionFromApi?: {
    primaryKey?: string;
    url: string;
    render: (data: Record<string, any>[]) => ({ label: ReactNode; value: string | number }[]);
  };
  onSearch?: (value: string) => any;
  noSearch?: boolean;
  noUnset?: boolean;
  noIcon?: boolean;
}

export default function Select({
  noIcon,
  noLabel,
  noUnset,
  onSearch,
  isCleanup,
  validation,
  noSearch,
  options,
  optionFromApi,

  fm,
  label,
  disabled,
  readOnly,
  defaultValue,
  placeholder,
  className,
  onChange,
  value,
  name,
  id,

  ...props
}: typeInputProps & typeSelectProps) {
  if (!fm) fm = useFormManager();
  if (!name) name = useId();
  const dropdownHeight = 150;
  const refInput = useRef<HTMLInputElement>(null);
  const refLoading = useRef<HTMLDivElement>(null);
  const refDropDown = useRef<HTMLDivElement>(null);
  const refLoadOption = useRef({ is_loading: false, current_page: 0, last_page: 1 });
  const refRequestId = useRef<Record<string, number>>({});
  const [IsFocus, setIsFocus] = useState(false);
  const [Search, setSearch] = useState('');
  const [CurrentOptions, setCurrentOptions] = useState<any[]>([]);



  /**
   * Function Handler
   */
  async function loadOptions(selected?: any) {
    if (!optionFromApi || options) return;
    refLoadOption.current.is_loading = true;
    const selectedOption = selected || refInput.current?.value;
    const currentPage = refLoadOption.current.current_page;
    const objParams = { search: Search, page: currentPage + 1 };
    if (objParams.page > refLoadOption.current.last_page) return;

    // Handle overlap on fetching data
    const now = Date.now();
    const requestKey = JSON.stringify(objParams);
    refRequestId.current[requestKey] = now;

    // Fetching new options
    const resOptions = await api({ url: optionFromApi.url, objParams });
    if ((resOptions.status == 200) && (now >= refRequestId.current[requestKey])) {
      const { data, paginate } = await resOptions.json();
      let newOptions: any[] = optionFromApi.render(data || []);
      refLoadOption.current = { ...refLoadOption.current, ...(paginate || {}) };

      // Fetching options matched with selected option 
      if (selectedOption && ![...((currentPage != 0) ? [...CurrentOptions] : []), ...newOptions]
        .find((opt) => (opt?.value ?? opt) == selectedOption)) {
        const primaryKey = optionFromApi.primaryKey ?? 'id';
        const resSelectedOption = await api({ url: optionFromApi.url, objParams: { [primaryKey]: selectedOption } });
        if (resSelectedOption.status == 200) {
          newOptions = [...optionFromApi.render((await resSelectedOption.json())?.data || []), ...newOptions];
        }

        // Unset selected option if data not found
        if (!newOptions.find((opt) => ((opt?.value ?? opt) == selectedOption))) {
          changeAttr(refInput.current, 'value', '');
        }
      }

      // Final state. (Check append for accommodar non search)
      setCurrentOptions((prev) => ([...((currentPage != 0) ? prev : []), ...newOptions]));
      refLoadOption.current.is_loading = false;
    }
  }



  /**
   * Use Effect
   */
  useEffect(() => {
    if (validation) fm.validations.current[name] = validation
  }, [validation]);

  useEffect(() => { if (Array.isArray(options)) setCurrentOptions(options) }, [options]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      refLoadOption.current.current_page = 0;
      loadOptions();
    }, 1000);
    return (() => clearTimeout(delaySearch));
  }, [Search]);

  useEffect(() => {
    // select new value
    let newValue = fm?.values?.[name];
    if (![undefined, newValue].includes(value)) {
      newValue = value;
    } else if (defaultValue != undefined && newValue == undefined) {
      newValue = defaultValue;
    } else if (noUnset && !newValue && CurrentOptions?.length) {
      newValue = CurrentOptions[0]?.value ?? CurrentOptions[0];
    }

    // get selected option
    const selectedOption = CurrentOptions?.find((opt) => ((opt?.value ?? opt) == fm?.values?.[name]))

    if (newValue && !selectedOption) {
      loadOptions(newValue)
    } else {
      // set value hidden html input
      if (refInput.current && refInput.current.value != (newValue ?? '')) {
        refInput.current.value = newValue ?? '';
      }

      // set state form handler
      if (fm?.values?.[name] != newValue) fm.setValues((prev) => ({ ...prev, [name]: newValue }));
    }
  }, [fm?.values?.[name], value, defaultValue, CurrentOptions, refInput]);

  useEffect(() => () => {
    if (isCleanup) {
      fm.setValues(({ ...prev }) => { delete prev?.[name]; return prev; });
      fm.setInvalids(({ ...prev }) => { delete prev?.[name]; return prev; });
      delete fm.validations.current[name];
    }
  }, []);


  useEffect(() => {
    let observer = {} as IntersectionObserver;

    if (IsFocus) {
      observer = new IntersectionObserver((entries) => {
        if (optionFromApi && entries[0].isIntersecting) {
          const { is_loading, current_page, last_page } = refLoadOption.current;
          if (!is_loading && current_page < last_page) loadOptions();
        }
      }, { root: refDropDown.current, rootMargin: "0px", threshold: 0.1, });
      if (refLoading.current) observer.observe(refLoading.current);
    }

    return () => { if (observer instanceof IntersectionObserver) observer.disconnect(); };
  }, [IsFocus]);



  /**
   * Rendered JSX
   */
  const selectedOption = CurrentOptions?.find((opt) => ((opt?.value ?? opt) == fm?.values?.[name]));
  const inputRect = refInput.current?.parentElement?.getBoundingClientRect() ?? {} as DOMRect;
  const showAbove = (typeof window == 'undefined' ? 0 : window.innerHeight) - inputRect.bottom < dropdownHeight && inputRect.top > dropdownHeight;
  return (
    <div className='relative'>
      <div className={cn("input-group", className, { 'input-group-invalid': fm.invalids?.[name]?.length })}>
        {(!noLabel) && (
          <label onClick={() => { if (!(disabled || readOnly)) setIsFocus(true) }} className='label-input-form'>
            {label ?? name}
            {isRequired(validation) && <span className="text-rose-600">*</span>}
          </label>
        )}
        <div className="flex items-center cursor-pointer">
          <input
            {...props} ref={refInput} id={id ?? name} name={name}
            disabled={disabled} readOnly={readOnly} type='text'
            style={{ display: 'none', ...(props?.style ?? {}) }}
            onChange={(e) => {
              if (onChange) onChange(e)
              fm.setValues((prev) => ({ ...prev, [name]: e.target.value }))
            }}
          />
          <div
            className={cn(`input-form`, {
              'cursor-default': disabled || readOnly,
              'input-form-disabled': disabled,
              'input-form-focus': IsFocus
            })}
            onClick={() => { if (!(disabled || readOnly)) setIsFocus(true) }}
          >
            <div className='h-full flex items-center mr-3'>
              {selectedOption?.label ?? selectedOption ?? (<span className='text-gray-400'>{placeholder}</span>)}
            </div>
          </div>
          {!(noIcon || disabled || readOnly) && (
            <div onClick={() => { if (!(disabled || readOnly)) setIsFocus(true) }}>
              <CaretDown className='-ml-6 w-6' />
            </div>
          )}
        </div>
        {Boolean(fm?.invalids?.[name]?.length) && (<div className='invalid-message'>{fm?.invalids?.[name][0]}</div>)}
      </div>
      {IsFocus && (
        <div ref={refDropDown} className={`absolute inset-x-0 z-10 py-2 ${showAbove ? "bottom-full" : "top-full"}`}>
          <div className="card rounded-lg border min-w-min">
            <div className={noSearch ? 'opacity-0 h-0' : 'p-2'}>
              <input
                autoFocus={true} readOnly={noSearch}
                className='input-form focus:border-gray-300'
                onChange={(e) => {
                  setSearch((e.target.value) ?? '')
                  if (onSearch) onSearch(e.target.value ?? '')
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsFocus(false)
                    setSearch('')
                  }, 300)
                }}
              />
            </div>
            <div className="relative overflow-auto" style={{ maxHeight: `${dropdownHeight}px` }}>
              <div className='divide-y border-t'>
                {[
                  ...((noUnset || isRequired(validation)) ? [] : [{ value: '', label: "-- Pilih --" }]),
                  ...(CurrentOptions ?? []).filter((opt) => String(opt?.label ?? opt).toLowerCase().includes(Search?.toLowerCase()))
                ].map((option, indexOption) => {
                  const newValue = option?.value ?? option;
                  return (
                    <div
                      key={indexOption}
                      className={cn(
                        "truncate hover:bg-sky-200/30 min-h-10 flex items-center px-3 cursor-pointer",
                        { 'bg-sky-200/30': (newValue == fm?.values?.[name]) }
                      )}
                      onClick={() => {
                        if (fm?.values?.[name] != newValue) changeAttr(refInput.current, 'value', newValue);
                      }}
                    >{option?.label ?? option}</div>
                  )
                })}
                <div ref={refLoading} className="py-2">
                  {optionFromApi && (refLoadOption.current.current_page < refLoadOption.current.last_page) && (
                    <div className="text-sm text-center text-gray-500">Loading...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
