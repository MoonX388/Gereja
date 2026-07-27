import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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
  status!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  createdAt!: Date;

  @Column({ type: 'integer', nullable: true, name: 'userId' })
  userId!: number | null;

  @ManyToOne(() => User, (user) => user.pelayans, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User | null;
}