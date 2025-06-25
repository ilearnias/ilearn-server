import { SocialWorkSubstanceUse } from "./substance_use.entity";

export const SocialWorkSubstanceUseProviders = [
  {
    provide: 'SocialWorkSubstanceUseProvider',
    useValue: SocialWorkSubstanceUse,
  },
];