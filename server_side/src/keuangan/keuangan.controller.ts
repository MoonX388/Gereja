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
import { KeuanganService } from './keuangan.service';
import { Keuangan } from '../entity/keuangan.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('keuangan')
@UseGuards(AuthGuard('jwt'), AdminGuard) // only admin can manage
export class KeuanganController {
  constructor(private readonly keuanganService: KeuanganService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Keuangan[]> {
    return this.keuanganService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Keuangan>, @Request() req: any): Promise<Keuangan> {
    return this.keuanganService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Keuangan>, @Request() req: any) {
    await this.keuanganService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data keuangan diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.keuanganService.remove(Number(id), req.user.tenantId);
    return { message: 'Data keuangan dihapus' };
  }
}
