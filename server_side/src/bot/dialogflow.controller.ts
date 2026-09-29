import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TenantsService } from '../tenants/tenants.service';

@Controller('v2/webhook')
export class DialogflowController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('dialogflow')
  async handleDialogflow(
    @Body() body: any,
    @Headers('x-dialogflow-secret') secret?: string,
  ) {
    const expectedSecret = this.configService.get<string>('DIALOGFLOW_WEBHOOK_SECRET');
    if (expectedSecret && secret !== expectedSecret) {
      throw new HttpException('Webhook tidak diizinkan', HttpStatus.UNAUTHORIZED);
    }

    const parameters = body.queryResult?.parameters ?? body.sessionInfo?.parameters ?? {};
    const subdomain = parameters.subdomain ?? body.subdomain;
    const tenantId = parameters.tenantId ?? body.tenantId;
    const tenant = tenantId
      ? await this.tenantsService.findById(String(tenantId))
      : subdomain
        ? await this.tenantsService.findBySubdomain(String(subdomain))
        : null;

    if (!tenant) {
      return {
        fulfillmentText: 'Maaf, gereja belum dapat diidentifikasi. Silakan gunakan subdomain gereja Anda.',
      };
    }

    const intentName = body.queryResult?.intent?.displayName ?? '';
    const customMessage = parameters.message ?? parameters.pesan;
    let fulfillmentText = `Selamat datang di ${tenant.namaGereja ?? 'gereja kami'}.`;

    if (intentName === 'Tanya Jadwal Ibadah') {
      fulfillmentText = `Jadwal ibadah ${tenant.namaGereja ?? 'gereja kami'} dapat dilihat pada menu jadwal.`;
    } else if (intentName === 'Tanya Syarat Pendaftaran Nikah') {
      fulfillmentText = 'Syarat pendaftaran nikah: fotokopi KTP dan KK, surat baptis dan sidi, serta dokumen administrasi gereja.';
    } else if (intentName === 'Kirim Pesan Custom' || intentName === 'Kirim Pengingat') {
      fulfillmentText = customMessage || 'Pesan pengingat belum diisi.';
    }

    return {
      fulfillmentText,
      outputContexts: body.queryResult?.outputContexts,
      sessionInfo: {
        parameters: {
          ...(body.sessionInfo?.parameters ?? {}),
          tenantId: tenant.id,
          namaGereja: tenant.namaGereja,
        },
      },
    };
  }
}
