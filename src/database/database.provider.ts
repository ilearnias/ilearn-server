import { Sequelize } from 'sequelize-typescript';
import { ConfigurationService } from '../config/config.service';
import { Achievers } from '../achievers/achievers.entity';
import { Team } from '../team/team.entity';
import { User } from '../user/user.entity';
import { Program } from '../program/program.entity';
import { Blog } from '../blog/blog.entity';
import { BlogCategories } from '../blog_categories/blog_categories.entity';
import { Contacts } from '../contacts/contacts.entity';
import { Gallery } from '../gallery/gallery.entity';
// import { GalleryTitle } from '../gallery_title/gallery_title.entity';
import { Journey } from '../journey/journey.entity';
import { Media } from '../media/media.entity';
import { SuccessStories } from '../success_stories/success_stories.entity';
import { Result } from '../result/result.entity';
import { ResultSummary } from '../result_summary/result_summary.entity';
import { GalleryTitle } from '../gallery_title/gallery_title/gallery_title.entity';

export const databaseProvider = {
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigurationService) => {
    const sequelize = new Sequelize(configService.sequelizeOrmConfig);
    sequelize.addModels([
      User,
      Achievers,
      Team,
      User,
      Program,
      Blog,
      BlogCategories,
      Contacts,
      Gallery,
      GalleryTitle,
      Journey,
      Media,
      Result,
      ResultSummary,
      SuccessStories,
    ]);
    await sequelize.sync();
    return sequelize;
  },
  inject: [ConfigurationService],
};
