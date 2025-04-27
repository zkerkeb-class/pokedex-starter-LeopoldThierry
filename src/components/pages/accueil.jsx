import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Accueil.css';


function Accueil() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion
    navigate('/login');
  };
  return (
    <div className="accueil-container">
      <div className="header-container-logout">
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
        <h1>Bienvenue dans le Monde Pokémon !!</h1>
      </div>
      
      <div className="menu-container">
        <div className="menu-item" onClick={() => navigate('/home')}>
          <div className="menu-icon">
            <img src="/src/assets/img autre/inte.png" alt="Pokédex" />
          </div>
          <h2>Pokédex</h2>
          <p>Consultez votre collection de Pokémon</p>
        </div>

        <div className="menu-item" onClick={() => navigate('/battle')}>
          <div className="menu-icon">
            <img src="/src/assets/img autre/vs.png" alt="Combat" />
          </div>
          <h2>Combat</h2>
          <p>Affrontez d'autres dresseurs</p>
        </div>

        <div className="menu-item" onClick={() => navigate('/shop')}>
          <div className="menu-icon">
            <img src="/src/assets/img autre/booster.png" alt="Boutique" />
          </div>
          <h2>Boutique</h2>
          <p>Achetez des boosters et des objets</p>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
