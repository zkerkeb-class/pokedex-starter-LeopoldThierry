import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PokemonDetail.css';

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

// Mapping des types vers les numéros d'images
const typeToImageNumber = {
  'normal': '1',
  'fighting': '2',
  'flying': '3',
  'poison': '4',
  'ground': '5',
  'rock': '6',
  'bug': '7',
  'ghost': '8',
  'steel': '9',
  'fire': '10',
  'water': '11',
  'grass': '12',
  'electric': '13',
  'psychic': '14',
  'ice': '15',
  'dragon': '16',
  'dark': '17',
  'fairy': '18'
};

function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isShiny = searchParams.get('shiny') === 'true';
  
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("french");
  
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching pokemon details for ID: ${id}`);
        const response = await axios.get(`http://localhost:3000/api/pokemons/${id}`);
        console.log('API Response:', response.data);
        
        // Le format est différent de ce qu'on attendait, mais les données sont là
        if (response.data) {
          setPokemon(response.data);
        } else {
          setError('Pokémon non trouvé');
          console.error('Format de réponse incorrect:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur API:', error);
        setError(`Impossible de charger les détails du pokémon - ${error.message}`);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleToggleShiny = () => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('shiny', (!isShiny).toString());
    navigate(`/pokemon/${id}?${newParams.toString()}`);
  };
  
  if (loading) {
    return (
      <div className="pokemon-detail-container">
        <div className="loading-container">
          <div className="loading-pokeball"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="pokemon-detail-container">
        <div className="error-container">
          <p>{error || 'Pokémon non trouvé'}</p>
          <button onClick={handleBackClick} className="back-button">
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Debugging des données reçues
  console.log('Pokemon data structure:', pokemon);

  // Gestion sécurisée des données du pokémon
  const getPokemonName = () => {
    if (pokemon.name) {
      if (typeof pokemon.name === 'object') {
        return pokemon.name[language] || pokemon.name.english || `Pokémon #${pokemon.id}`;
      } else {
        return pokemon.name;
      }
    }
    return `Pokémon #${pokemon.id}`;
  };

  const pokemonName = getPokemonName();
  const pokemonTypes = Array.isArray(pokemon.type) ? pokemon.type : 
                      (pokemon.types ? pokemon.types : ['Normal']);
  
  const primaryType = pokemonTypes[0];
  const secondaryType = pokemonTypes[1] || primaryType;

  const bgStyle = {
    background: `linear-gradient(135deg, ${typeColors[primaryType] || '#A8A878'}80 0%, ${typeColors[secondaryType] || '#A8A878'}80 100%)`
  };

  return (
    <div className="pokemon-detail-container" style={bgStyle}>
      <div className="pokemon-detail-card">
        <button onClick={handleBackClick} className="back-button">
          &larr; Retour
        </button>
        
        <div className="pokemon-header">
          <div className="pokemon-id-name">
            <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
            <h1 className="pokemon-name">{pokemonName}</h1>
          </div>
          
          <div className="pokemon-types-detail">
            {pokemonTypes.map((type, index) => (
              <img 
                key={type}
                src={`/src/assets/types/${typeToImageNumber[type.toLowerCase()]}.png`}
                alt={type}
                
                onError={(e) => {
                  e.target.src = '/src/assets/img autre/inte.png';
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="pokemon-content">
          <div className="pokemon-image-container">
            <img 
              src={`/src/assets/pokemons/${isShiny ? 'shiny/' : ''}${pokemon.id}.png`}
              alt={pokemonName}
              className="pokemon-image"
              onError={(e) => {
                console.log('Erreur de chargement d\'image pour:', pokemon.id);
                e.target.src = '/src/assets/pokemons/1.png';
              }}
            />
            <button 
              onClick={handleToggleShiny} 
              className="shiny-toggle-button"
            >
              {isShiny ? 'Version normale' : 'Version Shiny'}
            </button>
          </div>
          
          <div className="pokemon-info">
            <div className="info-section">
              <h2>Informations</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Taille</span>
                  <span className="info-value">{pokemon.height || pokemon.base?.height || '?'} m</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Poids</span>
                  <span className="info-value">{pokemon.weight || pokemon.base?.weight || '?'} kg</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Catégorie</span>
                  <span className="info-value">{pokemon.category || pokemon.base?.category || 'Inconnu'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Talents</span>
                  <span className="info-value">
                    {(pokemon.abilities && pokemon.abilities.join(', ')) || 
                     (pokemon.base?.abilities && pokemon.base.abilities.join(', ')) || 
                     'Inconnu'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="info-section">
              <h2>Statistiques</h2>
              <div className="stats-container-detail">
                {pokemon.base && Object.entries(pokemon.base)
                  .filter(([statName]) => ['HP', 'Attack', 'Defense', 'Sp. Attack', 'Sp. Defense', 'Speed'].includes(statName))
                  .map(([statName, value]) => {
                    // Traduction des noms des stats
                    const statTranslations = {
                      'HP': 'PV',
                      'Attack': 'Attaque',
                      'Defense': 'Défense',
                      'Sp. Attack': 'Attaque Spé.',
                      'Sp. Defense': 'Défense Spé.',
                      'Speed': 'Vitesse'
                    };
                    
                    return (
                      <div key={statName} className="stat-item-setail">
                        <span className="stat-label-detail">{statTranslations[statName] || statName}</span>
                        <div className="stat-bar-container">
                          <div 
                            className="stat-bar" 
                            style={{ 
                              width: `${Math.min(100, (value / 180) * 100)}%`,
                              backgroundColor: typeColors[primaryType]
                            }}
                          ></div>
                        </div>
                        <span className="stat-value-detail">{value}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
            
            <div className="info-section">
              <h2>Description</h2>
              <p className="pokemon-description">
                {pokemon.description || pokemon.base?.description || "Aucune description disponible pour ce Pokémon."}
              </p>
            </div>
            
            {(pokemon.evolutions?.length > 0 || pokemon.base?.evolutions?.length > 0) && (
              <div className="info-section">
                <h2>Évolutions</h2>
                <div className="evolutions-container">
                  {(pokemon.evolutions?.length > 0 || pokemon.base?.evolutions?.length > 0) ? (
                    (pokemon.evolutions || pokemon.base?.evolutions || []).map((evo, index, array) => (
                      <div key={evo.id || index} className="evolution-item">
                        <img 
                          src={`/src/assets/pokemons/${isShiny ? 'shiny/' : ''}${evo.id || evo}.png`}
                          alt={typeof evo === 'object' ? (evo.name || `Évolution ${index + 1}`) : `Évolution vers #${evo}`}
                          onClick={() => navigate(`/pokemon/${evo.id || evo}?shiny=${isShiny}`)}
                        />
                        <span>
                          {typeof evo === 'object' ? (evo.name || `#${evo.id}`) : `#${evo}`}
                        </span>
                        {index < array.length - 1 && (
                          <span className="evolution-arrow">→</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Ce Pokémon n'a pas d'évolutions connues.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;