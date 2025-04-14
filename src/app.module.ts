import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { EncuestasModule } from './modules/encuestas/encuestas.module';

@Module({
  imports: [
    EncuestasModule,
    ConfigModule.forRoot({
      load: [configuration], // Usa la función "configuration" para definir las variables
      isGlobal: true, // Hace que el módulo esté disponible sin necesidad de importarlo en cada módulo
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignora el archivo .env si está en producción
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
