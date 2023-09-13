import zones from "../constants/zones.json";
import pokemons from "../constants/pokemons.json";

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
