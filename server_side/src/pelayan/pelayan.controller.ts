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
import { PelayanService } from './pelayan.service';
import { Pelayan } from '../entity/pelayan.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('pelayan')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class PelayanController {
  constructor(private readonly pelayanService: PelayanService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Pelayan[]> {
    return this.pelayanService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Pelayan>, @Request() req: any): Promise<Pelayan> {
    return this.pelayanService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Pelayan>, @Request() req: any) {
    await this.pelayanService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data pelayan diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.pelayanService.remove(Number(id), req.user.tenantId);
    return { message: 'Data pelayan dihapus' };
  }
}
