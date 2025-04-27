import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../pages';
import './home.css';

// Couleurs des types de pokémons
const typeColors = {
  Normal: "#A8A878",
  Fire: "#F08030",
  Water: "#6890F0",
  Grass: "#78C850",
  Electric: "#F8D030",
  Ice: "#98D8D8",
  Fighting: "#C03028",
  Poison: "#A040A0",
  Ground: "#E0C068",
  Flying: "#A890F0",
  Psychic: "#F85888",
  Bug: "#A8B820",
  Rock: "#B8A038",
  Ghost: "#705898",
  Dragon: "#7038F8",
  Dark: "#705848",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC"
};

// Liste des langues disponibles
const availableLanguages = [
  { code: "english", name: "English" },
  { code: "french", name: "Français" },
  { code: "japanese", name: "日本語" },
  { code: "chinese", name: "中文" }
];

function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [unlockedPokemons, setUnlockedPokemons] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("french");
  const navigate = useNavigate();

  // Nombre de pokémons par page
  const pokemonsPerPage = 15;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/game/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.data);
          setUnlockedPokemons(response.data.data.unlockedPokemons || []);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        setError('Erreur lors de la récupération des données utilisateur');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/pokemons');
        
        if (response.data.success) {
          console.log('Données reçues de l\'API:', response.data.data[0]);
          const filteredPokemons = response.data.data.map(pokemon => ({
            ...pokemon,
            isUnlocked: unlockedPokemons.includes(pokemon.id)
          }));
          console.log('Pokémon filtré:', filteredPokemons[0]);
          setPokemons(filteredPokemons);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
        setError('Erreur lors de la récupération des Pokémon');
      } finally {
        setLoading(false);
      }
    };

    if (unlockedPokemons.length > 0) {
      fetchPokemons();
    }
  }, [unlockedPokemons]);

  const filteredPokemons = pokemons.filter(pokemon => {
    if (!pokemon) return false;
    
    // Si aucun filtre n'est actif, on affiche tous les Pokémon
    if (searchTerm === '' && selectedType === '') return true;
    
    // Si le Pokémon n'est pas débloqué, on ne l'affiche pas lors du filtrage
    if (!pokemon.isUnlocked) return false;
    
    const pokemonName = pokemon.name?.[selectedLanguage] || 
                       pokemon.name?.english || 
                       `Pokemon #${pokemon.id}`;

    const matchesSearch = searchTerm === '' || 
                         pokemonName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === '' || 
                       (pokemon.type && pokemon.type.includes(selectedType));
    
    return matchesSearch && matchesType;
  });

  // Récupérer tous les types uniques (uniquement des Pokémon débloqués)
  const allTypes = pokemons.length > 0 
    ? [...new Set(pokemons.filter(p => p.isUnlocked).flatMap(pokemon => pokemon.type || []))].sort()
    : [];

  const handlePokemonClick = (pokemon) => {
    if (pokemon.isUnlocked) {
      navigate(`/pokemon/${pokemon.id}`);
    }
  };

  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);
  const startIndex = (currentPage - 1) * pokemonsPerPage;
  const endIndex = startIndex + pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(startIndex, endIndex);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (pokemons.length === 0) {
    return <div className="no-pokemon">Aucun Pokémon disponible</div>;
  }

  return (
    <div className="home-container">
      <HomeButton />
      <h1>Pokédex</h1>
      
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un Pokémon..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
          
          <select 
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="type-select"
          >
            <option value="">Tous les types</option>
            {allTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="type-select"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pokemon-grid">
        {currentPokemons.map((pokemon) => {
          if (!pokemon) return null;
          
          const pokemonName = pokemon.name?.[selectedLanguage] || 
                            pokemon.name?.english || 
                            `Pokemon #${pokemon.id}`;

          // Déterminer la couleur de fond en fonction du type principal (uniquement pour les Pokémon débloqués)
          let bgColor = '#A8A878'; // Couleur par défaut (gris)
          
          if (pokemon.isUnlocked && pokemon.type && pokemon.type.length > 0) {
            const primaryType = pokemon.type[0].charAt(0).toUpperCase() + pokemon.type[0].slice(1).toLowerCase();
            bgColor = typeColors[primaryType] || '#A8A878';
          }

          return (
            <div
              key={pokemon.id}
              className={`pokemon-preview ${pokemon.isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handlePokemonClick(pokemon)}
              style={{ backgroundColor: bgColor }}
            >
              <img
                src={pokemon.isUnlocked ? `/src/assets/pokemons/${pokemon.id}.png` : '/src/assets/img autre/inte.png'}
                alt={pokemon.isUnlocked ? pokemonName : `Pokemon #${pokemon.id}`}
                className="pokemon-image"
                onError={(e) => {
                  console.error('Erreur de chargement d\'image pour:', pokemon.id);
                  e.target.src = '/src/assets/img autre/inte.png';
                }}
              />
              <h3>{pokemon.isUnlocked ? pokemonName : `Pokemon #${pokemon.id}`}</h3>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
