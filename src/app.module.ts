import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './database/SnakeNamingStrategy';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          type: configService.dbType,
          host: configService.dbHost,
          port: configService.dbPort,
          username: configService.dbUser,
          password: configService.dbPass,
          database: configService.dbName,
          logging: configService.dbLogging,
          charset: 'utf8mb4',
          entities: [
          ],
          synchronize: configService.dbSync,
          bigNumberStrings: false,
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleAsyncOptions),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
