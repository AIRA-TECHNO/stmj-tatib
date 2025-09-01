export class HTTPException extends Error {
  status: number;
  data?: Record<string, any>;

  constructor(status?: number, message?: string, data?: Record<string, any>) {
    super(message ?? "Internal Server Error!");
    this.status = status ?? 500;
    this.data = data;
  }
}

export function abort(status?: number, message?: string, data?: Record<string, any>) {
  throw new HTTPException(status, message, data);
}