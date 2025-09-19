import dayjs from "dayjs";
import 'dayjs/locale/id';

/**
 * Interfaces
 */
export type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (...a: Parameters<T>) => TNewReturn;



/**
 * String
 */
export const truncate = (text: string, limit = 10) => (text ?? '').length > limit ? text.slice(0, limit) + '...' : (text ?? '');

export const ucFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);



/**
 * Number
 */
export const setDigit = (n: number | string, len: number) => Number(n).toLocaleString('en-US', { minimumIntegerDigits: len });

export const toRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);

export const toRoman = (n: number) => {
  if (!n || isNaN(n)) return '';
  const roman: Record<string, number> = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  return Object.entries(roman).reduce((r, [k, v]) => {
    const q = Math.floor(n / v);
    n -= q * v;
    return r + k.repeat(q);
  }, '');
};

export const formatFileSize = (size: number, decimals: number = 2) => {
  if (size === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  const formatted = parseFloat((size / Math.pow(k, i)).toFixed(dm));
  return units[i] ? `${formatted} ${units[i]}` : '-';
}


/**
 * Date
 */
export const toMiliSecond = (d: any) => {
  if (isNaN(Number(d))) {
    d = new Date(d).getTime();
  } else {
    d = Number(d);
    if (String(d).length === 10) d *= 1000;
  }
  return isNaN(d) ? 0 : d;
};

export const toUnixTime = (d: any) => Math.floor(toMiliSecond(d) / 1000);

export function formatInputDate(date: any) {
  const epoch = toMiliSecond(date);
  if (!Number.isInteger(epoch)) return epoch;
  const dateObj = new Date(epoch);
  let result = String(dateObj.getFullYear());
  result += '-' + String(dateObj.getMonth() + 1).padStart(2, '0');
  result += '-' + String(dateObj.getDate()).padStart(2, '0');
  return result;
}

export function formatInputDateTime(date: any) {
  const epoch = toMiliSecond(date);
  if (!Number.isInteger(epoch)) return epoch;
  const dateObj = new Date(epoch);
  let result = String(dateObj.getFullYear());
  result += '-' + String(dateObj.getMonth() + 1).padStart(2, '0');
  result += '-' + String(dateObj.getDate()).padStart(2, '0');
  result += 'T' + String(dateObj.getHours()).padStart(2, '0');
  result += ':' + String(dateObj.getMinutes()).padStart(2, '0');
  return result;
}

export function formatIndoDate(date: any, format?: string) {
  const milisecond = toMiliSecond(date);
  return milisecond ? dayjs(milisecond).locale('id').format(format || 'dddd, D MMMM YYYY') : '';
}



/**
 * URL
 */
export const objectToQueryUrl = (obj: Record<string, any>) =>
  Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

export const queryUrlToObject = (query: string) => (Object.fromEntries(new URLSearchParams(query)));



/**
 * File
 */
export const blobToFile = (b64: string, name: string) => {
  const bin = atob(b64.split(',')[1]);
  const arr = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new File([arr], name, { type: 'image/png' });
};



/**
 * FormData
 */
export const formDataToObject = (formData: FormData) => {
  const result: Record<string, any> = {};
  formData.forEach((v, k) => result[k] = v);
  return result;
};



/**
 * Object
 */
export const objectFlatToNested = (data: Record<string, any>) => {
  const result: Record<string, any> = {};
  for (const key in data) {
    key.split('.').reduce((acc, part, i, arr) =>
      acc[part] = i === arr.length - 1 ? data[key] : acc[part] || {}, result);
  }
  return result;
};

export const objectExtender = (object?: Record<string, any>) => {
  return new Proxy(object || {}, {
    get: (obj: Record<string, any>, prop: string) => (obj[prop] ?? objectExtender()),
    set: (obj: Record<string, any>, prop: string, value) => (obj[prop] = value, true)
  })
};

export const ox = (hook: (prevState: Record<string, any>) => any) => {
  return (realPrevState: Record<string, any>) => {
    return unProxy(hook(objectExtender(realPrevState)))
  }
};

export const unProxy = (proxyObj: any): any => {
  if (!proxyObj || typeof proxyObj != 'object') return proxyObj;
  const newPlainObject: any = Array.isArray(proxyObj) ? [] : {};
  for (const [key, value] of Object.entries(proxyObj)) {
    newPlainObject[key] = unProxy(value);
  }
  return newPlainObject;
};


/**
 * Array
 */
export const getRandomItem = (array: Array<any>) => (array[Math.floor(Math.random() * array.length)]);

export const stringToArray = (text: string, convertItem?: (item: any) => any, allowDuplicate?: boolean) => {
  let array = text.split(',');
  if (convertItem) array = array.map(convertItem);
  return (allowDuplicate ? array : [...new Set<any>(array)]).filter(Boolean);
}