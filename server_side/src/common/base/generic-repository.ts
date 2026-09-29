import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/supabase-js';

export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  relations?: string[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class GenericRepository {
  constructor(private supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  /**
   * Generic find all with optional filters, relations, and pagination.
   * NB: tenant scoping untuk findAll dilakukan oleh GenericService lewat
   * `options.filters.tenant_id` -- bukan di sini -- karena findAll murni
   * meneruskan apapun yang ada di `filters`.
   */
  async findAll<T>(
    tableName: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const { select = '*', filters = {}, orderBy, limit, offset, relations } = options;

    let query = this.client.from(tableName).select(this.buildSelectString(select, relations));

    query = this.applyFilters(query, filters);

    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
    }

    if (limit) query = query.limit(limit);
    if (offset) query = query.range(offset, offset + (limit || 10) - 1);

    const { data, error } = await query;

    if (error) {
      console.error(`❌ [GenericRepository findAll ${tableName}] Error:`, error.message);
      throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
    }

    return this.camelCaseKeys(data) as T[];
  }

  /**
   * Find with pagination
   */
  async findPaginated<T>(
    tableName: string,
    pagination: PaginationOptions = {},
    options: QueryOptions = {}
  ): Promise<PaginatedResult<T>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const offset = (page - 1) * limit;

    // Total count HARUS ikut filter yang sama (termasuk tenant_id),
    // kalau tidak, angka totalnya bocor menghitung tenant lain juga.
    let countQuery = this.client
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    countQuery = this.applyFilters(countQuery, options.filters ?? {});
    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error(`❌ [GenericRepository count ${tableName}] Error:`, countError.message);
      throw new Error(`Failed to count ${tableName}: ${countError.message}`);
    }

    const data = await this.findAll<T>(tableName, {
      ...options,
      limit,
      offset,
    });

    return {
      data,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  /**
   * Find by ID with optional relations (UUID support).
   * `tenantFilter` opsional: kalau diisi, baris yang tenant_id-nya tidak
   * cocok dianggap TIDAK DITEMUKAN (bukan error 403) -- supaya keberadaan
   * record milik tenant lain tidak bisa dipakai untuk enumerasi ID.
   */
  async findById<T>(
    tableName: string,
    id: string,
    options: QueryOptions = {},
    tenantFilter?: { column: string; value: string }
  ): Promise<T | null> {
    const { select = '*', relations } = options;

    let query = this.client
      .from(tableName)
      .select(this.buildSelectString(select, relations))
      .eq('id', id);

    if (tenantFilter) {
      query = query.eq(tenantFilter.column, tenantFilter.value);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error(`❌ [GenericRepository findById ${tableName}] Error:`, error.message);
      return null;
    }

    return this.camelCaseKeys(data) as T | null;
  }

  /**
   * Find one by custom filters
   */
  async findOne<T>(
    tableName: string,
    filters: Record<string, any>,
    options: QueryOptions = {}
  ): Promise<T | null> {
    const { select = '*', relations } = options;

    let query = this.client
      .from(tableName)
      .select(this.buildSelectString(select, relations));

    query = this.applyFilters(query, filters);

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error(`❌ [GenericRepository findOne ${tableName}] Error:`, error.message);
      return null;
    }

    return this.camelCaseKeys(data) as T | null;
  }

  /**
   * Find multiple by custom filters
   */
  async findMany<T>(
    tableName: string,
    filters: Record<string, any>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    return this.findAll<T>(tableName, { ...options, filters });
  }

  /**
   * Create new record
   */
  async create<T>(tableName: string, data: Partial<T>): Promise<T> {
    const dbPayload = this.snakeCaseKeys(data);

    const { data: inserted, error } = await this.client
      .from(tableName)
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error(`❌ [GenericRepository create ${tableName}] Error:`, error.message);
      throw new Error(`Failed to create ${tableName}: ${error.message}`);
    }

    return this.camelCaseKeys(inserted) as T;
  }

  /**
   * Create multiple records
   */
  async createMany<T>(tableName: string, dataArray: Partial<T>[]): Promise<T[]> {
    const dbPayload = dataArray.map(item => this.snakeCaseKeys(item));

    const { data: inserted, error } = await this.client
      .from(tableName)
      .insert(dbPayload)
      .select();

    if (error) {
      console.error(`❌ [GenericRepository createMany ${tableName}] Error:`, error.message);
      throw new Error(`Failed to create multiple ${tableName}: ${error.message}`);
    }

    return this.camelCaseKeys(inserted) as T[];
  }

  /**
   * Update record by ID (UUID support).
   * `tenantFilter` opsional: ditambahkan sebagai kondisi WHERE ekstra
   * supaya baris tenant lain tidak ikut ke-update walau ID-nya ditebak.
   */
  async update<T>(
    tableName: string,
    id: string,
    data: Partial<T>,
    tenantFilter?: { column: string; value: string }
  ): Promise<T> {
    const dbPayload = this.snakeCaseKeys(data);

    let query = this.client
      .from(tableName)
      .update(dbPayload)
      .eq('id', id);

    if (tenantFilter) {
      query = query.eq(tenantFilter.column, tenantFilter.value);
    }

    const { data: updated, error } = await query.select().maybeSingle();

    if (error) {
      console.error(`❌ [GenericRepository update ${tableName}] Error:`, error.message);
      throw new Error(`Failed to update ${tableName}: ${error.message}`);
    }

    return this.camelCaseKeys(updated) as T;
  }

  /**
   * Update multiple records by filters
   */
  async updateMany<T>(
    tableName: string,
    filters: Record<string, any>,
    data: Partial<T>
  ): Promise<T[]> {
    const dbPayload = this.snakeCaseKeys(data);

    let query = this.client.from(tableName).update(dbPayload);
    query = this.applyFilters(query, filters);

    const { data: updated, error } = await query.select();

    if (error) {
      console.error(`❌ [GenericRepository updateMany ${tableName}] Error:`, error.message);
      throw new Error(`Failed to update multiple ${tableName}: ${error.message}`);
    }

    return this.camelCaseKeys(updated) as T[];
  }

  /**
   * Delete record by ID (UUID support).
   * `tenantFilter` opsional -- alasannya sama dengan update().
   */
  async delete(
    tableName: string,
    id: string,
    tenantFilter?: { column: string; value: string }
  ): Promise<void> {
    let query = this.client
      .from(tableName)
      .delete()
      .eq('id', id);

    if (tenantFilter) {
      query = query.eq(tenantFilter.column, tenantFilter.value);
    }

    const { error } = await query;

    if (error) {
      console.error(`❌ [GenericRepository delete ${tableName}] Error:`, error.message);
      throw new Error(`Failed to delete ${tableName}: ${error.message}`);
    }
  }

  /**
   * Delete multiple records by filters
   */
  async deleteMany(tableName: string, filters: Record<string, any>): Promise<void> {
    let query = this.client.from(tableName).delete();
    query = this.applyFilters(query, filters);

    const { error } = await query;

    if (error) {
      console.error(`❌ [GenericRepository deleteMany ${tableName}] Error:`, error.message);
      throw new Error(`Failed to delete multiple ${tableName}: ${error.message}`);
    }
  }

  /**
   * Count records by filters
   */
  async count(tableName: string, filters: Record<string, any> = {}): Promise<number> {
    let query = this.client.from(tableName).select('*', { count: 'exact', head: true });
    query = this.applyFilters(query, filters);

    const { count, error } = await query;

    if (error) {
      console.error(`❌ [GenericRepository count ${tableName}] Error:`, error.message);
      throw new Error(`Failed to count ${tableName}: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Execute raw SQL query (for complex operations)
   */
  async rawQuery<T>(sql: string, params?: any[]): Promise<T[]> {
    const { data, error } = await this.client.rpc('exec_sql', { sql, params });

    if (error) {
      console.error('❌ [GenericRepository rawQuery] Error:', error.message);
      throw new Error(`Failed to execute raw query: ${error.message}`);
    }

    return this.camelCaseKeys(data) as T[];
  }

  /**
   * Join/relate tables dynamically
   */
  async withRelation<T, R>(
    tableName: string,
    relationTable: string,
    foreignKey: string,
    options: QueryOptions = {}
  ): Promise<(T & { relation: R })[]> {
    const { select = '*', filters = {} } = options;

    const selectString = `${select}, ${relationTable}(*)`;

    let query = this.client.from(tableName).select(selectString);
    query = this.applyFilters(query, filters);

    const { data, error } = await query;

    if (error) {
      console.error(`❌ [GenericRepository withRelation] Error:`, error.message);
      throw new Error(`Failed to fetch with relation: ${error.message}`);
    }

    return this.camelCaseKeys(data) as (T & { relation: R })[];
  }

  /**
   * Helper: Build select string with relations
   */
  private buildSelectString(select: string, relations?: string[]): string {
    if (!relations || relations.length === 0) return select;

    const relationSelects = relations.map(rel => `${rel}(*)`).join(', ');
    return `${select}, ${relationSelects}`;
  }

  /**
   * Helper: Apply filters to query
   */
  private applyFilters(
    query: any,
    filters: Record<string, any>
  ): any {
    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([operator, operand]) => {
          switch (operator) {
            case 'eq':
              query = query.eq(key, operand);
              break;
            case 'neq':
              query = query.neq(key, operand);
              break;
            case 'gt':
              query = query.gt(key, operand);
              break;
            case 'gte':
              query = query.gte(key, operand);
              break;
            case 'lt':
              query = query.lt(key, operand);
              break;
            case 'lte':
              query = query.lte(key, operand);
              break;
            case 'like':
              query = query.like(key, operand);
              break;
            case 'ilike':
              query = query.ilike(key, operand);
              break;
            case 'in':
              query = query.in(key, operand);
              break;
            case 'is':
              query = query.is(key, operand);
              break;
          }
        });
      } else if (Array.isArray(value)) {
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    });

    return query;
  }

  /**
   * Helper: Convert snake_case to camelCase
   */
  private camelCaseKeys(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.camelCaseKeys(item));
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = this.camelCaseKeys(obj[key]);
        return acc;
      }, {} as any);
    }

    return obj;
  }

  /**
   * Helper: Convert camelCase to snake_case
   */
  private snakeCaseKeys(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => this.snakeCaseKeys(item));
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        acc[snakeKey] = this.snakeCaseKeys(obj[key]);
        return acc;
      }, {} as any);
    }

    return obj;
  }
}
