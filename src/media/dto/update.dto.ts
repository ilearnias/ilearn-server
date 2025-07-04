import { PartialType } from '@nestjs/swagger';
import { CreateMediaDto } from './create.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
