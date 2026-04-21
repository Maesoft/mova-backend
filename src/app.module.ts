import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutinesModule } from './routines/routines.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    UsersModule,
    AuthModule,
    ExercisesModule,
    RoutinesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
