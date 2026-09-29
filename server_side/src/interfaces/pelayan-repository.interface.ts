import { Pelayan } from '../entity/pelayan.entity';

export interface IPelayanRepository {
  findAll(tenantId: string): Promise<Pelayan[]>;
  create(data: Partial<Pelayan>, tenantId: string): Promise<Pelayan>;
  update(id: string, data: Partial<Pelayan>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}