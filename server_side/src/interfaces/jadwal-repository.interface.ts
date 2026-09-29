import { Jadwal } from '../entity/jadwal.entity';

export interface IJadwalRepository {
  findAll(tenantId: string): Promise<Jadwal[]>;
  create(data: Partial<Jadwal>, tenantId: string): Promise<Jadwal>;
  update(id: string, data: Partial<Jadwal>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}