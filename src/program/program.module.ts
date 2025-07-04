import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { programProviders } from './program.provider';

@Module({
  imports: [],
  controllers: [ProgramController],
  providers: [ProgramService, ...programProviders],
  exports: [ProgramService],
})
export class ProgramModule {}
