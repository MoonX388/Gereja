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
    return this.inventarisService.findAll(req.user.tenantId, req);
  }

  @Post()
  async create(@Body() data: Partial<Inventaris>, @Request() req: any): Promise<Inventaris> {
    return this.inventarisService.create(data, req.user.tenantId, req);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Inventaris>, @Request() req: any) {
    await this.inventarisService.update(id, data, req.user.tenantId, req);
    return { message: 'Data inventaris diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.inventarisService.remove(id, req.user.tenantId, req);
    return { message: 'Data inventaris dihapus' };
  }
}
