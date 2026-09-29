import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('keluarga')
export class Keluarga {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  noKK!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId!: string | null;

  @Column({ type: 'varchar' })
  kepala!: string;

  @Column({ type: 'varchar' })
  namaaggota!: string;
  
  @Column({ type: 'text', nullable: true })
  alamat?: string;

  @Column({ type: 'int', default: 1 })
  jumlah!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
