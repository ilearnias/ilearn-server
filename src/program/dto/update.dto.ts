import { PartialType } from '@nestjs/swagger';
import { CreateProgramDto } from './create.dto';

export class UpdateProgramDto extends PartialType(CreateProgramDto) {}
