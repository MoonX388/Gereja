import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('jemaat')
export class Jemaat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  nama!: string;

  @Column({ type: 'varchar', name: 'jenis_kelamin' })
  jenisKelamin!: string;

  @Column({ type: 'varchar', nullable: true })
  alamat!: string | null;

  @Column({ type: 'varchar', nullable: true })
  telepon!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tempat_lahir' })
  tempatLahir!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tgl_lahir' })
  tglLahir!: string | null;

  @Column({ type: 'varchar', nullable: true })
  baptis!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tempat_baptis' })
  tempatBaptis!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tgl_baptis' })
  tglBaptis!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tempat_sidi' })
  tempatSidi!: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'tgl_sidi' })
  tglSidi!: string | null;

  @Column({ type: 'varchar', nullable: true })
  nikah!: string | null;

  @Column({ type: 'varchar', nullable: true })
  pekerjaan!: string | null;

  @Column({ type: 'varchar' })
  status!: string; 

  @Column({ type: 'int', nullable: true, name: 'tenant_id' })
  tenantId!: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @OneToOne(() => User, (user) => user.jemaat)
  user!: User;
}