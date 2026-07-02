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
import { NotifikasiService } from './notifikasi.service';
import { Notifikasi } from '../entity/notifikasi.entity';
/*import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';*/

@Controller('notifikasi')
/*@UseGuards(AuthGuard('jwt'), AdminGuard)*/
export class NotifikasiController {
  constructor(private readonly notifService: NotifikasiService) {}

  @Get()
  async getAll(): Promise<Notifikasi[]> {
    return this.notifService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Notifikasi>): Promise<Notifikasi> {
    return this.notifService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Notifikasi>) {
    await this.notifService.update(Number(id), data);
    return { message: 'Data notifikasi diperbarui' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.notifService.remove(Number(id));
    return { message: 'Data notifikasi dihapus' };
  }
}
