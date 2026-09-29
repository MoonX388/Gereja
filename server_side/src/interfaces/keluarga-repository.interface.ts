import { Keluarga } from '../entity/keluarga.entity';

export interface IKeluargaRepository {
  findAll(tenantId: string): Promise<Keluarga[]>;
  create(data: Partial<Keluarga>, tenantId: string): Promise<Keluarga>;
  update(id: string, data: Partial<Keluarga>, tenantId: string): Promise<void>;
  remove(id: string, tenantId: string): Promise<void>;
}