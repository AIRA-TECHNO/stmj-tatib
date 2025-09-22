


export const masterInvalidMessages: Array<{ handler: (schema: any) => string; keySchema: string; typeCode: number }> = [
  { keySchema: "required", typeCode: 45, handler: () => 'Field ini wajib diisi!' },
  { keySchema: "type", typeCode: 0, handler: (schema: any) => `Wajib bertipe ${schema.type}!` },
  { keySchema: "-", typeCode: 54, handler: () => 'Wajib bertipe string!' },
  { keySchema: "-", typeCode: 46, handler: () => 'Wajib bertipe object!' },
  { keySchema: "minLength", typeCode: 52, handler: (schema: any) => `Minimal berisi ${schema.minLength} karakter!` },
  { keySchema: "maxLength", typeCode: 0, handler: (schema: any) => `Maksimal berisi ${schema.minLength} karakter!` },
  { keySchema: "format", typeCode: 0, handler: (schema: any) => `Harus sesuai dengan format ${schema.format}!` },
  { keySchema: "pattern", typeCode: 0, handler: () => 'Format tidak sesuai!' },
  { keySchema: "minimum", typeCode: 0, handler: (schema: any) => `Minimal bernilai ${schema.minimum}` },
  { keySchema: "maximum", typeCode: 0, handler: (schema: any) => `Maksimal bernilai ${schema.maximum}` },
];