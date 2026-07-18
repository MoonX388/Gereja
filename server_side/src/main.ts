import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ✅ Global interceptor
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ✅ Proper CORS setup
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server calls
      if (origin.endsWith('.gerejapintar.id')) {
        return callback(null, true); // allow all subdomains of gerejapintar.id
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // allow cookies/auth headers
  });

  // ✅ Railway port handling
  const port = process.env.PORT || configService.get<number>('SERVER_PORT') || 3001;

  // ✅ Bind to 0.0.0.0 so Railway can expose it
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running successfully on port ${port}`);
}
bootstrap();
