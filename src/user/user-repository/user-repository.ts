import { Inject, Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { user } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston'

@Injectable()
export class UserRepository {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
    ){
        this.logger.info(`create user repository`)
    }

    async save(first_name: string, last_name?: string): Promise<user>{
        this.logger.info(`create user with ${first_name} and ${last_name}`)
        return await this.prismaService.user.create({
            data:{
                first_name: first_name,
                last_name: last_name
            }
        })
    }

}


// export function createUserRepository(connection: Connection): UserRepository{
//     const repository = new UserRepository()
//     repository.connection = connection;
//     return repository
// }