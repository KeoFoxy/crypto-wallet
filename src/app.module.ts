import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import configuration from '@/configs/configuration';
import dbConfig from '@/configs/database.config';
import { DatabaseEnvType } from './configs/types';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal:true, load: [configuration, dbConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.getOrThrow<string>('nodeEnv');
        const db = configService.getOrThrow<DatabaseEnvType>('db');

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.name,

          synchronize: 'dev' === nodeEnv,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
