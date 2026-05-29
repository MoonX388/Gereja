import { Controller, Get, Delete, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    const { password, ...user } = req.user;
    return user;
  }

  // Endpoint untuk menghapus user (jika diperlukan)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removeUser(@Param('id') id: number, @Request() req) {
    // hanya admin atau user sendiri yang bisa hapus (tambahkan logika authorization)
    // Sementara kita izinkan user menghapus dirinya sendiri
    if (req.user.id !== id) {
      throw new Error('Forbidden');
    }
    await this.usersService.remove(id);
    return { message: 'User deleted' };
  }
}