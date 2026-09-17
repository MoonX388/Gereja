import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', name: 'namaGereja' })
  namaGereja!: string;

  @Column({ type: 'boolean', nullable: true })
  notif!: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  tampilan!: boolean | null;

  @Column({ type: 'varchar', nullable: true })
  wa!: string | null;
}