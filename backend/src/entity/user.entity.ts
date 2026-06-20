import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true }) // buat nullable dulu jika sudah ada data lama
  username?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
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
  tanggalLahir?: string;

  @Column({ nullable: true })
  tempatLahir?: string;

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