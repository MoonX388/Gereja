// Gereja-main/server_side/src/jemaat/jemaat.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JemaatService } from './jemaat.service';
import { Jemaat } from '../entity/jemaat.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('jemaat')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const tenantId = req.user.tenantId; // Tenant ID dari token JWT
    return this.jemaatService.getDashboardData(tenantId);
  }

  @Get()
  async getAll(@Req() req: any): Promise<Jemaat[]> {
    const tenantId = req.user.tenantId;
    return this.jemaatService.findAll(tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Jemaat>, @Req() req: any): Promise<Jemaat> {
    const tenantId = req.user.tenantId;
    return this.jemaatService.create(data, tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    const tenantId = req.user.tenantId;
    await this.jemaatService.update(Number(id), data, tenantId);
    return { message: 'Data jemaat berhasil diperbarui' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user.tenantId;
    await this.jemaatService.remove(Number(id), tenantId);
    return { message: 'Data jemaat berhasil dihapus' };
  }
}