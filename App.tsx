
import React, { useState, useEffect, useRef } from 'react';
import { Settings, Plus, BarChart2, Home, Droplets, Bell, MessageCircleHeart, PieChart as PieChartIcon, List, Users } from 'lucide-react';
import { UserProfile, DrinkLog, DrinkType, CharacterType } from './types';
import { ProfileModal } from './components/ProfileModal';
import { DrinkLogger } from './components/DrinkLogger';
import { StatsReport } from './components/StatsReport';
import { AIChat } from './components/AIChat';
import { DrinkingAnimation } from './components/DrinkingAnimation';
import { WaveBackground } from './components/WaveBackground';
import { CharacterSelector } from './components/CharacterSelector';
import { HelpModal } from './components/HelpModal';
import { getDayKey } from './utils';
import { DRINK_OPTIONS } from './constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Initial dummy state
const INITIAL_PROFILE: UserProfile = {
  name: "Guest",
  age: 25,
  weight: 70,
  height: 175,
  dailyGoal: 2450,
  reminderInterval: 60,
  selectedCharacter: CharacterType.DORAEMON
};

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [logs, setLogs] = useState<DrinkLog[]>([]);
  const [view, setView] = useState<'home' | 'stats' | 'chat'>('home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogger, setShowLogger] = useState(false);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showTodayChart, setShowTodayChart] = useState(false);
  
  // Animation State
  const [animatingDrink, setAnimatingDrink] = useState<DrinkType | null>(null);

  // Long Press Refs
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  // Load from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('hydro_profile');
    const savedLogs = localStorage.getItem('hydro_logs');
    
    if (savedProfile) {
      setProfile({ ...INITIAL_PROFILE, ...JSON.parse(savedProfile) });
    } else {
      setShowProfileModal(true); // First time user
    }
    
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Notification Timer Logic
  useEffect(() => {
    const checkInterval = setInterval(() => {
        const lastLog = logs.length > 0 ? logs[logs.length - 1].timestamp : 0;
        const now = Date.now();
        const intervalMs = profile.reminderInterval * 60 * 1000;

        // If haven't drunk in configured interval
        if (now - lastLog > intervalMs) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 8000); // Hide after 8s
        }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [logs, profile.reminderInterval]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('hydro_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('hydro_logs', JSON.stringify(logs));
  }, [logs]);

  const handleAddDrink = (log: Omit<DrinkLog, 'id' | 'timestamp'>) => {
    const newLog: DrinkLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setLogs([...logs, newLog]);
    
    // Trigger animation
    setAnimatingDrink(log.type);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setShowProfileModal(false);
  };

  // Long Press Handlers
  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setShowCharacterSelector(true);
    }, 600); // 600ms long press
  };

  const endPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isLongPress.current) {
      // Normal click
      if(!showCharacterSelector) setShowLogger(true);
    }
    isLongPress.current = false;
  };

  // Calculations for Home View
  const todayKey = getDayKey();
  const todayLogs = logs.filter(l => getDayKey(new Date(l.timestamp)) === todayKey);
  const todayTotal = todayLogs.reduce((sum, l) => sum + l.amount, 0);
  const progressPercent = (todayTotal / profile.dailyGoal) * 100;

  // Prepare Pie Chart Data
  const pieData = React.useMemo(() => {
    const dataMap: {[key: string]: number} = {};
    todayLogs.forEach(log => {
      dataMap[log.type] = (dataMap[log.type] || 0) + log.amount;
    });
    return Object.entries(dataMap).map(([name, value]) => {
      const option = DRINK_OPTIONS.find(o => o.type === name);
      // Map Tailwind classes to hex for Recharts (approximate)
      let color = '#3b82f6'; // default blue
      if (option?.color.includes('green')) color = '#16a34a';
      if (option?.color.includes('amber')) color = '#b45309';
      if (option?.color.includes('orange')) color = '#fb923c';
      if (option?.color.includes('yellow')) color = '#eab308';
      if (option?.color.includes('purple')) color = '#a855f7';
      if (option?.color.includes('red')) color = '#ef4444';
      if (option?.color.includes('gray')) color = '#6b7280';
      
      return { name, value, color };
    });
  }, [todayLogs]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white h-[100dvh] relative shadow-2xl flex flex-col overflow-hidden">
        
        {/* Drinking Animation Overlay */}
        {animatingDrink && (
          <DrinkingAnimation 
            type={animatingDrink} 
            characterType={profile.selectedCharacter || CharacterType.DORAEMON}
            onComplete={() => setAnimatingDrink(null)} 
          />
        )}

        {/* Notification Toast */}
        {showNotification && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-2 w-max">
                <Bell size={18} fill="white" />
                <span className="text-sm font-bold">该喝水啦! ({profile.reminderInterval}分钟了)</span>
            </div>
        )}

        {/* Top Header - Hidden in chat view to save space */}
        {view !== 'chat' && (
          <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pr-4 rounded-full shadow-sm">
              <img 
                src={profile.avatar || "https://picsum.photos/200"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Hi,</span>
                <span className="text-sm font-bold text-gray-800 leading-none truncate max-w-[80px]">{profile.name.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex gap-2">
               {/* Character Switch Button */}
               <button
                  onClick={() => setShowCharacterSelector(true)}
                  className="p-3 bg-white/60 backdrop-blur-md rounded-full text-blue-600 hover:bg-white transition shadow-sm"
                  title="切换伙伴"
               >
                 <Users size={20} />
               </button>

               {/* Settings Button */}
               <button 
                onClick={() => setShowProfileModal(true)}
                className="p-3 bg-white/60 backdrop-blur-md rounded-full text-gray-700 hover:bg-white transition shadow-sm"
                title="设置"
              >
                <Settings size={20} />
              </button>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col z-0">
          {view === 'home' && (
            <>
              {/* Progress Visualization */}
              <div className="flex-1 relative flex flex-col items-center justify-center">
                <div className="z-10 text-center mt-[-60px] flex flex-col items-center">
                  <h1 className="text-6xl font-bold brand-font text-blue-900 drop-shadow-sm">
                    {Math.round(progressPercent)}%
                  </h1>
                  <p className="text-blue-700/60 font-medium mt-2 text-lg">
                    {todayTotal} / {profile.dailyGoal} ml
                  </p>
                  
                  {/* Developer Credit Badge */}
                  <div className="mt-4 px-3 py-1 bg-white/30 backdrop-blur-md rounded-full border border-white/50 shadow-sm animate-fade-in">
                    <span className="text-[10px] font-bold text-blue-900/70 tracking-widest uppercase">
                      Designed by 翼豹
                    </span>
                  </div>
                </div>
                <WaveBackground percentage={progressPercent} />
              </div>

              {/* Today's Record Container */}
              <div className="h-2/5 bg-white/90 backdrop-blur-xl rounded-t-3xl z-10 p-6 overflow-y-auto shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-24 no-scrollbar">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">今日记录</h3>
                    <button 
                      onClick={() => setShowTodayChart(!showTodayChart)}
                      className="p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                      title={showTodayChart ? "列表视图" : "图表视图"}
                    >
                      {showTodayChart ? <List size={18} /> : <PieChartIcon size={18} />}
                    </button>
                 </div>

                 {todayLogs.length === 0 ? (
                   <div className="text-center text-gray-400 py-4 flex flex-col items-center mt-8">
                     <Droplets size={32} className="mb-2 opacity-50"/>
                     <p>还没有喝水呢，快开始吧！</p>
                   </div>
                 ) : showTodayChart ? (
                   // Pie Chart View
                   <div className="w-full h-48 animate-fade-in">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                          />
                          <Legend iconSize={8} wrapperStyle={{fontSize: '12px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                   </div>
                 ) : (
                   // List View
                   <div className="space-y-3">
                     {todayLogs.slice().reverse().map(log => {
                       const option = DRINK_OPTIONS.find(o => o.type === log.type) || DRINK_OPTIONS[0];
                       return (
                         <div key={log.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100 animate-slide-up">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${option.bg} ${option.color}`}>
                                <option.icon size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">
                                    {log.type}
                                    {log.customName && <span className="text-gray-400 font-normal ml-1">- {log.customName}</span>}
                                </p>
                                <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit', hour12: false})}</p>
                              </div>
                            </div>
                            <span className="font-bold text-blue-600">{log.amount}ml</span>
                         </div>
                       );
                     })}
                   </div>
                 )}
              </div>
            </>
          )}

          {view === 'stats' && <StatsReport logs={logs} profile={profile} />}
          
          {view === 'chat' && <AIChat logs={todayLogs} profile={profile} />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-6 left-6 right-6 bg-black text-white p-2 rounded-2xl flex justify-between items-center shadow-2xl z-40">
           <button 
             onClick={() => setView('home')}
             className={`p-3 rounded-xl transition ${view === 'home' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             <Home size={24} />
           </button>

           <button 
             onClick={() => setView('stats')}
             className={`p-3 rounded-xl transition ${view === 'stats' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             <BarChart2 size={24} />
           </button>

            {/* Chat Button */}
           <button 
             onClick={() => setView('chat')}
             className={`p-3 rounded-xl transition ${view === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             <MessageCircleHeart size={24} />
           </button>

           {/* Floating Action Button with Long Press */}
           <div className="relative">
              <button 
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-300 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center select-none"
              >
                <Plus size={24} strokeWidth={3} />
              </button>
           </div>
        </nav>

        {/* Modals */}
        <ProfileModal 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
          profile={profile}
          onSave={handleSaveProfile}
          onOpenHelp={() => setShowHelpModal(true)}
        />

        <DrinkLogger 
          isOpen={showLogger}
          onClose={() => setShowLogger(false)}
          onAdd={handleAddDrink}
        />

        <CharacterSelector 
           isOpen={showCharacterSelector}
           onClose={() => setShowCharacterSelector(false)}
           selected={profile.selectedCharacter || CharacterType.DORAEMON}
           onSelect={(char) => setProfile({...profile, selectedCharacter: char})}
        />

        <HelpModal 
          isOpen={showHelpModal} 
          onClose={() => setShowHelpModal(false)} 
        />

      </div>
    </div>
  );
};

export default App;
