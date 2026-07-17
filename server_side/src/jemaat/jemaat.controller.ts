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
import { data as Jemaat } from '../entity/data.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('jemaat')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const subownerId = req.user.id; // ID Subowner didapat otomatis dari akun yang sedang login
    return this.jemaatService.getDashboardData(subownerId);
  }

  @Get()
  async getAll(@Req() req: any): Promise<Jemaat[]> {
    const subownerId = req.user.id; 
    return this.jemaatService.findAll(subownerId);
  }

  @Post()
  async create(@Body() data: Partial<Jemaat>, @Req() req: any): Promise<Jemaat> {
    const subownerId = req.user.id;
    return this.jemaatService.create(data, subownerId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    const subownerId = req.user.id;
    await this.jemaatService.update(Number(id), data, subownerId);
    return { message: 'Data jemaat berhasil diperbarui' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const subownerId = req.user.id;
    await this.jemaatService.remove(Number(id), subownerId);
    return { message: 'Data jemaat berhasil dihapus' };
  }
}