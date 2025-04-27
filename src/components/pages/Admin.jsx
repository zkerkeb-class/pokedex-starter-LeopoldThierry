import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("french");
  const navigate = useNavigate();

  // Nombre de pokémons par page
  const pokemonsPerPage = 15;

  // Liste des langues disponibles
  const availableLanguages = [
    { code: "english", name: "English" },
    { code: "french", name: "Français" },
    { code: "japanese", name: "日本語" },
    { code: "chinese", name: "中文" }
  ];

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // Vérifier d'abord dans le localStorage
        if (!userData || !userData.isAdmin) {
          navigate('/');
          return;
        }

        // Vérifier ensuite avec l'API
        const response = await axios.get('http://localhost:3000/api/game/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        
      } catch (error) {
        console.error('Erreur lors de la vérification des droits admin:', error);
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/pokemons');
        
        if (response.data.success) {
          setPokemons(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des Pokémon:', error);
        setError('Erreur lors de la récupération des Pokémon');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const filteredPokemons = pokemons.filter(pokemon => {
    if (!pokemon) return false;
    
    const pokemonName = pokemon.name?.[selectedLanguage] || 
                       pokemon.name?.english || 
                       `Pokemon #${pokemon.id}`;

    const matchesSearch = searchTerm === '' || 
                         pokemonName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === '' || 
                       (pokemon.type && pokemon.type.includes(selectedType));
    
    return matchesSearch && matchesType;
  });

  // Récupérer tous les types uniques
  const allTypes = pokemons.length > 0 
    ? [...new Set(pokemons.flatMap(pokemon => pokemon.type || []))].sort()
    : [];

  const handlePokemonClick = (pokemon) => {
    navigate(`/admin/pokemon/${pokemon.id}`);
  };

  const handleAddPokemon = () => {
    navigate('/admin/pokemon/new');
  };

  const handleDeletePokemon = async (pokemonId) => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('userData'));

      // Vérifier si l'utilisateur est admin
      if (!userData || !userData.isAdmin) {
        setError('Vous n\'avez pas les droits pour supprimer un Pokémon');
        return;
      }

      const response = await axios.delete(`http://localhost:3000/api/pokemons/${pokemonId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        // Mettre à jour la liste des Pokémon
        setPokemons(pokemons.filter(p => p.id !== pokemonId));
        setError(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError(error.response?.data?.message || 'Erreur lors de la suppression du Pokémon');
    }
  };

  const handleEditPokemon = (pokemonId) => {
    navigate(`/admin/pokemon/${pokemonId}/edit`);
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

  return (
    <div className="admin-container">
      <div className="header-container">
        <button 
          className="logout-button"
          onClick={() => navigate('/login')}
        >
          Deconnexion
        </button>
        <h1>Administration Pokédex</h1>
      </div>
      
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

      <button 
        className="add-pokemon-button"
        onClick={handleAddPokemon}
      >
        Ajouter un Pokémon
      </button>

      <div className="pokemon-grid">
        {currentPokemons.map((pokemon) => {
          if (!pokemon) return null;
          
          const pokemonName = pokemon.name?.[selectedLanguage] || 
                            pokemon.name?.english || 
                            `Pokemon #${pokemon.id}`;

          return (
            <div
              key={pokemon.id}
              className="pokemon-preview"
              onClick={() => handlePokemonClick(pokemon)}
            >
              <img
                src={`/src/assets/pokemons/${pokemon.id}.png`}
                alt={pokemonName}
                className="pokemon-image"
                onError={(e) => {
                  e.target.src = '/src/assets/img autre/inte.png';
                }}
              />
              <h3>{pokemonName}</h3>
              <div className="admin-actions">
                <button 
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPokemon(pokemon.id);
                  }}
                >
                  Modifier
                </button>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce Pokémon ?')) {
                      handleDeletePokemon(pokemon.id);
                    }
                  }}
                >
                  Supprimer
                </button>
              </div>
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

export default Admin; 