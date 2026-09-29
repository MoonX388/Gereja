import { Keuangan } from '../entity/keuangan.entity';

export interface IKeuanganRepository {
  findAll(tenantId: string): Promise<Keuangan[]>;
  create(data: Partial<Keuangan>, tenantId: string): Promise<Keuangan>;
  update(id: string, data: Partial<Keuangan>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}