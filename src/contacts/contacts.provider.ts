import { Contacts } from './contacts.entity';

export const contactsProviders = [
  {
    provide: 'ContactsProvider',
    useValue: Contacts,
  },
];
