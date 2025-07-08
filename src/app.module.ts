import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';
import { AchieversModule } from './achievers/achievers.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { GalleryModule } from './gallery/gallery.module';
import { SuccessStoriesModule } from './success_stories/success_stories.module';
import { BlogModule } from './blog/blog.module';
import { BlogCategoriesModule } from './blog_categories/blog_categories.module';
import { ResultModule } from './result/result.module';
import { ProgramModule } from './program/program.module';
import { ContactsModule } from './contacts/contacts.module';
import { ResultSummaryModule } from './result_summary/result_summary.module';
import { SharedAuthModule } from './shared/shared-auth.module';
import { AuthModule } from './auth/auth.module';
import { NestJwtModule } from './auth/strategy/jwt_access.strategy';

@Module({
  imports: [
    DatabaseModule,
    ConfigurationModule,
    SharedAuthModule,
    NestJwtModule,
    CacheModule.register({ isGlobal: true }),

    AuthModule,
    UserModule,

    ProgramModule,
    ResultModule,
    ResultSummaryModule,
    SuccessStoriesModule,
    TeamModule,
    GalleryModule,
    ContactsModule,
    BlogModule,
    BlogCategoriesModule,
    AchieversModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
