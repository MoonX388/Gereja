import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('keuangan')
export class Keuangan {
  @PrimaryGeneratedColumn()
  id!: number;                         // ✅ tambahkan !

  @Column({ type: 'varchar' })
  jenis!: 'masuk' | 'keluar';          // ✅ tambahkan !

  @Column({ type: 'varchar' })
  kategori!: string;                   // ✅ tambahkan !

  @Column({ type: 'int' })
  jumlah!: number;                     // ✅ tambahkan !

  @Column({ type: 'text', nullable: true })
  deskripsi?: string;                  // optional, bisa pakai ? atau ! + nullable

  @Column({ type: 'date' })
  tanggal!: string;                    // ✅ tambahkan !

  @CreateDateColumn()
  createdAt!: Date;                    // ✅ tambahkan !
}