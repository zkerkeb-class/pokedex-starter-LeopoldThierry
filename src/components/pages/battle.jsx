import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Battle.css';

const typeToImageNumber = {
  'normal': '1',
  'fighting': '2',
  'flying': '3',
  'poison': '4',
  'ground': '5',
  'rock': '6',
  'bug': '7',
  'ghost': '8',
  'steel': '9',
  'fire': '10',
  'water': '11',
  'grass': '12',
  'electric': '13',
  'psychic': '14',
  'ice': '15',
  'dragon': '16',
  'dark': '17',
  'fairy': '18'
};

// Types de Pokémon et leurs relations
const typeRelations = {
  normal: { weak: ['fighting'], strong: [] },
  fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug', 'steel'] },
  water: { weak: ['grass', 'electric'], strong: ['fire', 'ground', 'rock'] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
  electric: { weak: ['ground'], strong: ['water', 'flying'] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'] },
  poison: { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'] },
  ground: { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'] },
  flying: { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
  bug: { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'] },
  ghost: { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'] },
  dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'] },
  steel: { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'] },
  fairy: { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'] }
};

// Niveaux de difficulté et leurs Pokémon
const difficultyLevels = {
  easy: [1, 4, 7, 10, 13, 16, 19, 27, 29, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77, 79, 81, 83, 85, 87, 89, 91, 93, 95, 97, 99], // Bulbizarre, Salamèche, Carapuce
  medium: [5, 8, 12, 15, 18, 26, 31, 34, 59, 57, 55, 61, 64, 67, 71, 73, 75, 82, 95, 99, 112, 123, 134, 135, 136, 139, 148], // Pokémon intermédiaires
  hard: [151, 149, 3, 150, 68, 65, 62, 15, 9, 6, 3, 144, 145, 146, 143, 131, 130, 76 ,94] // Boss
};

function Battle() {
  const [userPokemon, setUserPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [battleState, setBattleState] = useState('selecting'); // 'selecting', 'fighting', 'result'
  const [battleResult, setBattleResult] = useState(null); // 'win', 'lose'
  const [rewards, setRewards] = useState({ xp: 0, gold: 0 });
  const [userData, setUserData] = useState(null);
  const [unlockedPokemons, setUnlockedPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [battlesWon, setBattlesWon] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(null); // 'user' or 'opponent'
  const [userHP, setUserHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [actionCount, setActionCount] = useState({ attack: 0, defense: 0 });
  const [battleLog, setBattleLog] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [unlockedPokemonsDetails, setUnlockedPokemonsDetails] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [showPotionMenu, setShowPotionMenu] = useState(false);
  const [message, setMessage] = useState('');

  // Charger les statistiques au montage du composant
  useEffect(() => {
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
          // Définir la difficulté en fonction du nombre de victoires
          if (response.data.data.battleStats.wins >= 7) {
            setDifficulty('hard');
          } else if (response.data.data.battleStats.wins >= 5) {
            setDifficulty('medium');
          } else {
            setDifficulty('easy');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchStats();
  }, []);

  // Charger les données de l'utilisateur et ses Pokémon débloqués
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/game/progress', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.data);
          setUnlockedPokemons(response.data.data.unlockedPokemons || []);
          
          // Si c'est le premier combat, sélectionner automatiquement le starter
          if (response.data.data.unlockedPokemons.length === 1) {
            setSelectedPokemon(response.data.data.unlockedPokemons[0]);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Charger les détails du Pokémon sélectionné
  useEffect(() => {
    const fetchSelectedPokemon = async () => {
      if (!selectedPokemon) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/pokemons/${selectedPokemon}`);
        if (response.data) {
          setUserPokemon(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du Pokémon sélectionné:', error);
      }
    };

    fetchSelectedPokemon();
  }, [selectedPokemon]);

  // Charger les détails des Pokémon débloqués
  useEffect(() => {
    const fetchUnlockedPokemonsDetails = async () => {
      const details = await Promise.all(
        unlockedPokemons.map(async (pokemonId) => {
          try {
            const response = await axios.get(`http://localhost:3000/api/pokemons/${pokemonId}`);
            return response.data;
          } catch (error) {
            console.error(`Erreur lors de la récupération du Pokémon ${pokemonId}:`, error);
            return null;
          }
        })
      );
      setUnlockedPokemonsDetails(details.filter(pokemon => pokemon !== null));
    };

    if (unlockedPokemons.length > 0) {
      fetchUnlockedPokemonsDetails();
    }
  }, [unlockedPokemons]);

  // Charger l'inventaire au montage du composant
  useEffect(() => {
    fetchInventory();
  }, []);

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
      setInventory({
        potions: 0,
        superPotions: 0,
        hyperPotions: 0,
        boosters: 0
      });
    }
  };

  // Générer un adversaire aléatoire en fonction de la difficulté
  const generateOpponent = () => {
    const possibleOpponents = difficultyLevels[difficulty];
    const randomIndex = Math.floor(Math.random() * possibleOpponents.length);
    return possibleOpponents[randomIndex];
  };

  // Charger l'adversaire
  useEffect(() => {
    const fetchOpponent = async () => {
      if (battleState !== 'fighting') return;
      
      const opponentId = generateOpponent();
      try {
        const response = await axios.get(`http://localhost:3000/api/pokemons/${opponentId}`);
        if (response.data) {
          setOpponentPokemon(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'adversaire:', error);
      }
    };

    fetchOpponent();
  }, [battleState, difficulty]);

  // Calculer les bonus/malus en fonction des types
  const calculateTypeAdvantage = (attackerType, defenderType) => {
    if (!attackerType || !defenderType) return 1;
    
    const attackerTypes = Array.isArray(attackerType) ? attackerType : [attackerType];
    const defenderTypes = Array.isArray(defenderType) ? defenderType : [defenderType];
    
    let multiplier = 1;
    
    for (const attacker of attackerTypes) {
      for (const defender of defenderTypes) {
        if (typeRelations[attacker.toLowerCase()]?.strong.includes(defender.toLowerCase())) {
          multiplier *= 1.5; // Super efficace
        } else if (typeRelations[attacker.toLowerCase()]?.weak.includes(defender.toLowerCase())) {
          multiplier *= 0.5; // Pas très efficace
        }
      }
    }
    
    return multiplier;
  };

  // Initialiser les HP au début du combat
  useEffect(() => {
    if (battleState === 'fighting' && userPokemon && opponentPokemon) {
      console.log('Initialisation du combat:', {
        userPokemon,
        opponentPokemon,
        battleState
      });
      
      // Utiliser les HP de base des Pokémon
      const userMaxHP = userPokemon.base.HP;
      const opponentMaxHP = opponentPokemon.base.HP;
      
      setUserHP(userMaxHP);
      setOpponentHP(opponentMaxHP);
      setActionCount({ attack: 0, defense: 0 });
      setBattleLog([]);
      
      // Déterminer qui commence aléatoirement
      const firstTurn = Math.random() < 0.5 ? 'user' : 'opponent';
      console.log('Premier tour:', firstTurn);
      setCurrentTurn(firstTurn);
      
      // Si c'est l'adversaire qui commence, lancer son tour immédiatement
      if (firstTurn === 'opponent') {
        setTimeout(handleOpponentTurn, 1000);
      }
    }
  }, [battleState, userPokemon, opponentPokemon]);

  // Ajouter un effet pour surveiller currentTurn
  useEffect(() => {
    console.log('Tour actuel:', currentTurn);
  }, [currentTurn]);

  // Fonction pour calculer les dégâts
  const calculateDamage = (attacker, defender, isSpecial = false) => {
    // Utiliser les statistiques réelles du Pokémon
    const baseDamage = isSpecial ? attacker.base['Sp. Attack'] : attacker.base.Attack;
    const defense = isSpecial ? defender.base['Sp. Defense'] : defender.base.Defense;
    const typeMultiplier = calculateTypeAdvantage(attacker.type, defender.type);
    
    // Nouvelle formule de calcul des dégâts
    // On divise la défense par 2 pour réduire son impact
    // On ajoute un multiplicateur de base pour augmenter les dégâts
    let damage = Math.floor((baseDamage * 1.5 * typeMultiplier) / (defense / 2));
    
    // Si c'est le joueur qui attaque, augmenter les dégâts de 1.5 fois
    if (attacker === userPokemon) {
      damage = (damage * 2);
    }
    
    // Assurer un minimum de dégâts basé sur l'attaque
    const minDamage = Math.floor(baseDamage * 0.1);
    return Math.max(minDamage, damage);
  };

  // Fonction pour l'attaque du joueur
  const handleUserAttack = () => {
    if (currentTurn !== 'user') return;

    const damage = calculateDamage(userPokemon, opponentPokemon);
    const newOpponentHP = Math.max(0, opponentHP - damage);
    setOpponentHP(newOpponentHP);
    setActionCount(prev => ({ ...prev, attack: prev.attack + 1 }));
    setBattleLog(prev => [...prev, `Votre ${userPokemon.name.french} inflige ${damage} points de dégâts !`]);

    if (newOpponentHP <= 0) {
      handleBattleEnd('win');
    } else {
      setCurrentTurn('opponent');
      setTimeout(handleOpponentTurn, 1000);
    }
  };

  // Fonction pour la défense du joueur
  const handleUserDefense = () => {
    if (currentTurn !== 'user') return;

    const maxHP = userPokemon.base.HP;
    const defense = Math.floor(userPokemon.base.Defense * 0.2);
    
    // Utiliser une fonction de mise à jour pour s'assurer d'avoir la dernière valeur
    setUserHP(prevHP => {
      const newHP = Math.min(maxHP, prevHP + defense);
      console.log('Défense - Anciens HP:', prevHP, 'Nouveaux HP:', newHP);
      return newHP;
    });

    setActionCount(prev => ({ ...prev, defense: prev.defense + 1 }));
    setBattleLog(prev => [...prev, `Votre ${userPokemon.name.french} se défend et récupère ${defense} points de vie !`]);
    
    // Attendre que les HP soient mis à jour avant de passer au tour de l'adversaire
    setTimeout(() => {
      setCurrentTurn('opponent');
      setTimeout(handleOpponentTurn, 500); // Augmenter le délai pour s'assurer que les HP sont mis à jour
    }, 500);
  };

  // Fonction pour l'attaque spéciale du joueur
  const handleUserSpecialAttack = () => {
    if (currentTurn !== 'user' || actionCount.attack < 3) return;

    const damage = calculateDamage(userPokemon, opponentPokemon, true);
    const newOpponentHP = Math.max(0, opponentHP - damage);
    setOpponentHP(newOpponentHP);
    setActionCount({ attack: 0, defense: 0 });
    setBattleLog(prev => [...prev, `Votre ${userPokemon.name.french} utilise une attaque spéciale et inflige ${damage} points de dégâts !`]);

    if (newOpponentHP <= 0) {
      handleBattleEnd('win');
    } else {
      setCurrentTurn('opponent');
      setTimeout(handleOpponentTurn, 1000);
    }
  };

  // Fonction pour le tour de l'adversaire
  const handleOpponentTurn = () => {
    if (!opponentPokemon) {
      console.log('Pas d\'adversaire disponible');
      return;
    }

    console.log('Tour de l\'adversaire');
    const shouldAttack = Math.random() < 0.7;
    const shouldUseSpecial = Math.random() < 0.3;

    if (shouldUseSpecial) {
      const damage = calculateDamage(opponentPokemon, userPokemon, true);
      setUserHP(prevHP => {
        const newHP = Math.max(0, prevHP - damage);
        console.log('Attaque spéciale - Anciens HP:', prevHP, 'Nouveaux HP:', newHP);
        return newHP;
      });
      setBattleLog(prev => [...prev, `${opponentPokemon.name.french} utilise une attaque spéciale et inflige ${damage} points de dégâts !`]);

      if (userHP - damage <= 0) {
        handleBattleEnd('lose');
      } else {
        console.log('Fin du tour de l\'adversaire, tour du joueur');
        setCurrentTurn('user');
      }
    } else if (shouldAttack) {
      const damage = calculateDamage(opponentPokemon, userPokemon);
      setUserHP(prevHP => {
        const newHP = Math.max(0, prevHP - damage);
        console.log('Attaque - Anciens HP:', prevHP, 'Nouveaux HP:', newHP);
        return newHP;
      });
      setBattleLog(prev => [...prev, `${opponentPokemon.name.french} attaque et inflige ${damage} points de dégâts !`]);

      if (userHP - damage <= 0) {
        handleBattleEnd('lose');
      } else {
        console.log('Fin du tour de l\'adversaire, tour du joueur');
        setCurrentTurn('user');
      }
    } else {
      const maxHP = opponentPokemon.base.HP;
      const defense = Math.floor(opponentPokemon.base.Defense * 0.2);
      setOpponentHP(prevHP => {
        const newHP = Math.min(maxHP, prevHP + defense);
        console.log('Défense adversaire - Anciens HP:', prevHP, 'Nouveaux HP:', newHP);
        return newHP;
      });
      setBattleLog(prev => [...prev, `${opponentPokemon.name.french} se défend et récupère ${defense} points de vie !`]);
      console.log('Fin du tour de l\'adversaire, tour du joueur');
      setCurrentTurn('user');
    }
  };

  // Fonction pour gérer la fin du combat
  const handleBattleEnd = async (result) => {
    setBattleResult(result);
    setBattleState('result');
    
    if (result === 'win') {
      // Calculer les récompenses
      let xpReward = 0;
      let goldReward = 0;
      
      switch (difficulty) {
        case 'easy':
          xpReward = 50;
          goldReward = 10;
          break;
        case 'medium':
          xpReward = 100;
          goldReward = 25;
          break;
        case 'hard':
          xpReward = 200;
          goldReward = 50;
          break;
      }
      
      setRewards({ xp: xpReward, gold: goldReward });

      // Mettre à jour les statistiques
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:3000/api/game/battle/end',
          {
            result: 'wins',
            xpEarned: xpReward,
            goldEarned: goldReward
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setStats(response.data.data);
          // Mettre à jour la difficulté en fonction du nouveau nombre de victoires
          if (response.data.data.battleStats.wins >= 7) {
            setDifficulty('hard');
          } else if (response.data.data.battleStats.wins >= 5) {
            setDifficulty('medium');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour des statistiques:', error);
      }
    } else {
      // En cas de défaite, mettre à jour les statistiques avec une récompense minimale
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:3000/api/game/battle/end',
          {
            result: 'losses',
            xpEarned: 25,
            goldEarned: 5
          },
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
        console.error('Erreur lors de la mise à jour des statistiques:', error);
      }
    }
  };

  // Démarrer un combat
  const startBattle = () => {
    if (!selectedPokemon) {
      alert('Veuillez sélectionner un Pokémon');
      return;
    }
    
    setBattleState('fighting');
  };

  // Terminer le combat et retourner à la sélection
  const finishBattle = () => {
    setBattleState('selecting');
    setBattleResult(null);
    setOpponentPokemon(null);
  };

  // Sélectionner un Pokémon
  const handlePokemonSelect = (pokemonId) => {
    setSelectedPokemon(pokemonId);
  };

  // Utiliser une potion
  const usePotion = async (potionType) => {
    // Convertir le type de potion en numéro pour l'API
    let potionNumber;
    switch (potionType) {
      case 'potions':
        potionNumber = '1';
        break;
      case 'superPotions':
        potionNumber = '2';
        break;
      case 'hyperPotions':
        potionNumber = '3';
        break;
      default:
        setMessage('Type de potion invalide');
        return;
    }

    if (!inventory || inventory[potionType] <= 0) {
      setMessage('Vous n\'avez plus de cette potion !');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/game/use-potion/${potionNumber}`,
        {
          pokemonId: userPokemon.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Mettre à jour l'inventaire
        setInventory(response.data.data.inventory);
        
        // Mettre à jour les PV du Pokémon
        const maxHP = userPokemon.base.HP;
        setUserHP(prev => Math.min(maxHP, prev + response.data.data.hpRestored));
        
        setMessage(response.data.data.message);
        
        // Cacher le menu des potions
        setShowPotionMenu(false);
      }
    } catch (error) {
      setError('Erreur lors de l\'utilisation de la potion');
      console.error(error);
    }
  };

  return (
    <div className="battle-container">
      <div className="header-container">
        <button 
          className="home-button"
          onClick={() => navigate('/')}
        >
          Accueil
        </button>
        <h1>Combat Pokémon</h1>
      </div>
      
      {/* Affichage des statistiques */}
      {stats && (
        <div className="stats-battle-container">
          <div className="stats-grid">
            <div className="stat-battle-item">
              <span className="stat-label">Victoires: </span>
              <span className="stat-value">{stats.battleStats.wins}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Défaites: </span>
              <span className="stat-value">{stats.battleStats.losses}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">XP: </span>
              <span className="stat-value">{stats.xp}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Niveau: </span>
              <span className="stat-value">{stats.level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Or: </span>
              <span className="stat-value">{stats.gold}</span>
            </div>
          </div>
        </div>
      )}

      {battleState === 'selecting' && (
        <div className="battle-selection">
          <h2>Sélectionnez votre Pokémon pour combattre et gagner des pièces d'or !!</h2>
          
          <div className="pokemon-selection">
            {unlockedPokemonsDetails.map(pokemon => (
              <div 
                key={pokemon.id}
                className={`pokemon-option ${selectedPokemon === pokemon.id ? 'selected' : ''}`}
                onClick={() => handlePokemonSelect(pokemon.id)}
              >
                <img 
                  src={`/src/assets/pokemons/${pokemon.id}.png`} 
                  alt={pokemon.name.french}
                  onError={(e) => {
                    e.target.src = '/src/assets/img autre/inte.png';
                  }}
                />
                <span>{pokemon.name.french}</span>
              </div>
            ))}
          </div>
          
          <button 
            className="battle-action-button"
            onClick={startBattle}
            disabled={!selectedPokemon}
          >
            Commencer le combat
          </button>
      </div>
      )}
      
      {battleState === 'fighting' && (
        <div className="battle-arena">
          <div className="battle-pokemon user-pokemon">
            {userPokemon && (
              <>
                <img 
                  src={`/src/assets/pokemons/${userPokemon.id}.png`} 
                  alt={userPokemon.name.french}
                  onError={(e) => {
                    e.target.src = '/src/assets/img autre/inte.png';
                  }}
                />
                <div className="pokemon-info">
                  <h3>{userPokemon.name.french}</h3>
                  <div className="pokemon-types">
                    {Array.isArray(userPokemon.type) 
                      ? userPokemon.type.map(type => (
                          <img 
                            key={type}
                            src={`/src/assets/types/${typeToImageNumber[type.toLowerCase()]}.png`}
                            alt={type}
                            className="type-image"
                            onError={(e) => {
                              e.target.src = '/src/assets/img autre/inte.png';
                            }}
                          />
                        ))
                      : <img 
                          src={`/src/assets/types/${typeToImageNumber[type.toLowerCase()]}.png`}
                          alt={userPokemon.type}
                          className="type-image"
                          onError={(e) => {
                            e.target.src = '/src/assets/img autre/inte.png';
                          }}
                        />
                    }
                  </div>
                  <div className="pokemon-stats">
                    <div className="hp-bar">
                      <div 
                        className="hp-fill" 
                        style={{ width: `${(userHP / userPokemon.base.HP) * 100}%` }}
                      ></div>
                      <span>HP: {userHP}/{userPokemon.base.HP}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>

          <div className="battle-vs">VS</div>
          
          <div className="battle-pokemon opponent-pokemon">
            {opponentPokemon && (
              <>
                <img 
                  src={`/src/assets/pokemons/${opponentPokemon.id}.png`} 
                  alt={opponentPokemon.name.french}
                  onError={(e) => {
                    e.target.src = '/src/assets/img autre/inte.png';
                  }}
                />
                <div className="pokemon-info">
                  <h3>{opponentPokemon.name.french}</h3>
                  <div className="pokemon-types">
                    {Array.isArray(opponentPokemon.type) 
                      ? opponentPokemon.type.map(type => (
                          <img 
                            key={type}
                            src={`/src/assets/types/${typeToImageNumber[type.toLowerCase()]}.png`}
                            alt={type}
                            className="type-image"
                            onError={(e) => {
                              e.target.src = '/src/assets/img autre/inte.png';
                            }}
                          />
                        ))
                      : <img 
                          src={`/src/assets/types/${typeToImageNumber[type.toLowerCase()]}.png`}
                          alt={opponentPokemon.type}
                          className="type-image"
                          onError={(e) => {
                            e.target.src = '/src/assets/img autre/inte.png';
                          }}
                        />
                    }
                  </div>
                  <div className="pokemon-stats">
                    <div className="hp-bar">
                      <div 
                        className="hp-fill" 
                        style={{ width: `${(opponentHP / opponentPokemon.base.HP) * 100}%` }}
                      ></div>
                      <span>HP: {opponentHP}/{opponentPokemon.base.HP}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="battle-actions">
            {currentTurn === 'user' && (
              <>
                <button 
                  className="battle-action-button"
                  onClick={handleUserAttack}
                  disabled={actionCount.attack >= 3}
                >
                  Attaquer
                </button>
                <button 
                  className="battle-action-button"
                  onClick={handleUserDefense}
                  disabled={actionCount.defense >= 3}
                >
                  Défendre
                </button>
                <button 
                  className="battle-action-button special"
                  onClick={handleUserSpecialAttack}
                  disabled={actionCount.attack < 3}
                >
                  Attaque Spéciale
                </button>
                <button 
                  className="battle-action-button potion"
                  onClick={() => setShowPotionMenu(!showPotionMenu)}
                >
                  Utiliser une Potion
                </button>
              </>
            )}
          </div>

          {/* Menu des potions */}
          {showPotionMenu && (
            <div className="potion-menu">
              <button 
                className="potion-button"
                onClick={() => usePotion('potions')}
                disabled={!inventory || inventory.potions <= 0}
              >
                Potion (20 PV) - {inventory?.potions || 0} restantes
              </button>
              <button 
                className="potion-button"
                onClick={() => usePotion('superPotions')}
                disabled={!inventory || inventory.superPotions <= 0}
              >
                Super Potion (50 PV) - {inventory?.superPotions || 0} restantes
              </button>
              <button 
                className="potion-button"
                onClick={() => usePotion('hyperPotions')}
                disabled={!inventory || inventory.hyperPotions <= 0}
              >
                Hyper Potion (120 PV) - {inventory?.hyperPotions || 0} restantes
              </button>
              <button 
                className="potion-button cancel"
                onClick={() => setShowPotionMenu(false)}
              >
                Annuler
              </button>
            </div>
          )}

          <div className="battle-log">
            {battleLog.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </div>
      )}
      
      {battleState === 'result' && (
        <div className="battle-result">
          <h2>{battleResult === 'win' ? 'Victoire !' : 'Défaite...'}</h2>
          
          {battleResult === 'win' && (
            <div className="battle-rewards">
              <p>Vous avez gagné :</p>
              <p>{rewards.xp} XP</p>
              <p>{rewards.gold} pièces d'or</p>
            </div>
          )}
          
          <button className="battle-action-button" onClick={finishBattle}>
            {battleResult === 'win' ? 'Continuer' : 'Réessayer'}
          </button>
        </div>
      )}
      
      <div className="battle-info">
        <p>Niveau de difficulté : {difficulty}</p>
        <p>Combats gagnés : {battlesWon}</p>
      </div>
    </div>
  );
}

export default Battle;