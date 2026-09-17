import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('data')
export class data {
  @PrimaryGeneratedColumn()
  id!: number;

  // 🚀 CUKUP SEPERTI INI: Kolom biasa untuk menampung ID Subowner dari tabel sebelah
  @Column({ nullable: true })
  userId!: number;

  @Column({ nullable: true })
  namaGereja?: string;

  @Column({ unique: true, nullable: true }) 
  username?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  nama!: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  baptis?: string;

  @Column({ nullable: true })
  alamat?: string;

  @Column({ nullable: true })
  telepon?: string;

  @Column({ nullable: true })
  jenisKelamin?: string;

  @Column({ nullable: true })
  tglLahir?: string;

  @Column({ nullable: true })
  tempatLahir?: string;

  @Column({ nullable: true })
  tempatBaptis?: string;

  @Column({ nullable: true })
  tglBaptis?: string;

  @Column({ nullable: true })
  tempatSidi?: string;

  @Column({ nullable: true })
  tglSidi?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  nikah?: string;

  @Column({ nullable: true })
  pekerjaan?: string;

  @Column({ default: 'Aktif' })
  status!: string;

  @Column({ default: 'jemaat' })
  role!: string;
}