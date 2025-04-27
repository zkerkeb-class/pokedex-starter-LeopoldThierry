import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './components/pages/accueil';
import Home from './components/pages/home';
import PokemonDetail from './components/pages/pokemonDetail';
import Battle from './components/pages/battle';
import AddPoke from './components/pages/ajouterPokemon';
import Shop from './components/pages/Shop';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Tutorial from './components/pages/Tutorial';
import StarterSelection from './components/pages/StarterSelection';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './components/pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/admin" element={<Admin />} />
        
        {/* Routes protégées */}
        <Route path="/" element={
          <ProtectedRoute>
            <Accueil />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/pokemon/:id" element={
          <ProtectedRoute>
            <PokemonDetail />
          </ProtectedRoute>
        } />
        <Route path="/battle" element={
          <ProtectedRoute>
            <Battle />
          </ProtectedRoute>
        } />
        <Route path="/shop" element={
          <ProtectedRoute>
            <Shop />
          </ProtectedRoute>
        } />
        <Route path="/add" element={
          <ProtectedRoute>
            <AddPoke />
          </ProtectedRoute>
        } />
        <Route path="/starter-selection" element={
          <ProtectedRoute>
            <StarterSelection />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;