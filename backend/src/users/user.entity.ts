import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  nama!: string;

  @Column({ nullable: true })
  alamat?: string;

  @Column({ nullable: true })
  telepon?: string;

  @Column({ nullable: true })
  jenisKelamin?: string;

  @Column({ nullable: true })
  tanggalLahir?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: 'jemaat' })
  role!: string;
}