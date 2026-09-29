import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * FIXED: `id` was `bigint` — live column is `uuid`. Also added `tenantId`,
 * mapping to `tenant_id` which already has a proper FK to `tenants(id)`.
 * The Supabase-path `settings.service.ts` already relates correctly via
 * `tenant_id` (and treats `tenants.namaGereja` as the source of truth,
 * with this table's `namaGereja` as a denormalized cache) — this entity
 * just needed to catch up for the `FITUR_DB=true` TypeORM path.
 */
@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', name: 'namaGereja' })
  namaGereja!: string;

  @Column({ type: 'uuid', name: 'tenant_id', nullable: true })
  tenantId!: string | null;

  @Column({ type: 'boolean', nullable: true })
  notif!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  tampilan!: boolean | null;

  @Column({ type: 'varchar', nullable: true })
  wa!: string | null;
}
