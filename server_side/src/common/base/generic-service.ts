import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { GenericRepository, QueryOptions, PaginationOptions, PaginatedResult } from './generic-repository';

export interface ServiceConfig {
  tableName: string;
  defaultSelect?: string;
  defaultRelations?: string[];
  /**
   * Kalau true (default), semua operasi di bawah WAJIB diberi tenantId
   * dan otomatis di-filter/di-stamp dengan tenant_id. Set false HANYA
   * untuk tabel yang memang bukan milik satu tenant tertentu (nyaris
   * tidak ada kasusnya di gpanel).
   */
  tenantScoped?: boolean;
  /** Nama kolom tenant di tabel ini. Default: 'tenant_id'. */
  tenantColumn?: string;
}

@Injectable()
export class GenericService {
  protected repository: GenericRepository;
  protected config: ServiceConfig;

  constructor(repository: GenericRepository, config: ServiceConfig) {
    this.repository = repository;
    this.config = { tenantScoped: true, tenantColumn: 'tenant_id', ...config };
  }

  /**
   * Pastikan tenantId ada sebelum operasi tenant-scoped dijalankan.
   * Ini pagar terakhir: kalau controller lupa mengirim tenantId (mis.
   * karena JWT tidak punya tenantId), request DITOLAK, bukan diam-diam
   * mengembalikan/mengubah semua baris tanpa filter.
   */
  private assertTenant(tenantId?: string): string {
    if (this.config.tenantScoped && !tenantId) {
      throw new ForbiddenException('Tenant tidak teridentifikasi untuk operasi ini.');
    }
    return tenantId as string;
  }

  private tenantFilter(tenantId?: string): Record<string, any> {
    if (!this.config.tenantScoped) return {};
    const column = this.config.tenantColumn as string;
    return { [column]: this.assertTenant(tenantId) };
  }

  /**
   * Get all records with optional filters and relations.
   * `tenantId` WAJIB diisi kalau tableScoped (default). Filter tenant_id
   * dari sini SELALU menang -- filter tenant_id yang mungkin dikirim
   * lewat query string oleh client akan ditimpa, supaya client tidak
   * bisa "melompat" ke tenant lain hanya dengan mengganti query param.
   */
  async findAll(options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
      filters: {
        ...options.filters,
        ...this.tenantFilter(tenantId),
      },
    };

    return this.repository.findAll(this.config.tableName, mergedOptions);
  }

  /**
   * Get paginated records
   */
  async findPaginated(pagination: PaginationOptions = {}, options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
      filters: {
        ...options.filters,
        ...this.tenantFilter(tenantId),
      },
    };

    return this.repository.findPaginated(this.config.tableName, pagination, mergedOptions);
  }

  /**
   * Get single record by ID (UUID).
   * Kalau record ada tapi milik tenant lain, dianggap tidak ditemukan
   * (404) -- bukan 403 -- supaya tidak bisa dipakai enumerasi ID.
   */
  async findById(id: string, options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
    };

    const tf = this.config.tenantScoped
      ? { column: this.config.tenantColumn as string, value: this.assertTenant(tenantId) }
      : undefined;

    const record = await this.repository.findById(this.config.tableName, id, mergedOptions, tf);

    if (!record) {
      throw new NotFoundException(`${this.config.tableName} with ID ${id} not found`);
    }

    return record;
  }

  /**
   * Find one record by custom filters
   */
  async findOne(filters: Record<string, any>, options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
    };

    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };

    const record = await this.repository.findOne(this.config.tableName, mergedFilters, mergedOptions);

    if (!record) {
      throw new NotFoundException(`${this.config.tableName} not found with given filters`);
    }

    return record;
  }

  /**
   * Find one or return null (doesn't throw exception)
   */
  async findOneOrNull(filters: Record<string, any>, options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
    };

    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };

    return this.repository.findOne(this.config.tableName, mergedFilters, mergedOptions);
  }

  /**
   * Find multiple records by filters
   */
  async findMany(filters: Record<string, any>, options: QueryOptions = {}, tenantId?: string) {
    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
    };

    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };

    return this.repository.findMany(this.config.tableName, mergedFilters, mergedOptions);
  }

  /**
   * Create new record. tenant_id di body (kalau ada) SELALU ditimpa
   * dengan tenant milik pemanggil -- klien tidak boleh bisa membuat
   * record atas nama tenant lain hanya dengan mengisi field tenant_id
   * di JSON body.
   */
  async create(data: any, tenantId?: string) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Data cannot be empty');
    }

    const payload = this.config.tenantScoped
      ? { ...data, [this.config.tenantColumn as string]: this.assertTenant(tenantId) }
      : data;

    return this.repository.create(this.config.tableName, payload);
  }

  /**
   * Create multiple records
   */
  async createMany(dataArray: any[], tenantId?: string) {
    if (!dataArray || dataArray.length === 0) {
      throw new BadRequestException('Data array cannot be empty');
    }

    const payload = this.config.tenantScoped
      ? dataArray.map(item => ({ ...item, [this.config.tenantColumn as string]: this.assertTenant(tenantId) }))
      : dataArray;

    return this.repository.createMany(this.config.tableName, payload);
  }

  /**
   * Update record by ID (UUID). tenant_id di body diabaikan/dihapus
   * supaya tidak bisa dipakai memindahkan record ke tenant lain.
   */
  async update(id: string, data: any, tenantId?: string) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }

    // Pastikan record ada DAN milik tenant ini sebelum update (404 kalau tidak).
    await this.findById(id, {}, tenantId);

    const safeData = { ...data };
    if (this.config.tenantScoped) {
      delete safeData[this.config.tenantColumn as string];
      delete safeData.tenantId;
    }

    const tf = this.config.tenantScoped
      ? { column: this.config.tenantColumn as string, value: this.assertTenant(tenantId) }
      : undefined;

    return this.repository.update(this.config.tableName, id, safeData, tf);
  }

  /**
   * Update multiple records by filters
   */
  async updateMany(filters: Record<string, any>, data: any, tenantId?: string) {
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }

    const safeData = { ...data };
    if (this.config.tenantScoped) {
      delete safeData[this.config.tenantColumn as string];
      delete safeData.tenantId;
    }

    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };

    return this.repository.updateMany(this.config.tableName, mergedFilters, safeData);
  }

  /**
   * Delete record by ID (UUID)
   */
  async delete(id: string, tenantId?: string) {
    await this.findById(id, {}, tenantId);

    const tf = this.config.tenantScoped
      ? { column: this.config.tenantColumn as string, value: this.assertTenant(tenantId) }
      : undefined;

    return this.repository.delete(this.config.tableName, id, tf);
  }

  /**
   * Delete multiple records by filters
   */
  async deleteMany(filters: Record<string, any>, tenantId?: string) {
    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };
    return this.repository.deleteMany(this.config.tableName, mergedFilters);
  }

  /**
   * Count records by filters
   */
  async count(filters: Record<string, any> = {}, tenantId?: string) {
    const mergedFilters = { ...filters, ...this.tenantFilter(tenantId) };
    return this.repository.count(this.config.tableName, mergedFilters);
  }

  /**
   * Get records with relation
   */
  async withRelation<T, R>(
    relationTable: string,
    foreignKey: string,
    options: QueryOptions = {},
    tenantId?: string
  ) {
    const mergedOptions: QueryOptions = {
      ...options,
      filters: {
        ...options.filters,
        ...this.tenantFilter(tenantId),
      },
    };

    return this.repository.withRelation<T, R>(
      this.config.tableName,
      relationTable,
      foreignKey,
      mergedOptions
    );
  }

  /**
   * Upsert (create or update) record (UUID support)
   */
  async upsert(filters: Record<string, any>, data: any, tenantId?: string) {
    const existing = await this.findOneOrNull(filters, {}, tenantId);

    if (existing) {
      const id = (existing as any).id as string;
      return this.update(id, data, tenantId);
    } else {
      return this.create({ ...filters, ...data }, tenantId);
    }
  }

  /**
   * Bulk operation helper (UUID support)
   */
  async bulkOperation(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      data?: any;
      id?: string;
      filters?: Record<string, any>;
    }>,
    tenantId?: string
  ) {
    const results: any[] = [];

    for (const op of operations) {
      try {
        switch (op.type) {
          case 'create':
            results.push(await this.create(op.data!, tenantId));
            break;
          case 'update':
            results.push(await this.update(op.id!, op.data!, tenantId));
            break;
          case 'delete':
            await this.delete(op.id!, tenantId);
            results.push({ deleted: op.id });
            break;
        }
      } catch (error) {
        results.push({ error: (error as Error).message, operation: op.type });
      }
    }

    return results;
  }

  /**
   * Search records with LIKE/ILIKE
   */
  async search(searchTerm: string, searchFields: string[], options: QueryOptions = {}, tenantId?: string) {
    const orConditions = searchFields.map(field =>
      `${field}.ilike.%${searchTerm}%`
    ).join(',');

    const mergedOptions: QueryOptions = {
      select: this.config.defaultSelect,
      relations: this.config.defaultRelations,
      ...options,
    };

    return this.repository.findAll(this.config.tableName, {
      ...mergedOptions,
      filters: { or: orConditions, ...this.tenantFilter(tenantId) },
    });
  }

  /**
   * Get related records by foreign key (UUID support)
   */
  async getRelatedByForeignKey(
    foreignKey: string,
    foreignKeyValue: string,
    options: QueryOptions = {},
    tenantId?: string
  ) {
    return this.findMany({ [foreignKey]: foreignKeyValue }, options, tenantId);
  }

  /**
   * Transaction-like operation (atomic operations)
   */
  async transaction(operations: (() => Promise<any>)[]) {
    const results: any[] = [];
    const errors: string[] = [];

    for (const operation of operations) {
      try {
        const result = await operation();
        results.push(result);
      } catch (error) {
        errors.push((error as Error).message);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Transaction failed: ${errors.join(', ')}`);
    }

    return results;
  }
}
