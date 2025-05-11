import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Crea la app a partir del módulo principal

  app.use(helmet()); // Aplica seguridad a los headers HTTP

  const configService = app.get(ConfigService); // Obtiene el servicio de configuración

  const globalPrefix: string = configService.get('prefix') as string; // Lee el prefijo global desde config

  app.setGlobalPrefix(globalPrefix); // Establece el prefijo global para las rutas

  app.enableVersioning({
    // Habilita versionado de rutas
    type: VersioningType.URI, // Usa la versión en la URI (/v1/)
    defaultVersion: '1', // Versión por defecto
  });

  app.useGlobalPipes(
    // Aplica validaciones globales a los DTOs
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }), // Permite solo campos permitidos
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Aplica serialización global (excluye campos con @Exclude)

  const swaggerHabilitado: boolean = configService.get(
    'swaggerHabilitado',
  ) as boolean; // Verifica si Swagger está habilitado desde config

  if (swaggerHabilitado) {
    const config = new DocumentBuilder() // Crea la config de Swagger
      .setTitle('Encuestas') // Título de la doc
      .setDescription('Descripción de la API del sistema de encuestas') // Descripción
      .build();
    const document = SwaggerModule.createDocument(app, config); // Genera la documentación
    SwaggerModule.setup(globalPrefix, app, document); // Expone Swagger en /[prefix]
  }

  const port: number = configService.get<number>('port') as number; // Obtiene el puerto desde config
  await app.listen(port); // Inicia el servidor en ese puerto
}

bootstrap();
