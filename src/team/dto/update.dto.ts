import { PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create.dto';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}
