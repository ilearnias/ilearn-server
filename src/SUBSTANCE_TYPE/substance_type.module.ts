import { Module } from '@nestjs/common';
import { SubstanceTypeService } from './substance_type.service';
import { substanceTypeProviders } from './substance_type.provider';
import { SubstanceTypeController } from './substance_type.controller';

@Module({
  controllers: [SubstanceTypeController],
  providers: [
    SubstanceTypeService,
    ...substanceTypeProviders
  ],
  exports: [SubstanceTypeService]
})
export class SubstanceTypeModule {}