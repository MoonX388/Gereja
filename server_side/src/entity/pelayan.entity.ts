import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('pelayan')
export class Pelayan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId!: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'userId' })
  userId!: string | null;

  @ManyToOne(() => User, (user) => user.pelayans, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User | null;
}