import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class SchemaBootstrapService implements OnModuleInit {
  private readonly logger = new Logger(SchemaBootstrapService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const connectionString =
      this.configService.get<string>('DB_URL') ||
      this.configService.get<string>('DATABASE_URL');
    const dbType = this.configService.get<string>('DB_TYPE') || 'postgres';

    if (!connectionString || !['postgres', 'postgresql'].includes(dbType)) {
      this.logger.warn(
        'Skipping automatic Supabase schema bootstrap because DB_URL is not configured for PostgreSQL.',
      );
      return;
    }

    const dataSource = new DataSource({
      type: 'postgres',
      url: connectionString,
      ssl:
        this.configService.get<string>('DB_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,
      logging: this.configService.get<string>('DB_LOGGING') === 'true',
    });

    try {
      await dataSource.initialize();

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          username TEXT UNIQUE,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nama TEXT NOT NULL,
          gender TEXT,
          baptis TEXT,
          alamat TEXT,
          telepon TEXT,
          jenisKelamin TEXT,
          tglLahir TEXT,
          tempatLahir TEXT,
          tempatBaptis TEXT,
          tglBaptis TEXT,
          tempatSidi TEXT,
          tglSidi TEXT,
          nikah TEXT,
          pekerjaan TEXT,
          status TEXT DEFAULT 'Aktif',
          role TEXT DEFAULT 'jemaat',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS jemaat (
          id BIGSERIAL PRIMARY KEY,
          username TEXT UNIQUE,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nama TEXT NOT NULL,
          gender TEXT,
          baptis TEXT,
          alamat TEXT,
          telepon TEXT,
          jenisKelamin TEXT,
          tglLahir TEXT,
          tempatLahir TEXT,
          tempatBaptis TEXT,
          tglBaptis TEXT,
          tempatSidi TEXT,
          tglSidi TEXT,
          nikah TEXT,
          pekerjaan TEXT,
          status TEXT DEFAULT 'Aktif',
          role TEXT DEFAULT 'jemaat',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS keuangan (
          id BIGSERIAL PRIMARY KEY,
          jenis TEXT NOT NULL,
          kategori TEXT NOT NULL,
          jumlah INTEGER NOT NULL,
          deskripsi TEXT,
          tanggal DATE NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS keluarga (
          id BIGSERIAL PRIMARY KEY,
          no_kk TEXT UNIQUE NOT NULL,
          kepala TEXT NOT NULL,
          alamat TEXT,
          jumlah INTEGER DEFAULT 1,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS inventaris (
          id BIGSERIAL PRIMARY KEY,
          nama TEXT NOT NULL,
          kategori TEXT NOT NULL,
          jumlah INTEGER NOT NULL,
          harga INTEGER NOT NULL,
          tahun INTEGER NOT NULL,
          kondisi TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS pelayan (
          id BIGSERIAL PRIMARY KEY,
          nama TEXT NOT NULL,
          jabatan TEXT NOT NULL,
          departemen TEXT NOT NULL,
          status TEXT DEFAULT 'Aktif',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS jadwal (
          id BIGSERIAL PRIMARY KEY,
          nama TEXT NOT NULL,
          tanggal DATE NOT NULL,
          waktu TIME,
          lokasi TEXT,
          pj TEXT,
          status TEXT DEFAULT 'Terjadwal',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      await dataSource.query(`
        CREATE TABLE IF NOT EXISTS notifikasi (
          id BIGSERIAL PRIMARY KEY,
          judul TEXT NOT NULL,
          pesan TEXT NOT NULL,
          target TEXT NOT NULL,
          via TEXT NOT NULL,
          tanggal TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      this.logger.log('Supabase/Postgres schema initialized successfully.');
    } catch (error) {
      this.logger.error(
        `Failed to initialize Supabase/Postgres schema: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }
    }
  }
}
