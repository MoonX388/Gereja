import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inventaris')
export class Inventaris {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  nama!: string;

  @Column({ type: 'varchar' })
  kategori!: string;

  @Column({ type: 'int' })
  jumlah!: number;

  @Column({ type: 'int' })
  harga!: number;

  @Column({ type: 'int' })
  tahun!: number;

  @Column({ type: 'varchar' })
  kondisi!: string; // Baik, Rusak Ringan, Rusak Berat

  @CreateDateColumn()
  createdAt!: Date;
}