import { useState, useEffect } from 'react';
import { Pokemon } from '../types/Pokemon';
import { pokemonService } from '../services/pokemonService';
import './Pokedex.css';

export const Pokedex = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [searchResults, setSearchResults] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchPokemon = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        setLoading(true);
        const results = await pokemonService.searchPokemon(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError('Failed to search Pokemon');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPokemon, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handlePokemonSelect = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pokemonService.getPokemon(name);
      setPokemon(data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Failed to fetch Pokemon data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokedex">
      <h1>Pokédex</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a Pokémon..."
          className="search-input"
        />
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((result) => (
              <li
                key={result.name}
                onClick={() => handlePokemonSelect(result.name)}
                className="search-result-item"
              >
                {result.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {pokemon && (
        <div className="pokemon-card">
          <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            className="pokemon-image"
          />
          <div className="pokemon-info">
            <div className="types">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className={`type ${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
            <div className="stats">
              <h3>Stats</h3>
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat">
                  <span className="stat-name">{stat.stat.name}:</span>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              ))}
            </div>
            <div className="details">
              <p>Height: {pokemon.height / 10}m</p>
              <p>Weight: {pokemon.weight / 10}kg</p>
              <div className="abilities">
                <h3>Abilities</h3>
                <ul>
                  {pokemon.abilities.map((ability) => (
                    <li key={ability.ability.name}>{ability.ability.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 