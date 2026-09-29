import { Inventaris } from '../entity/inventaris.entity';

export interface IInventarisRepository {
  findAll(tenantId: string): Promise<Inventaris[]>;
  create(data: Partial<Inventaris>, tenantId: string): Promise<Inventaris>;
  update(id: string, data: Partial<Inventaris>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}