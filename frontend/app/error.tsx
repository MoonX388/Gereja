// app/error.tsx
'use client';

import { useEffect } from 'react';
import ErrorDisplay from './components/ErrorDisplay';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error captured:', error);
  }, [error]);

  return (
    <ErrorDisplay
      statusCode={500}
      showReset
      onReset={reset}
    />
  );
}