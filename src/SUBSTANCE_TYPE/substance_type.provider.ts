import { SubstanceType } from "./substance_type.entity";

export const substanceTypeProviders = [
  {
    provide: 'SubstanceTypeProvider',
    useValue: SubstanceType,
  },
];