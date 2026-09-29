import { Jemaat } from '../entity/jemaat.entity';

export interface IJemaatRepository {
  getDashboardData(tenantId: string): Promise<{ tenant: any; jemaat: Jemaat[] }>;
  findAll(tenantId: string): Promise<Jemaat[]>;
  findByPhone(nomorHP: string): Promise<Jemaat | null>;
  create(dto: any, tenantId: string): Promise<Jemaat>;
  update(id: string, dto: any, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}