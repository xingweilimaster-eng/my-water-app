
import React from 'react';
import { X, Smartphone, Monitor, Cloud, AlertTriangle, Terminal, Github, ArrowRight, Key, Settings } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 brand-font flex items-center gap-2">
          <Monitor size={24} className="text-blue-500" />
          安装与部署指南
        </h2>

        <div className="space-y-6">

          {/* API Key Guide - CRITICAL STEP */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
             <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
               <Key size={18} /> 第一步: 获取 Google API Key
             </h3>
             <p className="text-xs text-amber-800 mb-3 leading-relaxed">
               这是让 AI 说话的“钥匙”。目前是<strong>免费</strong>的，但需要您自己申请。
             </p>
             <ol className="list-decimal list-inside text-xs text-amber-900 space-y-2 ml-1 font-medium">
               <li>
                 访问 <a href="https://aistudio.google.com/app/apikey" target="_blank" className="underline text-blue-600 font-bold">Google AI Studio</a> (需科学上网)。
               </li>
               <li>登录您的 Google 账号。</li>
               <li>点击左上角的 <span className="bg-blue-600 text-white px-1 rounded text-[10px]">Create API key</span> 按钮。</li>
               <li>复制生成的字符串 (以 <code>AIza</code> 开头)。保存好它！</li>
             </ol>
          </div>

          {/* Cloud Deployment Guide - Vercel */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
              <Cloud size={18} /> 第二步: Vercel 免费部署
            </h3>
            <p className="text-xs text-blue-800 mb-3">
              部署后生成链接，手机电脑都能访问。
            </p>
            <ol className="list-decimal list-inside text-xs text-blue-900 space-y-2 ml-1 font-medium">
              <li>注册 <strong>Vercel.com</strong> 并使用 GitHub 登录。</li>
              <li>点击 <strong>"Add New Project"</strong>，导入你的代码仓库。</li>
              
              {/* ENV VAR EXPLANATION */}
              <li className="bg-white p-2 rounded border border-blue-200 mt-2">
                <div className="flex items-center gap-1 font-bold text-blue-700 mb-1">
                   <Settings size={12} /> 关键配置 (Environment Variables)
                </div>
                <p className="mb-1 text-gray-600 font-normal">在 Deploy 按钮上方，点击展开 <strong>Environment Variables</strong> 菜单：</p>
                <div className="grid grid-cols-[40px_1fr] gap-1 items-center text-[10px]">
                   <span className="text-gray-500">Key:</span>
                   <code className="bg-gray-100 px-1 rounded select-all">API_KEY</code>
                   
                   <span className="text-gray-500">Value:</span>
                   <code className="bg-gray-100 px-1 rounded overflow-hidden text-ellipsis whitespace-nowrap">粘贴刚才的 AIza...</code>
                </div>
                <div className="text-right mt-1">
                   <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded">点击 Add 按钮</span>
                </div>
              </li>
              
              <li>配置完成后，点击底部的 <strong>Deploy</strong>。</li>
            </ol>
            
             {/* Troubleshooting Vercel Repo */}
            <div className="mt-3 bg-white p-3 rounded-lg border border-blue-200">
               <h4 className="text-xs font-bold text-red-500 flex items-center gap-1 mb-1">
                 <AlertTriangle size={12} /> 找不到仓库 (Repository)?
               </h4>
               <p className="text-[10px] text-gray-600 leading-tight">
                 这是 GitHub 权限问题。请去 GitHub 设置 -> Applications -> Vercel -> Configure。<br/>
                 将权限改为 <strong>All repositories</strong> (所有仓库)，保存后刷新 Vercel 即可。
               </p>
            </div>
          </div>

          {/* iOS/Android Install */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Smartphone size={18} /> 第三步: 手机访问
            </h3>
            <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1 ml-1">
              <li>部署成功后，Vercel 会给你一个网址。</li>
              <li>用手机浏览器打开该网址。</li>
              <li>
                iPhone: 点击底部 <span className="font-bold">分享</span> -> <span className="font-bold">添加到主屏幕</span>。<br/>
                安卓: 点击右上角菜单 -> <span className="font-bold">安装应用</span>。
              </li>
            </ol>
          </div>

        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          我懂了，开始吧！
        </button>
      </div>
    </div>
  );
};
