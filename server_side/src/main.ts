import { NestFactory, Reflector } from '@nestjs/core'; // ✅ Reflector dari core
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ClassSerializerInterceptor butuh Reflector (Tetap aman)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // untuk request non-browser

    // ✅ Izinkan semua subdomain *.gerejapintar.id
    if (
      origin.endsWith('.gerejapintar.id') || 
      origin === 'https://gerejapintar.id' || 
      origin === 'http://localhost:3000' || 
      origin === 'http://localhost:3001' || 
      origin === 'http://localhost:3002'
    ) {
      return callback(null, true);
    }

    // ❌ Tolak domain lain
    callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});



  // 🚀 PERBAIKAN 1: Dahulukan 'process.env.PORT' bawaan Railway, baru fallback ke ConfigService
  const port = process.env.PORT || configService.get<number>('SERVER_PORT') || 3001;

  // 🚀 PERBAIKAN 2: Wajib tambahkan '0.0.0.0' agar jaringan Railway bisa menembus masuk
  await app.listen(port, '0.0.0.0');
  
  console.log(`Server running successfully on port ${port}`);
}
bootstrap();
