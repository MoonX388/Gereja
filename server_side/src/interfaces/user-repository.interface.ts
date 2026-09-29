import { User } from '../entity/user.entity';

export interface IUserRepository {
  findAll(tenantId: string): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(id: string, data: Partial<User>, tenantId?: string): Promise<void>;
  remove(id: string, tenantId?: string): Promise<void>;
  findMasterUserByEmailOrUsername(identifier: string): Promise<any | null>;
  findChurchBySubdomain(subdomain: string): Promise<any | null>;
  findChurchById(id: string): Promise<any | null>;
}