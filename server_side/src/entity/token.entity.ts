import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true, name: 'tenant_id' })
  tenantId!: string | null; // ⬅️ tambahkan !

  @Column({ type: 'text' })
  token!: string; // ⬅️ tambahkan !

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // ⬅️ tambahkan !

  @CreateDateColumn()
  createdAt!: Date; // ⬅️ tambahkan !

  @UpdateDateColumn()
  updatedAt!: Date; // ⬅️ tambahkan !
}
