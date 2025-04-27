import { useNavigate } from 'react-router-dom';
import '../pokemonCard/cardStyles.css';

function HomeButton() {
  const navigate = useNavigate();

  return (
    <button 
      className="home-button"
      onClick={() => navigate('/')}
    >
      Accueil
    </button>
  );
}

export default HomeButton;
