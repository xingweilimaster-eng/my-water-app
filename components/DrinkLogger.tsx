import React, { useState, useEffect } from 'react';
import { DrinkType, DrinkLog } from '../types';
import { DRINK_OPTIONS, PRESET_AMOUNTS } from '../constants';
import { PlusCircle, X, PenLine } from 'lucide-react';

interface DrinkLoggerProps {
  onAdd: (log: Omit<DrinkLog, 'id' | 'timestamp'>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DrinkLogger: React.FC<DrinkLoggerProps> = ({ onAdd, isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<DrinkType>(DrinkType.WATER);
  const [amount, setAmount] = useState<number>(250);
  const [customName, setCustomName] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCustomName('');
      setSelectedType(DrinkType.WATER);
      setAmount(250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAdd({ 
      type: selectedType, 
      amount,
      customName: selectedType === DrinkType.OTHER ? customName : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up sm:animate-fade-in pb-10 sm:pb-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 brand-font">添加饮品</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Drink Types Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {DRINK_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${
                selectedType === opt.type 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full ${opt.bg} ${opt.color} mb-1`}>
                <opt.icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-600 text-center leading-tight">{opt.type}</span>
            </button>
          ))}
        </div>

        {/* Custom Name Input (Only for Other) */}
        {selectedType === DrinkType.OTHER && (
          <div className="mb-6 animate-fade-in">
             <label className="block text-sm font-semibold text-gray-600 mb-2">饮品名称</label>
             <div className="relative">
               <PenLine className="absolute left-3 top-3 text-gray-400" size={18} />
               <input 
                 type="text"
                 placeholder="例如: 椰子水, 豆浆..."
                 value={customName}
                 onChange={(e) => setCustomName(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none"
                 autoFocus
               />
             </div>
          </div>
        )}

        {/* Amount Slider & Presets */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-blue-600 brand-font">{amount}</span>
            <span className="text-gray-500 ml-1">ml</span>
          </div>
          
          <input 
            type="range" 
            min="50" 
            max="1000" 
            step="10" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-4"
          />

          <div className="flex justify-between gap-2">
            {PRESET_AMOUNTS.map(preset => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                  amount === preset 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {preset}ml
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition-transform active:scale-95 shadow-xl shadow-gray-300"
        >
          <PlusCircle size={24} />
          记录
        </button>
      </div>
    </div>
  );
};