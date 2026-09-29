import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { User } from '../entity/user.entity';
import type { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UsersService {
  constructor(@Inject('IUserRepository') private userRepo: IUserRepository) {}

  async findAll(tenantId: string): Promise<User[]> {
    if (!tenantId) throw new UnauthorizedException('Tenant tidak valid');
    return this.userRepo.findAll(tenantId);
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepo.create(userData);
  }

  async update(id: string, userData: Partial<User>, tenantId?: string): Promise<void> {
    return this.userRepo.update(id, userData, tenantId);
  }

  async remove(id: string, tenantId?: string): Promise<void> {
    return this.userRepo.remove(id, tenantId);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findByUsername(username);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async findMasterUserByEmailOrUsername(identifier: string): Promise<any | null> {
    return this.userRepo.findMasterUserByEmailOrUsername(identifier);
  }

  async findChurchBySubdomain(subdomain: string): Promise<any | null> {
    return this.userRepo.findChurchBySubdomain(subdomain);
  }

  async findChurchById(id: string): Promise<any | null> {
    return this.userRepo.findChurchById(id);
  }
}