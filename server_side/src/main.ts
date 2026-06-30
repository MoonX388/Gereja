import { NestFactory, Reflector } from '@nestjs/core'; // ✅ Reflector dari core
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // ClassSerializerInterceptor butuh Reflector
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '*';
  app.enableCors({ origin: corsOrigin });

  const port = configService.get<number>('SERVER_PORT') || 3001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();