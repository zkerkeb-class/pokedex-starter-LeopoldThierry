import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Tutorial.css';

const Tutorial = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/starter-selection');
  };

  return (
    <div className="tutorial">
      <div className="tutorial-content">
        <h1>Bienvenue dans le Monde Pokémon !</h1>
        
        <div className="tutorial-section">
          <h2>Votre Pokédex</h2>
          <p>
            Votre Pokédex est votre guide pour découvrir tous les Pokémon du monde.
            Au début, vous ne verrez que votre Pokémon de départ. Les autres Pokémon
            seront masqués et apparaîtront comme Pokemon#x est un "?".
          </p>
          <div className="tutorial-image">
            <img src="/src/assets/pokemons/4.png" alt="Pokédex" />
          </div>
        </div>

        <div className="tutorial-section">
          <h2>Le Système de Combat</h2>
          <p>
            Affrontez d'autres dresseurs pour gagner de l'expérience et débloquer
            de nouveaux Pokémon. Chaque victoire vous rapporte des points d'expérience
            qui vous permettront de progresser dans votre aventure.
          </p>
          <div className="tutorial-image">
            <img src="/src/assets/img autre/vs.png" alt="Combat" />
          </div>
        </div>

        <div className="tutorial-section">
          <h2>Débloquer les Pokémon</h2>
          <p>
            Plus vous gagnez d'expérience et de gold, plus vous débloquerez de Pokémon dans
            votre Pokédex. Chaque Pokémon a ses propres caractéristiques et types
            qui influencent les combats.
          </p>
          <div className="tutorial-image">
            <img src="/src/assets/img autre/inte.png" alt="Déblocage" />
          </div>
        </div>

        <div className="tutorial-section">
          <h2>Les Boosters</h2>
          <p>
            Utilisez des boosters pour augmenter vos chances de débloquer de nouveaux
            Pokémon. Les boosters peuvent être achetés dans la boutique, en même temps 
            que des potions.
          </p>
          <div className="tutorial-image">
            <img src="/src/assets/img autre/booster.png" alt="Boosters" />
          </div>
        </div>

        <button className="start-button" onClick={handleStart}>
          Commencer l'Aventure
        </button>
      </div>
    </div>
  );
};

export default Tutorial; 