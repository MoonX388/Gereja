import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifikasi')
export class Notifikasi {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  judul!: string;

  @Column({ type: 'text' })
  pesan!: string;

  @Column({ type: 'varchar' })
  target!: string; // Semua Jemaat, Pelayan, dll

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId!: string | null;

  @Column({ type: 'varchar' })
  via!: string; // WhatsApp, SMS, Email

  @Column({ type: 'timestamp' })
  tanggal!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
