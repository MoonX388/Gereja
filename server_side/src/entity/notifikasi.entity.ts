import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifikasi')
export class Notifikasi {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({nullable: true})
  userId!: number;

  @Column({ type: 'varchar' })
  judul!: string;

  @Column({ type: 'text' })
  pesan!: string;

  @Column({ type: 'varchar' })
  target!: string; // Semua Jemaat, Pelayan, dll

  @Column({ type: 'varchar' })
  via!: string; // WhatsApp, SMS, Email

  @Column({ type: 'timestamp' })
  tanggal!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
