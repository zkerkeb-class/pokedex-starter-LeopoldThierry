import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AjouterPokemon() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPokemon = { name, type, image };
      await axios.post('http://localhost:3000/api/pokemons', newPokemon);
      alert('Pokémon ajouté avec succès!');
      navigate('/'); // Redirige vers la page d'accueil après l'ajout
    } catch (error) {
      console.error('Erreur lors de l\'ajout du Pokémon:', error);
      alert('Erreur lors de l\'ajout du Pokémon');
    }
  };

  return (
    <div className="add-pokemon-container">
      <h2>Ajouter un Pokémon</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AjouterPokemon;