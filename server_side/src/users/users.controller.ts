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
  async getAllUsers() {
    return this.usersService.findAll();
  }

  // 🆕 Tambah jemaat baru
  @Post()
  async createUser(@Body() body: any) {
    return this.usersService.create(body);
  }

  // 🆕 Update biodata jemaat ATAU ganti JABATAN (role)
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: any) {
    await this.usersService.update(id, body);
    return { message: 'Data jemaat diperbarui' };
  }

  // 🆕 Hapus jemaat
  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    await this.usersService.remove(id);
    return { message: 'Jemaat berhasil dihapus' };
  }
}
