import React, { useMemo } from 'react';
import type { CardState } from '../types';

interface CardProps {
  card: CardState;
  index: number;
  onClick: (id: number) => void;
  isShuffling: boolean;
}

const Card: React.FC<CardProps> = ({ card, index, onClick, isShuffling }) => {
  const isFlipped = card.status === 'up' || card.status === 'matched';
  const randomDelay = useMemo(() => `${Math.random() * 0.4}s`, []);

  const handleClick = () => {
    if (card.status === 'down') {
      onClick(card.id);
    }
  };

  const isShufflingThisCard = isShuffling && card.status !== 'matched';

  const getFontSizeClasses = (name: string): string => {
    const longestWordLength = Math.max(...name.split(' ').map(w => w.length));

    // Handles very long single words like "Administração", "Fisioterapia"
    if (longestWordLength > 11) {
      return 'text-xs sm:text-sm md:text-base leading-tight';
    }
    // Handles long words like "Publicidade", "Engenharia"
    if (longestWordLength > 9) {
      return 'text-sm md:text-base leading-tight';
    }
    // Handles shorter words and multi-word names where each word is short
    return 'text-base md:text-lg leading-tight';
  };

  return (
    <div 
      className={`aspect-square perspective ${isShufflingThisCard ? 'shuffling-card' : ''}`}
      onClick={handleClick}
      style={{ animationDelay: isShufflingThisCard ? randomDelay : '0s' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Face para baixo */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-blue-500 hover:bg-blue-400 rounded-lg cursor-pointer shadow-lg">
          <span className="text-5xl xl:text-7xl font-bold text-white">{index + 1}</span>
        </div>

        {/* Face para cima / Match */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center text-center p-2 shadow-xl
          ${card.status === 'matched' ? 'bg-violet-400' : 'bg-slate-100'}`}
        >
          {card.status !== 'matched' && (
            <span className={`text-slate-800 font-semibold ${getFontSizeClasses(card.professionName)}`}>
              {card.professionName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;