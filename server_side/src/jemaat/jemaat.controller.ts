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
import { JemaatService } from './jemaat.service';
import { User as Jemaat } from '../entity/data.entity';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('jemaat')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JemaatController {
  constructor(private readonly jemaatService: JemaatService) {}

  @Get()
  async getAll(): Promise<Jemaat[]> {
    return this.jemaatService.findAll();
  }

  @Post()
  async create(@Body() data: Partial<Jemaat>): Promise<Jemaat> {
    return this.jemaatService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    // Hapus ": Promise<User>" dari baris ini jika sebelumnya ada
    await this.jemaatService.update(Number(id), data);
    return { message: 'Data jemaat berhasil diperbarui' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    // Hapus ": Promise<User>" dari baris ini jika sebelumnya ada
    await this.jemaatService.remove(Number(id));
    return { message: 'Data jemaat berhasil dihapus' };
  }
}
