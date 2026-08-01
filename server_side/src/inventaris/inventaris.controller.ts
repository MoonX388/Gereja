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
import { InventarisService } from './inventaris.service';
import { Inventaris } from '../entity/inventaris.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventaris')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class InventarisController {
  constructor(private readonly inventarisService: InventarisService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Inventaris[]> {
    return this.inventarisService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Inventaris>, @Request() req: any): Promise<Inventaris> {
    return this.inventarisService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Inventaris>, @Request() req: any) {
    await this.inventarisService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data inventaris diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.inventarisService.remove(Number(id), req.user.tenantId);
    return { message: 'Data inventaris dihapus' };
  }
}
