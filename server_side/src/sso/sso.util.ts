import * as crypto from 'crypto';

/** Sisi verifikasi — lihat landing-page/src/sso/sso.util.ts untuk sisi signing. Jaga tetap sinkron. */

export function buildSsoSignaturePayload(sessionId: string, authToken: string, expires: number, next: string): string {
  return `${sessionId}.${authToken}.${expires}.${next}`;
}

export function verifySsoSignature(
  sessionId: string,
  authToken: string,
  expires: number,
  next: string,
  sign: string,
  secret: string,
): boolean {
  const payload = buildSsoSignaturePayload(sessionId, authToken, expires, next);
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(sign, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
