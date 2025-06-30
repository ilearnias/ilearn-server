import { Module } from '@nestjs/common';
import { ResultSummaryService } from './result_summary.service';
import { ResultSummaryController } from './result_summary.controller';
import { resultSummaryProviders } from './result_summary.provider';

@Module({
  imports: [],
  controllers: [ResultSummaryController],
  providers: [ResultSummaryService, ...resultSummaryProviders],
  exports: [ResultSummaryService],
})
export class ResultSummaryModule {}
