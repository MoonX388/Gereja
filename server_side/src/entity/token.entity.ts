import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id!: number; // ⬅️ tambahkan !

  @Column({nullable: true})
  userId!: number;

  @Column({ type: 'text' })
  token!: string; // ⬅️ tambahkan !

  @Column({ type: 'boolean', default: true })
  isActive!: boolean; // ⬅️ tambahkan !

  @CreateDateColumn()
  createdAt!: Date; // ⬅️ tambahkan !

  @UpdateDateColumn()
  updatedAt!: Date; // ⬅️ tambahkan !
}
