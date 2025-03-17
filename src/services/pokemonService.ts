import { Pokemon } from '../types/Pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonService = {
  async getPokemon(idOrName: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    if (!response.ok) {
      throw new Error('Pokemon not found');
    }
    return response.json();
  },

  async searchPokemon(query: string): Promise<{ name: string; url: string }[]> {
    const response = await fetch(`${BASE_URL}/pokemon?limit=151`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    const data = await response.json();
    return data.results.filter((pokemon: { name: string }) =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}; 