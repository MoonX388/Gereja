import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@Request() req: any) {
    console.log('[SettingsController] Get settings for user:', { id: req.user.id, role: req.user.role, tenantId: req.user.tenantId });
    return this.settingsService.getForTenant(req.user.tenantId);
  }

  @Patch()
  updateSettings(@Request() req: any, @Body() data: Record<string, any>) {
    return this.settingsService.updateForTenant(req.user.tenantId, data);
  }
}
