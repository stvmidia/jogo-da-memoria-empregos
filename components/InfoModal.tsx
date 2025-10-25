import React from 'react';
import type { Profession } from '../types';

interface InfoModalProps {
  profession: Profession | null;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ profession, onClose }) => {
  if (!profession) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl xl:max-w-6xl w-full transform transition-all animate-fade-in-down">
        <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-violet-700 mb-6 text-center">{profession.name}</h2>
        
        <div className="space-y-6 text-lg md:text-xl xl:text-2xl">
          <div>
            <h3 className="font-bold text-2xl md:text-3xl xl:text-4xl text-slate-800 mb-2">Resumo da Profissão</h3>
            <p className="text-slate-600">{profession.summary}</p>
          </div>
          <div>
            <h3 className="font-bold text-2xl md:text-3xl xl:text-4xl text-slate-800 mb-2">Mercado de Trabalho</h3>
            <p className="text-slate-600">{profession.market}</p>
          </div>
          <div>
            <h3 className="font-bold text-2xl md:text-3xl xl:text-4xl text-slate-800 mb-2">Média Salarial (Inicial - Sênior)</h3>
            <p className="text-slate-600 font-semibold">{`${profession.salary.initial} - ${profession.salary.senior}`}</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onClose}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-10 lg:py-4 lg:px-12 text-2xl lg:text-3xl rounded-lg transition-transform transform hover:scale-105"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;