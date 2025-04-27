import { useState } from 'react';
import './cardStyles.css';

// Mapping des types avec leurs numéros d'image
const typeToNumber = {
    Normal: "1",
    Fighting: "2",
    Flying: "3",
    Poison: "4",
    Ground: "5",
    Rock: "6",
    Bug: "7",
    Ghost: "8",
    Steel: "9",
    Fire: "10",
    Water: "11",
    Grass: "12",
    Electric: "13",
    Psychic: "14",
    Ice: "15",
    Dragon: "16",
    Dark: "17",
    Fairy: "18"
};

const typeColors = {
    Normal: "#A8A878",
    Fire: "#F08030",
    Water: "#6890F0",
    Grass: "#78C850",
    Electric: "#F8D030",
    Ice: "#98D8D8",
    Fighting: "#C03028",
    Poison: "#A040A0",
    Ground: "#E0C068",
    Flying: "#A890F0",
    Psychic: "#F85888",
    Bug: "#A8B820",
    Rock: "#B8A038",
    Ghost: "#705898",
    Dragon: "#7038F8",
    Dark: "#705848",
    Steel: "#B8B8D0",
    Fairy: "#EE99AC"
};

const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

const PokemonCard = ({ pokemon, isShiny }) => {
    const [currentHP, setCurrentHP] = useState(pokemon.base.HP);
    const primaryType = pokemon.type[0];
    const backgroundColor = typeColors[primaryType];
    const borderColor = darkenColor(backgroundColor, 20);

    console.log('Pokemon data:', pokemon);
    const imagePath = `http://localhost:3000/images/${isShiny ? 'shiny/' : 'normal/'}${pokemon.id}.png`;
    console.log('Image path:', imagePath);

    return (
        <div 
            className="pokemon-card"
            style={{ 
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: '8px',
                borderStyle: 'solid'
            }}
        >
            <h2 className="pokemon-name">{pokemon.name.french}</h2>
            <img 
                src={imagePath}
                alt={pokemon.name.french}
                className="pokemon-image2"
                onError={(e) => {
                    console.log('Image error:', imagePath);
                    e.target.src = '1.png';
                }}
            />
            <div className="pokemon-types">
                {pokemon.type.map((type, index) => (
                    <img
                        key={index}
                        src={`http://localhost:3000/assets/types/${typeToNumber[type]}.png`}
                        alt={type}
                        className="type-icon"
                    />
                ))}
            </div>
            <p className="pokemon-hp">HP: {currentHP}/{pokemon.base.HP}</p>
            <div className="pokemon-stats">
                <p>Attaque: {pokemon.base.Attack}</p>
                <p>Défense: {pokemon.base.Defense}</p>
                <p>Vitesse: {pokemon.base.Speed}</p>
            </div>
        </div>
    );
};

export default PokemonCard;

