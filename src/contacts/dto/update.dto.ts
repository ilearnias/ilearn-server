import { PartialType } from '@nestjs/swagger';
import { CreateContactsDto } from './create.dto';

export class UpdateContactsDto extends PartialType(CreateContactsDto) {}
