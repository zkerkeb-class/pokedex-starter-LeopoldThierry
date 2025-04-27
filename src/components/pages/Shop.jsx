import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Shop.css';
import { useNavigate } from 'react-router-dom';

function Shop() {
  const [stats, setStats] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [newPokemons, setNewPokemons] = useState([]);
  const navigate = useNavigate();

  // Charger les statistiques et l'inventaire au montage du composant
  useEffect(() => {
    fetchStats();
    fetchInventory();
  }, []);

  // Récupérer les statistiques du joueur
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:3000/api/game/stats',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      setError('Erreur lors de la récupération des statistiques');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer l'inventaire du joueur
  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:3000/api/shop/inventory',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setInventory(response.data.data.inventory);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'inventaire:', error);
      // Si l'endpoint n'existe pas, initialiser l'inventaire avec des valeurs par défaut
      setInventory({
        potions: 0,
        superPotions: 0,
        hyperPotions: 0,
        boosters: 0
      });
    }
  };

  // Acheter un objet
  const buyItem = async (itemType, price) => {
    if (!stats || stats.gold < price) {
      setMessage('Vous n\'avez pas assez d\'or !');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/shop/buy',
        {
          itemType,
          price
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStats(prev => ({ ...prev, gold: response.data.data.gold }));
        setInventory(response.data.data.inventory);
        setMessage(`Achat réussi ! Vous avez acheté ${itemType}`);
      }
    } catch (error) {
      setError('Erreur lors de l\'achat');
      console.error(error);
    }
  };

  // Acheter un booster
  const buyBooster = async () => {
    if (!stats || stats.gold < 15) {
      setMessage('Vous n\'avez pas assez d\'or !');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/api/shop/booster',
        {
          price: 15
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStats(prev => ({ ...prev, gold: response.data.data.gold }));
        setInventory(response.data.data.inventory);
        setNewPokemons(response.data.data.newPokemons);
        setMessage('Booster acheté ! Vous avez débloqué de nouveaux Pokémon !');
      }
    } catch (error) {
      setError('Erreur lors de l\'achat du booster');
      console.error(error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-container">
      <div className="header-container">
        <button 
          className="home-button-shop"
          onClick={() => navigate('/')}
        >
          Accueil
        </button>
        <h1>Boutique</h1>
      </div>

      {/* Affichage des statistiques */}
      {stats && (
        <div className="stats-container-shop">
          <div className="stats-grid-shop">
            <div className="stat-item-shop">
              <span className="stat-label-shop">Or: </span>
              <span className="stat-value-shop">{stats.gold}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Niveau: </span>
              <span className="stat-value">{stats.level}</span>
            </div>
          </div>
        </div>
      )}

      {/* Affichage de l'inventaire */}
      {inventory && (
        <div className="inventory-container">
          <h2>Votre Inventaire</h2>
          <div className="inventory-grid">
            <div className="inventory-item">
              <span className="item-label">Potions: </span>
              <span className="item-value">{inventory.potions}</span>
            </div>
            <div className="inventory-item">
              <span className="item-label">Super Potions: </span>
              <span className="item-value">{inventory.superPotions}</span>
            </div>
            <div className="inventory-item">
              <span className="item-label">Hyper Potions: </span>
              <span className="item-value">{inventory.hyperPotions}</span>
            </div>
            <div className="inventory-item">
              <span className="item-label">Boosters: </span>
              <span className="item-value">{inventory.boosters}</span>
            </div>
          </div>
        </div>
      )}

      {/* Message de confirmation/erreur */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* Affichage des nouveaux Pokémon obtenus */}
      {newPokemons.length > 0 && (
        <div className="new-pokemons-container">
          <h2>Nouveaux Pokémon débloqués !</h2>
          <div className="new-pokemons-grid">
            {newPokemons.map((pokemon, index) => (
              <div key={index} className={`new-pokemon-item ${pokemon.isShiny ? 'shiny' : ''}`}>
                <h3>{pokemon.name.french}</h3>
                {pokemon.isShiny && <span className="shiny-badge">Shiny!</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section des potions */}
      <div className="shop-section">
        <h2>Potions</h2>
        <div className="items-grid">
          <div className="shop-item">
            <h3>Potion</h3>
            <p>Restaure 20 PV</p>
            <p className="price">15 or</p>
            <button 
              className="buy-button"
              onClick={() => buyItem('potion', 15)}
              disabled={!stats || stats.gold < 15}
            >
              Acheter
            </button>
          </div>

          <div className="shop-item">
            <h3>Super Potion</h3>
            <p>Restaure 50 PV</p>
            <p className="price">20 or</p>
            <button 
              className="buy-button"
              onClick={() => buyItem('superPotion', 20)}
              disabled={!stats || stats.gold < 20}
            >
              Acheter
            </button>
          </div>

          <div className="shop-item">
            <h3>Hyper Potion</h3>
            <p>Restaure 120 PV</p>
            <p className="price">25 or</p>
            <button 
              className="buy-button"
              onClick={() => buyItem('hyperPotion', 25)}
              disabled={!stats || stats.gold < 25}
            >
              Acheter
            </button>
          </div>
        </div>
      </div>

      {/* Section des boosters */}
      <div className="shop-section">
        <h2>Boosters</h2>
        <div className="items-grid">
          <div className="shop-item booster">
            <h3>Booster Pokémon</h3>
            <p>4 Pokémon aléatoires</p>
            <p className="shiny-rate">Taux de Shiny: 5%</p>
            <p className="price">15 or</p>
            <button 
              className="buy-button"
              onClick={buyBooster}
              disabled={!stats || stats.gold < 15}
            >
              Acheter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop; 