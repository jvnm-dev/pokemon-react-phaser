import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import type { Direction } from "grid-engine";

import type { Maps } from "../constants/assets";
import pokemons from '../constants/pokemons.json';

export interface IPosition {
  map: Maps;
  x?: number;
  y?: number;
  facingDirection: Direction;
}

export interface IInventoryObject {
  objectId: number;
}

export interface IPokemon {
  id: number;
  uniqId: number;
  hp: number;
  ability: string;
}

export interface ISettings {
  general: {
    enableSound: boolean;
  };
}

export interface IUserDataStore {
  onBicycle: boolean;
  position?: IPosition;
  inventory: IInventoryObject[];
  pokemons: IPokemon[];
  settings: ISettings;
  scenariosCompleted: number[];

  update: (state: Partial<IUserDataStore>) => void;
  addObjectToInventory: (objectId: number) => void;
  addPokemon: (id: number) => void;
  hasCompletedScenario: (scenarioId: number) => boolean;
  completeScenario: (scenarioId: number) => void;
}

export const useUserDataStore = create<IUserDataStore>()(
  devtools(
    persist(
      (set, get) => ({
        update: (updates: Partial<IUserDataStore>) => {
          set((state) => ({
            ...state,
            ...updates,
          }));
        },

        onBicycle: Boolean(false),
        inventory: [],
        pokemons: [],
        settings: {
          general: {
            enableSound: Boolean(true),
          },
        },
        scenariosCompleted: [],

        addPokemon: (id: number) => {
          const uniqId = Date.now();
          const pokemon = pokemons.find(pokemon => pokemon.id === id); 
          const ability = pokemon.abilities[Math.floor(Math.random() * pokemon.abilities.length)];

          set((state) => ({
            ...state,
            pokemons: [
              ...state.pokemons,
              {
                id,
                uniqId,
                hp: pokemon.stats.hp,
                ability,
              },
            ],
          }));
        },

        addObjectToInventory: (objectId: number) => {
          set((state) => ({
            ...state,
            inventory: [
              ...state.inventory,
              {
                objectId,
              },
            ],
          }));
        },

        hasCompletedScenario: (scenarioId: number) => {
          return get().scenariosCompleted.includes(scenarioId);
        },

        completeScenario: (scenarioId: number) => {
          set((state) => ({
            ...state,
            scenariosCompleted: [...state.scenariosCompleted, scenarioId],
          }));
        },
      }),
      {
        name: "userData",
      },
    ),
  ),
);
