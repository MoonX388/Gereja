// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) router.push('/error/403');
          else if (res.status === 404) router.push('/error/404');
          else router.push('/error/500');
          return null;
        }
        return res.json();
      })
      .then(json => setData(json))
      .catch(() => router.push('/error/500'))
      .finally(() => setLoading(false));
  }, [url, router]);

  return { data, loading };
}