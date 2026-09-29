import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenericController, ControllerConfig } from '../common/base/generic-controller';
import { KeuanganGenericService } from './keuangan-generic.service';
import { assertUUID } from '../common/utils/uuid-validator';
import { AdminGuard } from '../auth/admin.guard';

@Controller('keuangan')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class KeuanganGenericController extends GenericController {
  constructor(protected service: KeuanganGenericService) {
    super(service, {
      path: 'keuangan',
      resourceName: 'Keuangan'
    });
  }

  @Get('tipe/:tipe')
  async findByTipe(@Req() req: any, @Param('tipe') tipe: string) {
    return this.service.findByTipe(tipe, this.getTenantId(req));
  }

  @Get('range')
  async findByTanggalRange(
    @Req() req: any,
    @Query('start') startDate: string,
    @Query('end') endDate: string
  ) {
    return this.service.findByTanggalRange(startDate, endDate, this.getTenantId(req));
  }

  @Get('pemasukan')
  async findPemasukan(@Req() req: any) {
    return this.service.findPemasukan(this.getTenantId(req));
  }

  @Get('pengeluaran')
  async findPengeluaran(@Req() req: any) {
    return this.service.findPengeluaran(this.getTenantId(req));
  }
}
