import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StarterSelection.css';

const starters = [
  {
    id: 1,
    name: 'Bulbizarre',
    image: '/src/assets/pokemons/1.png',
    type: 'Plante',
    description: 'Un Pokémon de type Plante qui utilise la photosynthèse pour se nourrir.'
  },
  {
    id: 4,
    name: 'Salamèche',
    image: '/src/assets/pokemons/4.png',
    type: 'Feu',
    description: 'Un Pokémon de type Feu qui préfère les endroits chauds.'
  },
  {
    id: 7,
    name: 'Carapuce',
    image: '/src/assets/pokemons/7.png',
    type: 'Eau',
    description: 'Un Pokémon de type Eau qui se cache dans sa carapace.'
  }
];

function StarterSelection() {
  const [selectedStarter, setSelectedStarter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStarterSelection = async (starter) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vous devez être connecté pour sélectionner un starter');
      }

      // Envoyer le choix du starter au backend
      console.log('Envoi de la requête à:', 'http://localhost:3000/api/game/choose-starter');
      console.log('Données envoyées:', { pokemonId: starter.id });
      console.log('Token:', token);

      const response = await axios.post('http://localhost:3000/api/game/choose-starter', {
        pokemonId: starter.id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Réponse du serveur:', response.data);

      // Stocker les informations de l'utilisateur mises à jour
      const userData = response.data.data;
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        starterPokemon: starter.id,
        unlockedPokemons: userData.unlockedPokemons
      }));

      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la sélection du starter:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la sélection de votre starter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="starter-selection">
      <div className="starter-content">
        <h1>Choisissez votre Pokémon de départ</h1>
        <p className="selection-description">
          Votre choix est important ! Ce Pokémon sera votre premier compagnon dans cette aventure.
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="starters-grid">
          {starters.map((starter) => (
            <div 
              key={starter.id}
              className={`starter-card ${selectedStarter?.id === starter.id ? 'selected' : ''}`}
              onClick={() => setSelectedStarter(starter)}
            >
              <img src={starter.image} alt={starter.name} />
              <h3>{starter.name}</h3>
              <span className={`type-badge ${starter.type.toLowerCase()}`}>
                {starter.type}
              </span>
              <p>{starter.description}</p>
            </div>
          ))}
        </div>

        <button 
          className="confirm-button"
          onClick={() => handleStarterSelection(selectedStarter)}
          disabled={!selectedStarter || loading}
        >
          {loading ? 'Sélection en cours...' : 'Confirmer mon choix'}
        </button>
      </div>
    </div>
  );
}

export default StarterSelection; 