
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { calculateScientificGoal } from '../utils';
import { X, Camera, Calculator, Clock, HelpCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onOpenHelp: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave, onOpenHelp }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const autoCalc = () => {
    const goal = calculateScientificGoal(formData.weight, formData.age);
    setFormData({ ...formData, dailyGoal: goal });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-2xl font-bold text-gray-800 brand-font">个人设置</h2>
           <button 
             onClick={onOpenHelp}
             className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition mr-8"
           >
             <HelpCircle size={12} />
             帮助 & 安装
           </button>
        </div>

        <div className="flex flex-col gap-4">
          
          {/* Avatar Upload */}
          <div className="flex justify-center mb-2">
            <div className="relative w-24 h-24">
              <img 
                src={formData.avatar || "https://picsum.photos/200"} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">昵称</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">年龄</label>
              <input 
                type="number" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">体重 (kg)</label>
              <input 
                type="number" 
                value={formData.weight} 
                onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">身高 (cm)</label>
              <input 
                type="number" 
                value={formData.height} 
                onChange={e => setFormData({...formData, height: Number(e.target.value)})}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-600">每日目标 (ml)</label>
                <button 
                  onClick={autoCalc}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold"
                >
                  <Calculator size={12} /> 智能推荐
                </button>
             </div>
            <input 
              type="number" 
              value={formData.dailyGoal} 
              onChange={e => setFormData({...formData, dailyGoal: Number(e.target.value)})}
              className="w-full p-3 bg-blue-50 text-blue-800 font-bold rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-gray-600" />
              <label className="block text-sm font-semibold text-gray-600">喝水提醒间隔 (分钟)</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90, 120, 180].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setFormData({...formData, reminderInterval: mins})}
                  className={`py-2 rounded-lg text-sm font-medium border ${
                    formData.reminderInterval === mins 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {mins}分
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onSave(formData)}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};
