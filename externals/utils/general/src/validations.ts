


export const customErrorMessages: Record<string, (schema: any) => string> = {
  required: () => 'Field ini wajib diisi!',
  type: () => 'Field ini wajib diisi!',
  minLength: (schema: any) => `Minimal berisi ${schema.minLength} karakter!`,
  maxLength: (schema: any) => `Maksimal berisi ${schema.minLength} karakter!`,
  format: (schema: any) => `Harus sesuai dengan format ${schema.format}!`,
  pattern: () => 'Format tidak sesuai!',
  minimum: (schema: any) => `Minimal bernilai ${schema.minimum}`,
  maximum: (schema: any) => `Maksimal bernilai ${schema.maximum}`,
}



export function customMessage<T>(schema: T): T {
  const errorMessage: Record<string, string> = {};

  for (const [keySchema, loadMessage] of Object.entries(customErrorMessages)) {
    if ((schema as any)[keySchema]) {
      errorMessage[keySchema] = loadMessage(schema);
    }
  }

  return {
    ...schema,
    errorMessage: {
      ...(schema as any).errorMessage || {},
      ...errorMessage
    }
  } as T
}