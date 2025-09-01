import { appConfig } from '@/externals/configs/app';
import { objectToQueryUrl } from '../../general';
import Cookies from 'js-cookie'
import { apiClearCache, apiGetCache, apiSetCache } from './apiCacheIndexDB';


/**
 * Handle logout
 */
export function onLogout({ redirectTo } = { redirectTo: '/auth/login' }) {
  const cookieConfigs: any = {}
  const domain = process?.env?.NEXT_PUBLIC_PARENT_DOMAIN
  if (domain) cookieConfigs.domain = domain;
  Cookies.remove(appConfig.COOKIE_AUTH_TOKEN ?? "userToken", cookieConfigs);
  Cookies.remove(appConfig.COOKIE_USER_PROFILE ?? "userAuthed");
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 300);
};



/**
 * Reload data profile user
 */
export function onRelogin({ redirectTo } = { redirectTo: '/tatib/panel' }) {
  Cookies.remove(appConfig.COOKIE_USER_PROFILE ?? "userAuthed");
  setTimeout(() => {
    window.location.href = redirectTo;
  }, 300);
}



/**
 * Base function for fetching api
 */
export type typeApiProps = {
  path: string;
  objParams?: Record<string, any>;
  body?: FormData | Record<string, any> | string;
  method?: string;
  headers?: Record<string, string>;
  host?: string;
  staleTime?: number;
}

export async function api({
  path,
  objParams,
  body,
  method,
  headers = {},
  host = (process.env.BFF_HOST ?? ''),
  staleTime = 0
}: typeApiProps) {
  // Setup var
  path = path + (path.includes('?') ? '&' : '?') + (objParams ? objectToQueryUrl(objParams) : '');

  // Check cache
  if (staleTime > 0) {
    const cacheResponse = await apiGetCache(path);
    if (cacheResponse) return cacheResponse;
  }

  // Get user token
  try {
    const userToken = Cookies.get(appConfig.COOKIE_AUTH_TOKEN ?? "userToken")
    headers['Authorization'] = `Bearer ${userToken}`
  } catch (error) { }

  // Set content type
  if (body && !(body instanceof FormData)) {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
    if (typeof (body) == "object") body = JSON.stringify(body);
  }

  // Fething server
  const response = fetch((host + path), {
    method: (method ?? 'get'), body, headers
  });

  // Pre return
  response.then(async (res) => {
    if (res.status == 401) {
      onLogout();
    } else if (res.status == 403) {
      onRelogin();
    } else if (res.status == 200) {
      if (staleTime > 0) {
        await apiSetCache(path, res.clone(), staleTime);
      } else {
        await apiClearCache(path);
      }
    }
  });

  // Return data
  return response;
}