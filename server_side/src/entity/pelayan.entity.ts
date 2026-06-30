import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('pelayan')
export class Pelayan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  nama!: string;

  @Column({ type: 'varchar' })
  jabatan!: string;

  @Column({ type: 'varchar' })
  departemen!: string;

  @Column({ type: 'varchar', default: 'Aktif' })
  status!: string; // Aktif / Tidak Aktif

  @CreateDateColumn()
  createdAt!: Date;
}