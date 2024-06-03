import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, MongoDBConnection, MySQLConnection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import * as process from 'process'
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService, 
    {
      provide: Connection,
      useClass: process.env.DATABASE == 'mysql' ? MySQLConnection : MongoDBConnection
    },
    {
      provide: MailService,
      useValue: mailService
    }, 
    {
      provide: 'EmailService',
      useExisting: MailService
    },
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService]
    },     
    UserRepository,
    // {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [ Connection ]
    // },
    MemberService
  ],
  exports: [UserService]
})
export class UserModule {}
