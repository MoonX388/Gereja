import { Notifikasi } from '../entity/notifikasi.entity';

export interface INotifikasiRepository {
  findAll(tenantId: string): Promise<Notifikasi[]>;
  create(data: Partial<Notifikasi>, tenantId: string): Promise<Notifikasi>;
  update(id: string, data: Partial<Notifikasi>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}