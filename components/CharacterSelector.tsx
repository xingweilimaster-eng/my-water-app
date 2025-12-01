import React from 'react';
import { CharacterType } from '../types';
import { CHARACTERS } from '../constants';
import { X } from 'lucide-react';

interface CharacterSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selected: CharacterType;
  onSelect: (char: CharacterType) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ isOpen, onClose, selected, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
       <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-fade-in relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
             <X size={24} />
          </button>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center brand-font">选择你的喝水伙伴</h2>
          <p className="text-xs text-center text-gray-500 mb-6">它会在你喝水时出来为你加油!</p>

          <div className="grid grid-cols-2 gap-4">
             {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => { onSelect(char.id); onClose(); }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 relative overflow-hidden group ${
                    selected === char.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-offset-2' 
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                   {/* Background Splash Effect */}
                   <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10 group-hover:scale-150 transition-transform ${char.color}`}></div>

                   {/* Simple Color Avatar Representation */}
                   <div className={`w-16 h-16 rounded-full ${char.color} shadow-lg border-4 border-white flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform`}>
                      {char.id === CharacterType.DORAEMON && '🐱'}
                      {char.id === CharacterType.OPTIMUS && '🤖'}
                      {char.id === CharacterType.BATMAN && '🦇'}
                      {char.id === CharacterType.CATWOMAN && '😽'}
                   </div>
                   <span className={`font-bold text-sm ${selected === char.id ? 'text-blue-700' : 'text-gray-700'}`}>
                     {char.name}
                   </span>
                </button>
             ))}
          </div>
       </div>
    </div>
  );
};