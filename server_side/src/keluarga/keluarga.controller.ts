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
import { KeluargaService } from './keluarga.service';
import { Keluarga } from '../entity/keluarga.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('keluarga')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class KeluargaController {
  constructor(private readonly keluargaService: KeluargaService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Keluarga[]> {
    return this.keluargaService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Keluarga>, @Request() req: any): Promise<Keluarga> {
    return this.keluargaService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Keluarga>, @Request() req: any) {
    await this.keluargaService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data keluarga diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.keluargaService.remove(Number(id), req.user.tenantId);
    return { message: 'Data keluarga dihapus' };
  }
}
