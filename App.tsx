
import React, { useState, useEffect, useCallback } from 'react';
import { PROFESSIONS } from './constants';
import type { CardState, Profession } from './types';
import Card from './components/Card';
import InfoModal from './components/InfoModal';
import CongratsModal from './components/CongratsModal';
import Confetti from './components/Confetti';

// Toca um som de "chime" sutil quando um par é encontrado
const playMatchSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return; // Falha silenciosamente se a API não for suportada

    const audioCtx = new AudioContext();
    const now = audioCtx.currentTime;

    // Primeiro oscilador para o tom principal (C5)
    const oscillator1 = audioCtx.createOscillator();
    const gainNode1 = audioCtx.createGain();
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(523.25, now);
    gainNode1.gain.setValueAtTime(0.2, now); // Volume sutil
    gainNode1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    oscillator1.connect(gainNode1).connect(audioCtx.destination);
    
    // Segundo oscilador para um harmônico (G5)
    const oscillator2 = audioCtx.createOscillator();
    const gainNode2 = audioCtx.createGain();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(783.99, now);
    gainNode2.gain.setValueAtTime(0.2, now);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    oscillator2.connect(gainNode2).connect(audioCtx.destination);

    // Inicia e para os sons
    oscillator1.start(now);
    oscillator2.start(now);
    oscillator1.stop(now + 0.5);
    oscillator2.stop(now + 0.5);
  } catch (error) {
    console.warn("Não foi possível tocar o som:", error);
  }
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardState[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [activeModal, setActiveModal] = useState<Profession | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);
  const [confettiFire, setConfettiFire] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const initializeGame = useCallback(() => {
    const gameProfessions = [...PROFESSIONS];
    const duplicatedProfessions = [...gameProfessions, ...gameProfessions];
    const shuffled = shuffleArray(duplicatedProfessions);

    const initialCards: CardState[] = shuffled.map((profession, index) => ({
      id: index,
      professionId: profession.id,
      professionName: profession.name,
      status: 'down',
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setAttempts(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setActiveModal(null);
    setIsGameWon(false);
    setConfettiFire(false);
    setIsRevealed(false);
    setIsShuffling(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length >= 2 || isShuffling) return;

    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.status !== 'down') return;

    const newCards = cards.map(card =>
      card.id === id ? { ...card, status: 'up' as const } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, { ...clickedCard, status: 'up' }]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setAttempts(prev => prev + 1);

      const [firstCard, secondCard] = flippedCards;

      if (firstCard.professionId === secondCard.professionId) {
        // Par encontrado
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.professionId === firstCard.professionId
                ? { ...card, status: 'matched' }
                : card
            )
          );
          setMatchedPairs(prev => prev + 1);
          const professionInfo = PROFESSIONS.find(p => p.id === firstCard.professionId) || null;
          playMatchSound(); // Toca o efeito sonoro
          setActiveModal(professionInfo);
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // Sem correspondência
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, status: 'down' }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matchedPairs > 0 && matchedPairs === PROFESSIONS.length) {
      setTimeout(() => {
        setIsGameWon(true);
        setConfettiFire(true);
      }, 1000);
    }
  }, [matchedPairs]);
  
  const handleToggleReveal = () => {
    if (isGameWon || isShuffling) return;

    const nextRevealState = !isRevealed;
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.status === 'matched') {
          return card;
        }
        return { ...card, status: nextRevealState ? 'up' : 'down' };
      })
    );

    setFlippedCards([]);
    setIsChecking(false);
    setIsRevealed(nextRevealState);
  };

  const handleShuffleNow = () => {
    if (isShuffling) return;

    setIsShuffling(true);

    setTimeout(() => {
      setCards(prevCards => {
          const newCards = prevCards.map(card => 
              card.status === 'matched' ? card : {...card, status: 'down' as const}
          );
          return shuffleArray(newCards);
      });
      setFlippedCards([]);
      setIsChecking(false);
      setIsRevealed(false);
      setIsShuffling(false);
    }, 800);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setConfettiFire(true);
    setTimeout(() => setConfettiFire(false), 5000);
  };
  
  const handleRestart = () => {
    setIsGameWon(false);
    setConfettiFire(false);
    initializeGame();
  }

  return (
    <>
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        @keyframes fade-in-down { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        @keyframes shuffle-card-animation {
          0%, 100% { transform: scale(1) rotateY(0deg); }
          50% { transform: scale(1.15) rotateY(20deg); }
        }
        .shuffling-card {
          animation: shuffle-card-animation 0.4s ease-in-out 2 alternate;
        }
      `}</style>
      
      <Confetti fire={confettiFire} count={isGameWon ? 200 : 50} />

      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 xl:p-12 selection:bg-violet-500 selection:text-white">
        <header className="w-full max-w-screen-2xl flex flex-col md:flex-row justify-between items-center mb-6 xl:mb-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white">Jogo da Memória: Profissões</h1>
            <p className="text-lg lg:text-xl xl:text-2xl text-slate-300 mt-1">Uma atividade para a turma do Prof. Stanismar</p>
          </div>
          <div className="flex items-center gap-3 lg:gap-4 mt-4 md:mt-0">
            <button
              onClick={handleToggleReveal}
              disabled={isShuffling}
              className="bg-amber-500 text-white font-semibold py-2 px-4 lg:py-3 lg:px-6 lg:text-lg rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-700 disabled:cursor-not-allowed"
              aria-label={isRevealed ? 'Ocultar todas as cartas' : 'Revelar todas as cartas'}
            >
              {isRevealed ? 'Ocultar' : 'Revelar'}
            </button>
            <button
              onClick={handleShuffleNow}
              disabled={isShuffling}
              className="bg-cyan-500 text-white font-semibold py-2 px-4 lg:py-3 lg:px-6 lg:text-lg rounded-lg hover:bg-cyan-600 transition-colors disabled:bg-cyan-800 disabled:cursor-not-allowed w-32 lg:w-40"
            >
              {isShuffling ? 'Embaralhando...' : 'Embaralhar'}
            </button>
            <button
              onClick={handleRestart}
              disabled={isShuffling}
              className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 lg:py-3 lg:px-6 lg:text-lg rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Reiniciar
            </button>
          </div>
        </header>

        <main className="w-full max-w-screen-2xl flex-grow">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-12 gap-2 md:gap-4 xl:gap-5">
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} onClick={handleCardClick} isShuffling={isShuffling} />
            ))}
          </div>
        </main>

        <footer className="w-full max-w-screen-2xl mt-6 xl:mt-10 flex justify-center items-center gap-8 md:gap-12 lg:gap-16 text-2xl lg:text-3xl font-semibold">
          <div className="bg-slate-800 rounded-lg py-2 px-6 lg:py-3 lg:px-8">
            Tentativas: <span className="text-amber-400">{attempts}</span>
          </div>
          <div className="bg-slate-800 rounded-lg py-2 px-6 lg:py-3 lg:px-8">
            Pares: <span className="text-green-400">{matchedPairs}</span> / {PROFESSIONS.length}
          </div>
        </footer>
      </div>

      <InfoModal profession={activeModal} onClose={handleCloseModal} />
      {isGameWon && <CongratsModal attempts={attempts} onRestart={handleRestart} />}
    </>
  );
};

export default App;
