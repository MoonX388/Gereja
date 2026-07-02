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
import { InventarisService } from './inventaris.service';
import { Inventaris } from '../entity/inventaris.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventaris')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class InventarisController {
  constructor(private readonly inventarisService: InventarisService) {}

  @Get()
  async getAll(): Promise<Inventaris[]> {
    return this.inventarisService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Inventaris>): Promise<Inventaris> {
    return this.inventarisService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Inventaris>) {
    await this.inventarisService.update(Number(id), data);
    return { message: 'Data inventaris diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.inventarisService.remove(Number(id));
    return { message: 'Data inventaris dihapus' };
  }
}
