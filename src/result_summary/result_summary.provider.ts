import { ResultSummary } from './result_summary.entity';

export const resultSummaryProviders = [
  {
    provide: 'ResultSummaryProvider',
    useValue: ResultSummary,
  },
];
