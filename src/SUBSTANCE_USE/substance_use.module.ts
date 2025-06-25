import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../DATABASE/database.module';
import { SocialWorkSubstanceUseController } from './substance_use.controller';
import { SocialWorkSubstanceUseService } from './substance_use.service';
import { SocialWorkSubstanceUseProviders } from './substance_use.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SocialWorkSubstanceUseController],
  providers: [
    SocialWorkSubstanceUseService,
    ...SocialWorkSubstanceUseProviders
  ],
  exports: [SocialWorkSubstanceUseService]
})
export class SocialWorkSubstanceUseModule {}