import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
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
  async getAll(): Promise<Keuangan[]> {
    return this.keuanganService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Keuangan>): Promise<Keuangan> {
    return this.keuanganService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Keuangan>) {
    await this.keuanganService.update(Number(id), data);
    return { message: 'Data keuangan diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.keuanganService.remove(Number(id));
    return { message: 'Data keuangan dihapus' };
  }
}
