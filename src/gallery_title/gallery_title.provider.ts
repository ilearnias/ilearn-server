import { GalleryTitle } from './gallery_title.entity';

export const galleryTitleProviders = [
  {
    provide: 'GalleryTitleProvider',
    useValue: GalleryTitle,
  },
];
