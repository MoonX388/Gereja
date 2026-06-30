import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { Jadwal } from '../entity/jadwal.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('jadwal')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @Get()
  async getAll(): Promise<Jadwal[]> {
    return this.jadwalService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Jadwal>): Promise<Jadwal> {
    return this.jadwalService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Jadwal>) {
    await this.jadwalService.update(Number(id), data);
    return { message: 'Data jadwal diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.jadwalService.remove(Number(id));
    return { message: 'Data jadwal dihapus' };
  }
}