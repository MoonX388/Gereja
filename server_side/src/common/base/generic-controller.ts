import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  ParseBoolPipe,
  ParseIntPipe
} from '@nestjs/common';
import { GenericService } from './generic-service';
import { QueryOptions, PaginationOptions } from './generic-repository';
import { assertUUID, validateUUID } from '../utils/uuid-validator';

export interface ControllerConfig {
  path: string;
  resourceName?: string;
}

/**
 * Generic Controller that provides standard REST endpoints
 * Extend this class in your controllers for automatic CRUD operations
 *
 * PENTING -- tenant isolation:
 * Semua method di bawah mengambil `tenantId` dari `request.user.tenantId`
 * (diisi oleh JwtStrategy setelah token diverifikasi) dan meneruskannya
 * ke GenericService. GenericService yang menegakkan filter/stamping
 * tenant_id-nya. JANGAN hilangkan `@Req() req` atau parameter tenantId
 * ini di controller turunan -- itu satu-satunya jalur isolasi antar
 * gereja untuk sistem CRUD generic ini.
 */
export class GenericController {
  protected service: GenericService;
  protected config: ControllerConfig;

  constructor(service: GenericService, config: ControllerConfig) {
    this.service = service;
    this.config = config;
  }

  /** Ambil tenantId milik user yang sedang login dari request. */
  protected getTenantId(req: any): string | undefined {
    return req?.user?.tenantId;
  }

  /**
   * GET - Get all records with optional filters, pagination, and relations
   * Query params: filters (JSON string), select, relations, orderBy, limit, offset
   */
  @Get()
  async findAll(
    @Req() req: any,
    @Query('filters') filters?: string,
    @Query('select') select?: string,
    @Query('relations') relations?: string,
    @Query('orderBy') orderBy?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('paginate', new DefaultValuePipe(false), ParseBoolPipe) paginate?: boolean
  ) {
    const tenantId = this.getTenantId(req);
    const options: QueryOptions = {};

    if (select) options.select = select;
    if (relations) options.relations = relations.split(',');
    if (orderBy) {
      const [column, order] = orderBy.split(',');
      options.orderBy = {
        column,
        ascending: order !== 'desc'
      };
    }

    let parsedFilters: Record<string, any> = {};
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters);
      } catch (e) {
        throw new Error('Invalid filters JSON format');
      }
    }
    // Klien tidak boleh menyuntikkan/menimpa tenant_id lewat query filters.
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    if (paginate) {
      return this.service.findPaginated(
        { page, limit },
        { ...options, filters: parsedFilters },
        tenantId
      );
    }

    return this.service.findAll(
      {
        ...options,
        filters: parsedFilters,
        limit,
        offset
      },
      tenantId
    );
  }

  /**
   * GET - Get single record by ID (UUID)
   */
  @Get(':id')
  async findById(
    @Req() req: any,
    @Param('id') id: string,
    @Query('select') select?: string,
    @Query('relations') relations?: string
  ) {
    assertUUID(id, 'id');
    const tenantId = this.getTenantId(req);

    const options: QueryOptions = {};

    if (select) options.select = select;
    if (relations) options.relations = relations.split(',');

    return this.service.findById(id, options, tenantId);
  }

  /**
   * POST - Create new record
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: any, @Body() data: any) {
    const tenantId = this.getTenantId(req);
    return this.service.create(data, tenantId);
  }

  /**
   * POST - Create multiple records
   */
  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async createMany(@Req() req: any, @Body() dataArray: any[]) {
    const tenantId = this.getTenantId(req);
    return this.service.createMany(dataArray, tenantId);
  }

  /**
   * PUT - Update record by ID (UUID)
   */
  @Put(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: any
  ) {
    assertUUID(id, 'id');
    const tenantId = this.getTenantId(req);
    return this.service.update(id, data, tenantId);
  }

  /**
   * PUT - Update multiple records by filters
   */
  @Put('bulk/update')
  async updateMany(
    @Req() req: any,
    @Query('filters') filters: string,
    @Body() data: any
  ) {
    const tenantId = this.getTenantId(req);
    let parsedFilters: Record<string, any>;
    try {
      parsedFilters = JSON.parse(filters);
    } catch (e) {
      throw new Error('Invalid filters JSON format');
    }
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    return this.service.updateMany(parsedFilters, data, tenantId);
  }

  /**
   * DELETE - Delete record by ID (UUID)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Req() req: any, @Param('id') id: string) {
    assertUUID(id, 'id');
    const tenantId = this.getTenantId(req);
    return this.service.delete(id, tenantId);
  }

  /**
   * DELETE - Delete multiple records by filters
   */
  @Delete('bulk')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMany(@Req() req: any, @Query('filters') filters: string) {
    const tenantId = this.getTenantId(req);
    let parsedFilters: Record<string, any>;
    try {
      parsedFilters = JSON.parse(filters);
    } catch (e) {
      throw new Error('Invalid filters JSON format');
    }
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    return this.service.deleteMany(parsedFilters, tenantId);
  }

  /**
   * GET - Count records
   */
  @Get('count/count')
  async count(@Req() req: any, @Query('filters') filters?: string) {
    const tenantId = this.getTenantId(req);
    let parsedFilters: Record<string, any> = {};
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters);
      } catch (e) {
        throw new Error('Invalid filters JSON format');
      }
    }
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    return { count: await this.service.count(parsedFilters, tenantId) };
  }

  /**
   * GET - Search records
   */
  @Get('search/search')
  async search(
    @Req() req: any,
    @Query('q') searchTerm: string,
    @Query('fields') searchFields: string,
    @Query('select') select?: string,
    @Query('relations') relations?: string
  ) {
    if (!searchTerm || !searchFields) {
      throw new Error('Search term and fields are required');
    }
    const tenantId = this.getTenantId(req);

    const fields = searchFields.split(',');
    const options: QueryOptions = {};

    if (select) options.select = select;
    if (relations) options.relations = relations.split(',');

    return this.service.search(searchTerm, fields, options, tenantId);
  }

  /**
   * POST - Upsert (create or update)
   */
  @Post('upsert')
  async upsert(
    @Req() req: any,
    @Query('filters') filters: string,
    @Body() data: any
  ) {
    const tenantId = this.getTenantId(req);
    let parsedFilters: Record<string, any>;
    try {
      parsedFilters = JSON.parse(filters);
    } catch (e) {
      throw new Error('Invalid filters JSON format');
    }
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    return this.service.upsert(parsedFilters, data, tenantId);
  }

  /**
   * POST - Bulk operations
   */
  @Post('bulk/operations')
  async bulkOperations(@Req() req: any, @Body() operations: Array<{
    type: 'create' | 'update' | 'delete';
    data?: any;
    id?: string;
    filters?: Record<string, any>;
  }>) {
    const tenantId = this.getTenantId(req);
    return this.service.bulkOperation(operations, tenantId);
  }

  /**
   * GET - Get related records by foreign key (UUID)
   */
  @Get('related/:foreignKey/:foreignKeyValue')
  async getRelatedByForeignKey(
    @Req() req: any,
    @Param('foreignKey') foreignKey: string,
    @Param('foreignKeyValue') foreignKeyValue: string,
    @Query('select') select?: string,
    @Query('relations') relations?: string
  ) {
    if (validateUUID(foreignKeyValue)) {
      assertUUID(foreignKeyValue, 'foreignKeyValue');
    }
    const tenantId = this.getTenantId(req);

    const options: QueryOptions = {};

    if (select) options.select = select;
    if (relations) options.relations = relations.split(',');

    return this.service.getRelatedByForeignKey(foreignKey, foreignKeyValue, options, tenantId);
  }

  /**
   * GET - Get records with relation
   */
  @Get('with-relation/:relationTable')
  async withRelation(
    @Req() req: any,
    @Param('relationTable') relationTable: string,
    @Query('foreignKey') foreignKey: string,
    @Query('filters') filters?: string,
    @Query('select') select?: string
  ) {
    if (!foreignKey) {
      throw new Error('foreignKey parameter is required');
    }
    const tenantId = this.getTenantId(req);

    let parsedFilters: Record<string, any> = {};
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters);
      } catch (e) {
        throw new Error('Invalid filters JSON format');
      }
    }
    delete parsedFilters.tenant_id;
    delete parsedFilters.tenantId;

    const options: QueryOptions = {
      filters: parsedFilters,
      select: select || '*'
    };

    return this.service.withRelation(relationTable, foreignKey, options, tenantId);
  }
}
