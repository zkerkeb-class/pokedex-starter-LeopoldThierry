import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        const userData = {
          _id: response.data.data._id,
          username: response.data.data.username,
          email: response.data.data.email,
          role: response.data.data.role,
          starterPokemon: response.data.data.starterPokemon,
          tutorialCompleted: response.data.data.tutorialCompleted,
          isAdmin: response.data.data.isAdmin
        };
        
        console.log('Données utilisateur formatées:', userData);
        console.log('Starter Pokemon:', userData.starterPokemon);
        console.log('isAdmin value:', userData.isAdmin);
        console.log('isAdmin type:', typeof userData.isAdmin);
        
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('userData', JSON.stringify(userData));

        // Vérifier si l'utilisateur est admin
        if (userData.isAdmin === true || userData.isAdmin === 'true' || userData.role === 'admin') {
          console.log('Redirection vers la page admin');
          navigate('/admin');
        }
        // Sinon, continuer avec la logique existante
        else if (userData.starterPokemon) {
          navigate('/');
        } else {
          console.log('Redirection vers la page sélection de starter');
          navigate('/starter-selection');
        }
      } else {
        setError(response.data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion au serveur');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Connexion</h1>
          <div className="pokeball-icon"></div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Pas encore de compte ?</p>
          <Link to="/register" className="auth-link">S'inscrire</Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 