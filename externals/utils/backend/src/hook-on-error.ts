import { ErrorHandler } from "elysia";
import { HTTPException } from "./http-exception";

export const HookOnError: ErrorHandler = ({ error, code, set }) => {
  if (code == "VALIDATION") {
    return {
      message: "Invalid request!",
      invalids: error.all.map((err: any) => ({
        schema: err.schema,
        path: err.path,
        message: err.message
      }))
    }
  } else if (error instanceof HTTPException) {
    set.status = error.status;
    return { error: error.message, ...(error.data ?? {}) };
  }
}