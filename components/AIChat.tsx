
import React, { useState, useRef, useEffect } from 'react';
import { DrinkLog, UserProfile, ChatMessage } from '../types';
import { createChatSession, formatChatError } from '../services/geminiService';
import { Send, Bot, User, Sparkles, Loader2, BrainCircuit, X } from 'lucide-react';
import { Chat } from '@google/genai';

interface AIChatProps {
  logs: DrinkLog[];
  profile: UserProfile;
}

export const AIChat: React.FC<AIChatProps> = ({ logs, profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [showContextBanner, setShowContextBanner] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat and get first report
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        const chat = await createChatSession(logs, profile);
        setChatSession(chat);
        
        // Initial analysis request
        const response = await chat.sendMessage({ 
          message: "Generate a short, fun analysis report of my drinking habits today. Be scientific but friendly." 
        });
        
        setMessages([
          { 
            id: 'init', 
            role: 'model', 
            text: response.text || "你好！我是你的智能饮水顾问。今天喝得怎么样？" 
          }
        ]);
      } catch (e) {
        setMessages([{ id: 'err', role: 'model', text: formatChatError(e) }]);
      } finally {
        setLoading(false);
      }
    };

    if (logs.length >= 0) {
        initChat();
    }
  }, [logs, profile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: input });
      const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: result.text || "我没听清，请再说一遍？" 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: formatChatError(error) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
       {/* Header */}
       <div className="p-4 bg-white shadow-sm flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 brand-font">AI 饮水顾问</h3>
              <p className="text-[10px] text-gray-500">Powered by Gemini</p>
            </div>
          </div>
       </div>

       {/* Context Banner */}
       {showContextBanner && (
         <div className="bg-blue-50 px-4 py-2 flex items-start justify-between border-b border-blue-100 shrink-0 animate-slide-up">
           <div className="flex gap-2">
             <BrainCircuit size={16} className="text-blue-500 mt-0.5" />
             <p className="text-xs text-blue-700 leading-tight">
               已同步您的身体数据 (身高/体重/年龄) 和今日 {logs.length} 条饮水记录。<br/>
               AI 会根据您的习惯动态调整建议。
             </p>
           </div>
           <button onClick={() => setShowContextBanner(false)} className="text-blue-400 hover:text-blue-600">
             <X size={14} />
           </button>
         </div>
       )}

       {/* Messages Area - Flex Grow to take available space */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'user' ? 'bg-gray-200' : 'bg-purple-600 text-white'
                   }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                   </div>
                   <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                   }`}>
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                   </div>
                </div>
             </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-2 bg-white p-3 rounded-2xl rounded-tl-none items-center shadow-sm border border-gray-100">
                  <Loader2 size={16} className="animate-spin text-purple-600" />
                  <span className="text-xs text-gray-400">正在思考...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area - Fixed at bottom of flex container, above nav padding */}
       <div className="p-4 bg-white border-t border-gray-100 shrink-0 pb-24"> 
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="问问 AI 这样喝健康吗..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-gray-700 placeholder-gray-400"
              disabled={loading}
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-2 rounded-full transition-all ${
                input.trim() ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
       </div>
    </div>
  );
};
