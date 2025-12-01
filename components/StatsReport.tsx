import React, { useEffect, useState } from 'react';
import { DrinkLog, UserProfile, GeminiAnalysis } from '../types';
import { analyzeHydration } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Bot, RefreshCw, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { getDayKey } from '../utils';

interface StatsReportProps {
  logs: DrinkLog[];
  profile: UserProfile;
}

export const StatsReport: React.FC<StatsReportProps> = ({ logs, profile }) => {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  // Prepare chart data
  const chartData = React.useMemo(() => {
    const today = new Date();
    const data = [];
    
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = getDayKey(d);
      const dayLabel = d.toLocaleDateString('zh-CN', { weekday: 'short' }).replace('周', ''); // Simplified day label
      
      const total = logs
        .filter(l => getDayKey(new Date(l.timestamp)) === dayStr)
        .reduce((sum, l) => sum + l.amount, 0);

      data.push({
        day: dayLabel,
        amount: total,
        fullDate: dayStr
      });
    }
    return data;
  }, [logs]);

  const handleAnalyze = async () => {
    setLoading(true);
    // Filter logs based on period
    const recentLogs = logs.filter(l => {
       const logDate = new Date(l.timestamp);
       const diffTime = Math.abs(new Date().getTime() - logDate.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
       return diffDays <= (period === 'daily' ? 1 : 7);
    });

    const result = await analyzeHydration(recentLogs, profile, period);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    if(logs.length > 0) {
      handleAnalyze(); // Auto analyze on mount/change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'bad': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
     switch (status) {
      case 'excellent': return '太棒了';
      case 'good': return '不错哦';
      case 'warning': return '要注意';
      case 'bad': return '太少了';
      default: return '状态';
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 brand-font text-gray-800">健康周报</h2>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-semibold text-gray-700 flex items-center gap-2">
             <TrendingUp size={18} className="text-blue-500"/>
             过去7天
           </h3>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.amount >= profile.dailyGoal ? '#3b82f6' : '#93c5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="relative">
        <div className="flex gap-2 mb-4">
           <button 
             onClick={() => setPeriod('daily')} 
             className={`px-4 py-1 rounded-full text-sm font-medium transition ${period === 'daily' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
           >
             日报
           </button>
           <button 
             onClick={() => setPeriod('weekly')} 
             className={`px-4 py-1 rounded-full text-sm font-medium transition ${period === 'weekly' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
           >
             周报
           </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center p-8 text-gray-400 animate-pulse">
             <Bot size={48} className="mb-2"/>
             <p>AI 正在分析您的饮水习惯...</p>
           </div>
        ) : analysis ? (
          <div className={`p-5 rounded-2xl border-2 ${getStatusColor(analysis.status)} transition-all animate-fade-in`}>
             <div className="flex items-start gap-4 mb-3">
               <div className="p-2 bg-white rounded-full shadow-sm">
                  {analysis.status === 'excellent' || analysis.status === 'good' ? 
                    <CheckCircle className="text-green-500" /> : 
                    <AlertCircle className="text-orange-500" />
                  }
               </div>
               <div>
                 <h4 className="font-bold text-lg mb-1 brand-font">{getStatusLabel(analysis.status)}!</h4>
                 <p className="text-sm leading-relaxed opacity-90">{analysis.message}</p>
               </div>
             </div>
             <div className="mt-4 pt-3 border-t border-black border-opacity-5 flex items-start gap-2">
                <span className="bg-white text-xs font-bold px-2 py-1 rounded text-gray-600 uppercase tracking-wide">贴士</span>
                <p className="text-xs italic mt-0.5 opacity-80">{analysis.tip}</p>
             </div>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-400">
            <p>暂无数据</p>
          </div>
        )}

        <button 
          onClick={handleAnalyze} 
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-500 transition"
          title="刷新分析"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};