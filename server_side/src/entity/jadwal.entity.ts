import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('jadwal')
export class Jadwal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId!: string | null;

  @Column({ type: 'varchar' })
  nama!: string;

  @Column({ type: 'date' })
  tanggal!: string;

  @Column({ type: 'time', nullable: true })
  waktu?: string;

  @Column({ type: 'varchar', nullable: true })
  lokasi?: string;

  @Column({ type: 'varchar', nullable: true })
  pj?: string; // Penanggung Jawab

  @Column({ type: 'varchar', default: 'Terjadwal' })
  status!: string; // Terjadwal, Berlangsung, Selesai, Dibatalkan

  @CreateDateColumn()
  createdAt!: Date;
}
