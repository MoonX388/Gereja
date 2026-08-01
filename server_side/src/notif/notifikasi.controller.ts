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
import { NotifikasiService } from './notifikasi.service';
import { Notifikasi } from '../entity/notifikasi.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifikasi')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class NotifikasiController {
  constructor(private readonly notifService: NotifikasiService) {}

  @Get()
  async getAll(@Request() req: any): Promise<Notifikasi[]> {
    return this.notifService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() data: Partial<Notifikasi>, @Request() req: any): Promise<Notifikasi> {
    return this.notifService.create(data, req.user.tenantId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Notifikasi>, @Request() req: any) {
    await this.notifService.update(Number(id), data, req.user.tenantId);
    return { message: 'Data notifikasi diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.notifService.remove(Number(id), req.user.tenantId);
    return { message: 'Data notifikasi dihapus' };
  }
}
