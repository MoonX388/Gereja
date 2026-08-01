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
import { UsersService } from './users.service';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Ambil profil diri sendiri (Bawaan lama kamu)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    const { password, ...user } = req.user;
    return user;
  }

  // 🆕 Ambil SEMUA data jemaat untuk tabel dashboard
  @Get()
  async getAllUsers(@Request() req: any) {
    return this.usersService.findAll(req.user.tenantId);
  }

  // 🆕 Tambah jemaat baru
  @Post()
  async createUser(@Body() body: any, @Request() req: any) {
    return this.usersService.create({ ...body, tenantId: req.user.tenantId });
  }

  // 🆕 Update biodata jemaat ATAU ganti JABATAN (role)
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: any, @Request() req: any) {
    await this.usersService.update(id, body, req.user.tenantId);
    return { message: 'Data jemaat diperbarui' };
  }

  // 🆕 Hapus jemaat
  @Delete(':id')
  async removeUser(@Param('id') id: number, @Request() req: any) {
    await this.usersService.remove(id, req.user.tenantId);
    return { message: 'Jemaat berhasil dihapus' };
  }
}
