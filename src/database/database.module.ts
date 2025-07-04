import { Global, Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';

@Global()
@Module({
  imports: [],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
