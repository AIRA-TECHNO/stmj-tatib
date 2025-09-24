import { Dispatch, FormEvent, SetStateAction, useCallback, useRef, useState } from "react";
import { TAnySchema } from "@sinclair/typebox";
import { objectExtender, unProxy } from "../../general";
import { api } from "./api";
import { toast } from "react-toastify";



/**
 * Wrapper useState object extender. example: const [values, setValues] = useOx(useState({}));
 */
export function useOx<T>([getter, setter]: [T, Dispatch<SetStateAction<T>>]): [T, Dispatch<SetStateAction<T>>] {
  return [getter, (newStateValue) => {
    if (typeof newStateValue != 'function') return setter(newStateValue);
    setter((prev) => (unProxy((newStateValue as any)(objectExtender(prev as any) as T))))
  }]
}



/**
 * Hook form handler
 */
export function useFormManager<T extends Record<string, any>>() {
  const [values, setValues] = useState({} as T);
  const [invalids, setInvalids] = useState<Record<string, string[]>>({});
  const [statusCode, setStatusCode] = useState(200);
  const [show, setShow] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disable, setDisable] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const validations = useRef<Record<string, TAnySchema>>({});
  const defaultValue = useRef({} as T);
  const btnSubmit = useRef<HTMLButtonElement>(null);

  const setValue = useCallback(<K extends keyof T>(name: string, newValue: T[K] | ((prevValue: T[K]) => T[K])) => {
    if (!name) return;
    setValues((prev) => {
      const fieldNames = String(name).split('.');
      const lastFieldName = String(fieldNames.pop());
      const newValues = fieldNames.reduce((nv, key) => {
        if (!nv[key]) nv[key] = {};
        return nv[key];
      }, ({ ...(prev ?? {}) }) as any);
      if (typeof newValue === 'function') {
        newValues[lastFieldName] = (newValue as any)(newValues[lastFieldName]);
      } else {
        newValues[lastFieldName] = newValue;
      }
      return { ...newValues };
    });
  }, []);

  return {
    values,
    setValues: (newValues: T | ((prevValue: T) => T), reset?: boolean) => {
      setValues((prev) => {
        let implementedValues = newValues as T;
        if (typeof newValues == 'function') implementedValues = newValues(prev);
        if (reset) defaultValue.current = implementedValues;
        return implementedValues;
      });
    },
    invalids, setInvalids,
    statusCode, setStatusCode,
    show,
    setShow: (newShow: boolean | ((prevValue: boolean) => boolean), readOnly?: boolean, reset?: boolean) => {
      setShow(newShow);
      if (readOnly != undefined) setReadOnly(readOnly);
      if (reset) {
        defaultValue.current = {} as T;
        setValues({} as T);
      };
    },
    readOnly, setReadOnly,
    disable, setDisable,
    validations, setValue,
    confirmDelete, setConfirmDelete,
    defaultValue, btnSubmit,
  };
}



/**
 * triger change input
 */
export function changeAttr(target: any, attribute: string, value: any) {
  if (!target) return null;
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attribute)?.set?.call?.(target, value);
  target.dispatchEvent(new Event('change', { bubbles: true }));
}



/**
 * Handle submit normal form
 */
export interface typeActionApi {
  url: string;
  primaryKeyValue?: string | number;
  methodSubmit?: string;
  preSubmit?: (data: Record<string, any>) => any;
  afterSubmit?: (json: Record<string, any>) => any;
}
export function onSubmitNormal(event: FormEvent<HTMLFormElement>, fm: ReturnType<typeof useFormManager>, actionApi: typeActionApi) {
  event.preventDefault();
  fm?.setStatusCode(202);
  const formData = new FormData(event.target as HTMLFormElement);
  api({
    url: [actionApi?.url, actionApi.primaryKeyValue].filter(Boolean).join('/'),
    method: actionApi?.methodSubmit ?? (actionApi.primaryKeyValue ? 'PUT' : 'POST'),
    body: actionApi.preSubmit ? actionApi.preSubmit(formData) : formData
  }).then(async (res) => {
    fm?.setStatusCode(res.status);
    if (res.status == 200) {
      actionApi.afterSubmit?.(await res.json());
    } else {
      const { invalids, message } = (await res.json());
      toast.error(message);
      if (invalids) fm?.setInvalids((prev) => ({ ...prev, ...invalids }));
    }
  });
}