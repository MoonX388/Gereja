import ErrorDisplay from '../../components/ErrorDisplay';

interface Props {
  params: Promise<{ code: string }>;  // ← params sekarang Promise
}

export default async function ErrorCodePage({ params }: Props) {
  const { code } = await params;       // ← await dulu
  const statusCode = parseInt(code) || 404;
  return <ErrorDisplay statusCode={statusCode} />;
}