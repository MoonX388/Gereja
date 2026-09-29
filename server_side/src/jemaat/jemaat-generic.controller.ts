import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenericController, ControllerConfig } from '../common/base/generic-controller';
import { JemaatGenericService } from './jemaat-generic.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('jemaat')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class JemaatGenericController extends GenericController {
  constructor(protected service: JemaatGenericService) {
    super(service, {
      path: 'jemaat',
      resourceName: 'Jemaat'
    });
  }

  @Get('status/:status')
  async findByStatus(@Req() req: any, @Param('status') status: string) {
    return this.service.findByStatus(status, this.getTenantId(req));
  }

  @Get('jenis-kelamin/:jenisKelamin')
  async findByJenisKelamin(@Req() req: any, @Param('jenisKelamin') jenisKelamin: string) {
    return this.service.findByJenisKelamin(jenisKelamin, this.getTenantId(req));
  }

  @Get('active/list')
  async findActiveJemaat(@Req() req: any) {
    return this.service.findActiveJemaat(this.getTenantId(req));
  }
}
