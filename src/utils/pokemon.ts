import zones from "../constants/zones.json";
import pokemons from "../constants/pokemons.json";
import { IPokemon, PokemonGender } from "../constants/types";

export const getRandomPokemonFromZone = (zoneId: number) => {
  const zone = zones.find(({ id }) => id === zoneId);

  if (!zone) {
    throw new Error(`Zone ${zoneId} not found`);
  }

  const zonePokemons = zone.pokemons;
  const highestProbability =
    100 - zonePokemons.reduce((acc, { chance }) => acc + chance, 0);

  const probability = zonePokemons
    .map(({ chance }, pokemonIndex) =>
      Array(chance === 0 ? highestProbability : chance).fill(pokemonIndex),
    )
    .reduce((c, v) => c.concat(v), []);

  const pokemonIndex = Math.floor(
    Math.random() * (probability?.length - 1 - 0 + 1) + 0,
  );
  const pokemonId = zonePokemons[probability[pokemonIndex]]?.id;

  if (highestProbability < 0) {
    throw new Error(`Zone ${zoneId} pokemons rarity sum is higher than 100 !`);
  }

  return pokemons.find(({ id }) => id === pokemonId);
};

export const generatePokemon = (pokemonId: number): IPokemon => {
  const pokemon = pokemons.find(({ id }) => id === pokemonId);

  if (!pokemon) {
    throw new Error(`Pokemon ${pokemonId} not found`);
  }

  const ability = pokemon.abilities[Math.floor(Math.random() * pokemon.abilities.length)];
  const gender = Object.values(PokemonGender)[Math.floor(Math.random() * Object.values(PokemonGender).length)];

  return {
    ...pokemon,
    uniqId: Date.now(),
    hp: pokemon.stats.hp,
    ability,
    gender,
  }
}