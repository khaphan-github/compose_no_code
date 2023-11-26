import { CommandHandlers } from './commands';
import { GeneratorController } from './controllers/generator.controller';
import { Module } from '@nestjs/common';
import { QueryHandlers, SQLToAPIQueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';
import { JsonIoService } from '../shared/json.io.service';
import NodeCache from 'node-cache';
import { GeneratorService } from './services/generator.service';
import { GenerateAPISagas } from './sagas/generate-api.saga';
import { ExecutedSQLScriptEventHandler } from './events/execute-sql-create-db.event';
import { HttpModule } from '@nestjs/axios';
import { SQLTransformerProxy } from './proxy/sql.transformer.proxy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLToAPIService } from './services/sql-to-api.service';
import { FileReaderService } from '../shared/file-reader.service';
import { CrudModule } from '../crud-pg/crud.module';
import { ExecutedSQLQueryEventHandler } from '../crud-pg/handlers/executed-query.handler';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        CqrsModule,
        HttpModule,
        ConfigModule,
        TypeOrmModule.forFeature(),
        CrudModule,
    ],
    controllers: [
        GeneratorController,
    ],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,
        ...SQLToAPIQueryHandlers,

        ExecutedSQLQueryEventHandler,
        JsonIoService,
        FileReaderService,

        NodeCache,
        GeneratorService,

        GenerateAPISagas,
        ExecutedSQLScriptEventHandler,
        SQLTransformerProxy,
        SQLToAPIService,
    ],

})
export class GeneratorModule { }
