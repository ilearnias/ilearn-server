import { PartialType } from '@nestjs/swagger';
import { CreateResultSummaryDto } from './create.dto';

export class UpdateResultSummaryDto extends PartialType(
  CreateResultSummaryDto,
) {}
