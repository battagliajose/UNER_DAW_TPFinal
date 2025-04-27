import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { EncuestasModule } from './modules/encuestas/encuestas.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EncuestasModule,
    ConfigModule.forRoot({
      load: [configuration], // Usa la función "configuration" para definir las variables
      isGlobal: true, // Hace que el módulo esté disponible sin necesidad de importarlo en cada módulo
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Ignora el archivo .env si está en producción
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        database: configService.get('database.name'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        autoLoadEntities: true,
        synchronize: false,
        logging: configService.get('database.logging'),
        logger: configService.get('database.logger'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
