import { ErrorHandler } from "elysia";
import { HTTPException } from "./http-exception";
import { masterInvalidMessages } from "../../general/src/validations";

export const HookOnError: ErrorHandler = ({ error, code, set }) => {
  if (code == "VALIDATION" && error.type == 'body') {
    const invalids: Record<string, any[]> = {};
    // const defaultInvalids: Record<string, any[]> = {}; // <-- Just for tracing typeCode error, cause typeCode at masterInvalidMessages is 0
    for (const err of (error.all as any[])) {
      const fieldName = err.path.split('/').filter(Boolean).join('.');
      const masterInvalidMessage = masterInvalidMessages.find((mim) => mim.typeCode == err.type);
      if (masterInvalidMessage) invalids[fieldName] = [...(invalids[fieldName] ?? []), masterInvalidMessage.handler(err.schema)];
      // defaultInvalids[fieldName] = [...(defaultInvalids[fieldName] ?? []), { schema: err.schema, message: err.message, type: err.type }];
    }
    return {
      message: "Invalid request!",
      invalids,
      // defaultInvalids
    }
  } else if (error instanceof HTTPException) {
    set.status = error.status;
    return { error: error.message, ...(error.data ?? {}) };
  }
}