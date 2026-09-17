// app/loading.tsx
import Loading from './components/loading';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <Loading />
    </div>
  );
}