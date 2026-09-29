/**
 * UUID Validator Utility
 * Memvalidasi format UUID string
 */

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function assertUUID(uuid: string, paramName: string = 'id'): void {
  if (!validateUUID(uuid)) {
    throw new Error(`Invalid UUID format for parameter '${paramName}': ${uuid}`);
  }
}
