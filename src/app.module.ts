import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { CommonModule } from './common/common.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { LikeModule } from './like/like.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { Project } from './project/entities/project.entity';
import { Like } from './like/entities/like.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles/role.guard';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string()
          .required()
          .equal(
            'buckit-prod-postgres.cu2tuicjcenu.ap-northeast-2.rds.amazonaws.com'
          ),
        DB_PORT: Joi.string().required().equal('5432'),
        DB_USER: Joi.string().required().equal('buckit'),
        DB_PASSWORD: Joi.string().required().equal('buckit8080'),
        DB_DATABASE: Joi.string().required().equal('buckit'),
        SECRET_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Project, Like, Order],
      synchronize: true,
    }),
    UsersModule,
    CommonModule,
    ProjectModule,
    LikeModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
