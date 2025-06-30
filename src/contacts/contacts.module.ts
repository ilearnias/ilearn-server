import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { contactsProviders } from './contacts.provider';
import { ContactsController } from './contacts.controller';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, ...contactsProviders],
  exports: [ContactsService],
})
export class ContactsModule {}
