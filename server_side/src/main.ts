import { NestFactory, Reflector } from '@nestjs/core'; // ✅ Reflector dari core
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ClassSerializerInterceptor butuh Reflector (Tetap aman)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const corsOrigin = '*';
  app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (origin.endsWith('.gerejapintar.id')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});


  // 🚀 PERBAIKAN 1: Dahulukan 'process.env.PORT' bawaan Railway, baru fallback ke ConfigService
  const port = process.env.PORT || configService.get<number>('SERVER_PORT') || 3001;

  // 🚀 PERBAIKAN 2: Wajib tambahkan '0.0.0.0' agar jaringan Railway bisa menembus masuk
  await app.listen(port);
  
  console.log(`Server running successfully on port ${port}`);
}
bootstrap();
