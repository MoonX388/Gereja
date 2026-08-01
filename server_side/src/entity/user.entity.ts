import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Jemaat } from './jemaat.entity';
import { Pelayan } from './pelayan.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', nullable: true, name: 'jemaat_id', unique: true })
  jemaatId!: number | null;

  @Column({ type: 'int', nullable: true, name: 'tenant_id' })
  tenantId!: number | null;

  @OneToOne(() => Jemaat, (jemaat) => jemaat.user, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'jemaat_id' }) 
  jemaat!: Jemaat | null;

  @OneToMany(() => Pelayan, (pelayan) => pelayan.user)
  pelayans!: Pelayan[];

  @Column({ type: 'varchar', unique: true, nullable: true })
  username!: string | null;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  // 🚀 PERBAIKAN: Tambahkan default value agar sinkronisasi PostgreSQL sukses!
  @Column({ type: 'varchar', default: 'jemaat' })
  role!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;
}