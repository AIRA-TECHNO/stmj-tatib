import { Dispatch, RefObject, SetStateAction, useCallback, useRef, useState } from "react";
import { TAnySchema } from "@sinclair/typebox";
import { customErrorMessages, customMessage, objectExtender, unProxy } from "../../general";
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);



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
      setValues(newValues);
      if (reset && typeof newValues != 'function') defaultValue.current = newValues;
    },
    invalids, setInvalids,
    statusCode, setStatusCode,
    show, setShow: (newValues: boolean | ((prevValue: boolean) => boolean), readOnly?: boolean, reset?: boolean) => {
      setShow(newValues);
      if (readOnly != undefined) setReadOnly(readOnly);
      if (reset && typeof newValues != 'function') {
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
 * Validator on submit form
 */
export const isRequired = (schema: any) => (schema && schema?.modifier != 'Optional');
export function validateForm({
  values,
  validations,
  setInvalids,
  invalids
}: {
  values: any;
  invalids: Record<string, string[]>;
  setInvalids: Dispatch<SetStateAction<Record<string, string[]>>>;
  validations: RefObject<Record<string, TAnySchema>>;
}) {
  const entryValidations = Object.entries(validations.current).sort((a, b) => a[0].localeCompare(b[0]));
  const newInvalids: Record<string, string[]> = {};
  if (entryValidations.length) {
    for (const [fieldName, schema] of entryValidations) {
      const validator = ajv.compile(customMessage(schema));
      if (!validator(values[fieldName])) {
        newInvalids[fieldName] = validator.errors?.map((err) => err.message) as any[];
      }
    }
    if (JSON.stringify(newInvalids) != JSON.stringify(invalids)) setInvalids(newInvalids);
  } else if (Object.keys(invalids).length) {
    setInvalids({})
  }
  return newInvalids;
}



/**
 * Validator on change single field input
 */
export function validateInput(fm: ReturnType<typeof useFormManager>, fieldName: string) {
  if (fm.values[fieldName] == undefined) {
    if (fm.invalids[fieldName]) {
      fm.setInvalids(({ ...prev }) => { delete prev?.[fieldName]; return prev; });
    }
    return;
  }
  const validator = ajv.compile(customMessage(fm.validations.current[fieldName]));
  validator(fm.values[fieldName]);
  const newInvalid = validator.errors?.map((err) => err.message) as any[];
  if (JSON.stringify(newInvalid) != JSON.stringify(fm.invalids[fieldName])) {
    fm.setInvalids(({ ...prev }) => {
      delete prev[fieldName];
      if (newInvalid) prev[fieldName] = newInvalid;
      return prev;
    });
  }
}



/**
 * triger change input
 */
export function changeAttr(target: any, attribute: string, value: any) {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, attribute)
    ?.set?.call(target, value);
  target.dispatchEvent(new Event('change', { bubbles: true }));
}



/**
 * On invalid BFF typebox validator
 */
export function onInvalid(invalids: Array<{ schema: Record<string, any>, path: string; message: string }>) {
  const result: Record<string, any> = {};
  for (const invalid of invalids) {
    const errorMessages: string[] = [];
    for (const schema of Object.entries(invalid.schema)) {
      const loadMessage = customErrorMessages[schema[0]];
      if (loadMessage) errorMessages.push(loadMessage(schema));
    }
    if (!errorMessages.length) errorMessages.push(invalid.message)
    result[invalid.path.split('/').filter(Boolean).join('.')] = errorMessages
  }
  return result;
}