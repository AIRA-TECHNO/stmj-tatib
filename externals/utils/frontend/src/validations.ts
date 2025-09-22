import { TAnySchema } from "@sinclair/typebox";
import { Dispatch, RefObject, SetStateAction } from "react";
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import { useFormManager } from "./helperForm";
import { masterInvalidMessages } from "../../general/src/validations";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
ajvErrors(ajv);




export function ajvCustomInvalids<T>(schema: T): T {
  const errorMessage: Record<string, string> = {};
  for (const keySchema of Object.keys(schema as any)) {
    const masterInvalidMessage = masterInvalidMessages.find((mim) => mim.keySchema == keySchema);
    if (masterInvalidMessage) errorMessage[keySchema] = masterInvalidMessage.handler(schema);
  }
  return { ...schema, errorMessage: { ...(schema as any).errorMessage || {}, ...errorMessage } } as T
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
      const validator = ajv.compile(ajvCustomInvalids(schema));
      if (!validator(values[fieldName])) {
        newInvalids[fieldName] = validator.errors?.map((err) => err.message) as any[];
      }
    }
    if (JSON.stringify(newInvalids) != JSON.stringify(invalids)) setInvalids(newInvalids);
  } else if (Object.keys(invalids).length) setInvalids({});
  return newInvalids;
}



/**
 * Validator on change single field input
 */
export function validateInput(fm: ReturnType<typeof useFormManager>, fieldName: string) {
  if (fm.values[fieldName] == undefined) {
    if (fm.invalids[fieldName]) fm.setInvalids(({ ...prev }) => { delete prev?.[fieldName]; return prev; });
    return;
  }
  const validator = ajv.compile(ajvCustomInvalids(fm.validations.current[fieldName]));
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