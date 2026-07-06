import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ auth: { getSession: jest.fn() } })),
}));

describe('SupabaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('membuat client dari variabel environment', () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'SUPABASE_URL') return 'https://example.supabase.co';
        if (key === 'SUPABASE_SECRET_KEY') return 'secret-key';
        return undefined;
      }),
    } as unknown as ConfigService;

    const service = new SupabaseService(configService);

    expect(createClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'secret-key',
      expect.objectContaining({ auth: expect.any(Object) }),
    );
    expect(service.getClient()).toBeDefined();
  });

  it('melempar error jika env tidak lengkap', () => {
    const configService = {
      get: jest.fn(() => undefined),
    } as unknown as ConfigService;

    expect(() => new SupabaseService(configService)).toThrow('SUPABASE_URL');
  });
});
