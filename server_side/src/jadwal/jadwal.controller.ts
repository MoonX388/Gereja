import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { Jadwal } from '../entity/jadwal.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('jadwal')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Jadwal[]> {
    return this.jadwalService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Jadwal>, @Request() req: any): Promise<Jadwal> {
    return this.jadwalService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Jadwal>, @Request() req: any) {
    await this.jadwalService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data jadwal diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.jadwalService.remove(Number(id), req.user.tenantId);
    return { message: 'Data jadwal dihapus' };
  }
}
