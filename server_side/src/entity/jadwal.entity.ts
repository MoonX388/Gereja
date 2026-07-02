import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('jadwal')
export class Jadwal {
  @PrimaryGeneratedColumn()
  id!: number;

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
