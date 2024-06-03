import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(){
        super();
        console.info('create prisma service')
    }

    async onModuleInit() {
        console.info(`connect prisma`)
        await this.$connect();
    }

    async onModuleDestroy() {
        console.info(`disconnect prisma`)
        await this.$disconnect();
    }

}
