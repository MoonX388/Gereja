import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PelayanService } from './pelayan.service';
import { Pelayan } from '../entity/pelayan.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('pelayan')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class PelayanController {
  constructor(private readonly pelayanService: PelayanService) {}

  @Get()
  async getAll(): Promise<Pelayan[]> {
    return this.pelayanService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Pelayan>): Promise<Pelayan> {
    return this.pelayanService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Pelayan>) {
    await this.pelayanService.update(Number(id), data);
    return { message: 'Data pelayan diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.pelayanService.remove(Number(id));
    return { message: 'Data pelayan dihapus' };
  }
}