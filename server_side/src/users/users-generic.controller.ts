import { Controller, Get, Param, Put, Patch, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenericController, ControllerConfig } from '../common/base/generic-controller';
import { UsersGenericService } from './users-generic.service';
import { EditUserDto, UpdatePermissionsDto } from './dto/edit-user.dto';
import { assertUUID } from '../common/utils/uuid-validator';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class UsersGenericController extends GenericController {
  constructor(protected service: UsersGenericService) {
    super(service, {
      path: 'users',
      resourceName: 'User'
    });
  }

  // Endpoint khusus untuk user -- semua di-scope ke tenant pemanggil,
  // JANGAN pernah percaya tenant_id/tenantId yang datang dari URL/body.
  @Get('email/:email')
  async findByEmail(@Req() req: any, @Param('email') email: string) {
    return this.service.findByEmail(email, this.getTenantId(req));
  }

  @Get('username/:username')
  async findByUsername(@Req() req: any, @Param('username') username: string) {
    return this.service.findByUsername(username, this.getTenantId(req));
  }

  @Get('role/:role')
  async findByRole(@Req() req: any, @Param('role') role: string) {
    return this.service.findByRole(role, this.getTenantId(req));
  }

  /**
   * Dulu endpoint ini menerima :tenantId dari URL dan mengembalikan user
   * milik tenant APAPUN yang diminta -- itu cross-tenant IDOR. Sekarang
   * param URL diabaikan; selalu memakai tenant milik admin yang login.
   */
  @Get('tenant/:tenantId')
  async findByTenantId(@Req() req: any) {
    const tenantId = this.getTenantId(req);
    assertUUID(tenantId as string, 'tenantId');
    return this.service.findByTenantId(tenantId as string);
  }

  @Get('check-permission/:userId/:permission')
  async hasPermission(
    @Req() req: any,
    @Param('userId') userId: string,
    @Param('permission') permission: string
  ) {
    assertUUID(userId, 'userId');
    const hasPermission = await this.service.hasPermission(userId, permission, this.getTenantId(req));
    return { hasPermission };
  }

  // Endpoint untuk Edit User
  @Get('edit/:id')
  async getUserForEdit(@Req() req: any, @Param('id') id: string) {
    assertUUID(id, 'id');
    return this.service.getUserForEdit(id, this.getTenantId(req));
  }

  @Put('edit/:id')
  @HttpCode(HttpStatus.OK)
  async editUser(
    @Req() req: any,
    @Param('id') id: string,
    @Body() userData: EditUserDto
  ) {
    assertUUID(id, 'id');
    return this.service.editUser(id, userData, this.getTenantId(req));
  }

  @Patch('permissions/:id')
  @HttpCode(HttpStatus.OK)
  async updatePermissionsWithMerge(
    @Req() req: any,
    @Param('id') id: string,
    @Body() permissions: UpdatePermissionsDto
  ) {
    assertUUID(id, 'id');
    return this.service.updatePermissionsWithMerge(id, permissions, this.getTenantId(req));
  }
}
