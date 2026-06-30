import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('keluarga')
export class Keluarga {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  noKK!: string;

  @Column({ type: 'varchar' })
  kepala!: string;

  @Column({ type: 'text', nullable: true })
  alamat?: string;

  @Column({ type: 'int', default: 1 })
  jumlah!: number;

  @CreateDateColumn()
  createdAt!: Date;
}