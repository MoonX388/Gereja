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
import { KeluargaService } from './keluarga.service';
import { Keluarga } from '../entity/keluarga.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('keluarga')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class KeluargaController {
  constructor(private readonly keluargaService: KeluargaService) {}

  @Get()
  async getAll(): Promise<Keluarga[]> {
    return this.keluargaService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Keluarga>): Promise<Keluarga> {
    return this.keluargaService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Keluarga>) {
    await this.keluargaService.update(Number(id), data);
    return { message: 'Data keluarga diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.keluargaService.remove(Number(id));
    return { message: 'Data keluarga dihapus' };
  }
}
