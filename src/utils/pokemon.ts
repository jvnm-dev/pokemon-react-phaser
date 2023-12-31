import { pokemons } from "../constants/pokemons";
import { IPokemon, PokemonGender } from "../constants/types";
import { getRandomNumber } from "./number";

export const getRandomPokemon = () => {
  return pokemons[Math.floor(Math.random() * pokemons.length)];
};

export const generatePokemon = (pokemonId: number): IPokemon => {
  const pokemon = pokemons.find(({ id }) => id === pokemonId);

  if (!pokemon) {
    throw new Error(`Pokemon ${pokemonId} not found`);
  }

  const ability =
    pokemon.abilities[Math.floor(Math.random() * pokemon.abilities.length)];
  const gender =
    Object.values(PokemonGender)[
      Math.floor(Math.random() * Object.values(PokemonGender).length)
    ];

  return {
    ...pokemon,
    uniqId: Date.now(),
    hp: pokemon.stats.hp,
    ability,
    gender,
    isShiny: getRandomNumber(0, 512) === 0,
  };
};
