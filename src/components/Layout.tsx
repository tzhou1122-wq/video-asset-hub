import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Settings, Upload, Video, BarChart2, Tag, Trash2, User, Menu } from 'lucide-react';
import { useAppStore } from '../store';
import clsx from 'clsx';
import { message } from 'antd';

const MAIN_TABS = [
  { id: 'assets', headerLabel: '素材管理', sideLabel: '素材', icon: Video },
  { id: 'dashboard', headerLabel: '数据看板', sideLabel: '分析', icon: BarChart2 },
] as const;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNotImplemented = () => {
    message.info('功能待实现');
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full h-16 sticky top-0 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-slate-900 tracking-tight ml-2">光影中心</span>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="搜索视频名称、标签或上传者..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleNotImplemented} className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
            <Bell className="text-on-surface-variant w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button onClick={handleNotImplemented} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <HelpCircle className="text-on-surface-variant w-5 h-5" />
          </button>
          <button onClick={handleNotImplemented} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Settings className="text-on-surface-variant w-5 h-5" />
          </button>
          <button onClick={handleNotImplemented} className="ml-2 w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SideNavBar */}
        <aside className={clsx(
          "fixed left-0 top-16 bottom-0 bg-white flex flex-col py-4 border-r border-slate-200 z-40 overflow-y-auto overflow-x-hidden transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}>
          <div className="px-4 mb-6">
            <button 
              onClick={handleNotImplemented}
              className={clsx(
              "w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-medium flex items-center justify-center shadow-md hover:opacity-90 active:scale-95 transition-all",
              isSidebarOpen ? "py-3 px-4 gap-2" : "py-3 px-0 h-12"
            )}>
              <Upload className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>上传新素材</span>}
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-4">
            {isSidebarOpen && <div className="px-3 py-2 text-[10px] font-bold text-outline uppercase tracking-wider">主菜单</div>}
            {MAIN_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center rounded-lg font-medium transition-all",
                    isSidebarOpen ? "w-full gap-3 px-3 py-3 mb-1" : "w-12 h-12 justify-center mx-auto mb-2",
                    activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                  title={!isSidebarOpen ? tab.sideLabel : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isSidebarOpen && <span>{tab.sideLabel}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className={clsx(
          "flex-1 p-8 bg-slate-50 min-h-[calc(100vh-64px)] transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
