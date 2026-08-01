import { NestFactory, Reflector } from '@nestjs/core'; // ✅ Reflector dari core
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { NotFoundException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const usersService = app.get(UsersService);

  // ClassSerializerInterceptor butuh Reflector (Tetap aman)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(async (req, res, next) => {
    const host = req.hostname || req.headers.host || '';
    const hostName = typeof host === 'string' ? host.split(':')[0] : '';
    const subdomainMatch = hostName.match(/^([^.]+)\.gerejapintar\.id$/i);

    if (!subdomainMatch) {
      return next();
    }

    const subdomain = subdomainMatch[1];
    if (!subdomain || subdomain.toLowerCase() === 'www') {
      return next();
    }

    const church = await usersService.findChurchBySubdomain(subdomain);
    if (!church) {
      return next(new NotFoundException('Subdomain gereja tidak terdaftar'));
    }

    return next();
  });

  const corsOrigin = '*';
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (origin.endsWith('localhost:3000') || origin.endsWith('localhost:3001') || origin.endsWith('localhost:3002') || origin.endsWith(process.env.DOMAIN) || origin.endsWith('www' + process.env.DOMAIN)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || configService.get<number>('SERVER_PORT') || 3001;
  await app.listen(port);
  console.log(`Server running successfully on port ${port}`);
}
bootstrap();
