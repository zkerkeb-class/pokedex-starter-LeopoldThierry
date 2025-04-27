import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Pokédex</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Accueil</Link>
        <Link to="/tutorial">Tutoriel</Link>
        <Link to="/battle">Combat</Link>
        <Link to="/add-pokemon">Ajouter Pokémon</Link>
      </div>
    </nav>
  );
}

export default Navbar; 