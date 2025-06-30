import { PartialType } from '@nestjs/swagger';
import { CreateJourneyDto } from './create.dto';

export class UpdateJourneyDto extends PartialType(CreateJourneyDto) {}
