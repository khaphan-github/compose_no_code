import { CrudController } from './controller/crud.controller';
import { Module } from '@nestjs/common';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import NodeCache from 'node-cache';
import { CrudService } from './services/crud-pg.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule,
    ],
    controllers: [CrudController,],
    providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        NodeCache,
        CrudService,
    ],
    exports: [
        CrudService,
    ]
})
export class CrudModule { }
