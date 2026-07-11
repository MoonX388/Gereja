// lib/helpers.ts
import { redirect } from 'next/navigation';

export async function fetchDataOrRedirect<T>(
  url: string,
  options?: RequestInit,
  errorCode: 404 | 403 | 500 = 404
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (res.status === 403) redirect('/status/403');
      if (res.status === 404) redirect('/status/404');
      redirect(`/status/${errorCode}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    redirect('/status/500');
  }
}