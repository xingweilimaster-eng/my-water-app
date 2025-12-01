
import React from 'react';
import { X, Smartphone, Monitor, Code, Share, Laptop, AlertTriangle, Terminal } from 'lucide-react';

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
          安装与使用指南
        </h2>

        <div className="space-y-6">

          {/* Warning for Source Code Users */}
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2 text-sm">
              <AlertTriangle size={16} /> 重要提示：无法直接打开
            </h3>
            <p className="text-xs text-orange-700 leading-relaxed">
              如果您是下载了源码压缩包：<br/>
              <span className="font-bold">请不要直接双击 index.html</span>。
              <br/>
              因为包含 React/TypeScript 代码，浏览器无法直接读取，您必须使用开发者工具（Node.js）启动本地服务器。
            </p>
          </div>
          
          {/* iOS Section */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Smartphone size={18} /> iPhone / iPad (网页端)
            </h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 ml-1">
              <li>在 Safari 浏览器中打开<span className="font-bold">部署后的网址</span></li>
              <li>点击底部的 <span className="font-bold text-blue-600"><Share size={12} className="inline"/> 分享</span> 按钮</li>
              <li>向下滚动并选择 <span className="font-bold text-gray-800">"添加到主屏幕"</span></li>
            </ol>
          </div>

          {/* Mac Developer Run Guide */}
          <div className="bg-gray-900 text-gray-300 p-4 rounded-xl">
             <h3 className="font-bold text-white flex items-center gap-2 mb-3">
              <Terminal size={18} /> Mac 源码运行指南
            </h3>
            <div className="text-xs font-mono space-y-3">
              <div>
                <p className="text-gray-500 mb-1">1. 确保已安装 Node.js，在终端运行：</p>
                <div className="bg-black p-2 rounded text-blue-400 border border-gray-700">node -v</div>
              </div>
              
              <div>
                 <p className="text-gray-500 mb-1">2. 在解压后的文件夹内打开终端，安装依赖：</p>
                 <div className="bg-black p-2 rounded text-green-400 border border-gray-700">npm install</div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">3. 启动本地服务器：</p>
                <div className="bg-black p-2 rounded text-yellow-400 border border-gray-700">npm run dev</div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">4. 在 Safari 打开提示的地址 (通常是)：</p>
                <div className="bg-black p-2 rounded text-white border border-gray-700 underline">http://localhost:5173</div>
              </div>
            </div>
          </div>

          {/* Sync Note */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
               数据均存储在本地浏览器缓存中。<br/>
               更换浏览器或设备，数据无法同步。
            </p>
          </div>

        </div>

        <button 
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
        >
          明白了
        </button>
      </div>
    </div>
  );
};
