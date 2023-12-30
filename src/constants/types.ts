export type ObjectProperties = {
  name?: string;
  x?: number;
  y?: number;
};

export enum PokemonGender {
  MALE = '♂',
  FEMALE = '♀',
}

export interface IPokemon {
  id: number;
  uniqId: number;
  hp: number;
  ability: string;
  gender: PokemonGender;
}