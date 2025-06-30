import { PartialType } from '@nestjs/swagger';
import { CreateAchieversDto } from './create.dto';

export class UpdateAchieversDto extends PartialType(CreateAchieversDto) {}
