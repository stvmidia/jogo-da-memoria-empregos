
import React from 'react';

interface CongratsModalProps {
  attempts: number;
  onRestart: () => void;
}

const CongratsModal: React.FC<CongratsModalProps> = ({ attempts, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl xl:max-w-4xl w-full text-center transform transition-all animate-fade-in-up">
        <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold text-amber-500 mb-4">Parabéns!</h2>
        <p className="text-xl md:text-2xl xl:text-3xl text-slate-700 mb-2">Você encontrou todos os pares!</p>
        <p className="text-lg md:text-xl xl:text-2xl text-slate-600 mb-8">
          Você completou o jogo em <span className="font-bold text-violet-600">{attempts}</span> tentativas.
        </p>
        <button
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 lg:py-5 lg:px-16 text-2xl lg:text-3xl rounded-lg transition-transform transform hover:scale-105"
        >
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default CongratsModal;