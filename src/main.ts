import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieparser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationFilter } from './validation/validation.filter';
import { TimeInterceptor } from './time/time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieparser("rahasia"))

  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER)
  app.useLogger(loggerService)

  app.useGlobalFilters(new ValidationFilter)
  // app.useGlobalPipes()
  app.useGlobalInterceptors(new TimeInterceptor)
  // app.useGlobalGuards(...)

  app.enableShutdownHooks()

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
  
}
bootstrap();
