import { Gallery } from './gallery.entity';

export const galleryProviders = [
  {
    provide: 'GalleryProvider',
    useValue: Gallery,
  },
];
