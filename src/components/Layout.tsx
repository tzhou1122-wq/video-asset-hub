import React from 'react';
import { Search, Bell, HelpCircle, Settings, Upload, Video, BarChart2, Tag, Archive, Trash2, User } from 'lucide-react';
import { useAppStore } from '../store';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full h-16 sticky top-0 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-slate-900 tracking-tight">光影台账</span>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('assets')}
              className={clsx(
                "h-16 flex items-center transition-colors font-semibold border-b-2",
                activeTab === 'assets' ? "text-blue-600 border-blue-600" : "text-slate-600 border-transparent hover:text-blue-500"
              )}
            >
              素材管理
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={clsx(
                "h-16 flex items-center transition-colors font-semibold border-b-2",
                activeTab === 'dashboard' ? "text-blue-600 border-blue-600" : "text-slate-600 border-transparent hover:text-blue-500"
              )}
            >
              数据看板
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4 flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="搜索资产名称、标签或上传者..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
            <Bell className="text-on-surface-variant w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <HelpCircle className="text-on-surface-variant w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Settings className="text-on-surface-variant w-5 h-5" />
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* SideNavBar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-slate-50 flex flex-col py-4 border-r border-slate-100 z-40 overflow-y-auto">
          <div className="px-4 mb-6">
            <button className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all">
              <Upload className="w-5 h-5" />
              上传新素材
            </button>
          </div>
          <nav className="flex-1 space-y-1">
            <div className="px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-wider">主菜单</div>
            <button
              onClick={() => setActiveTab('assets')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-all",
                activeTab === 'assets' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-200/50"
              )}
            >
              <Video className="w-5 h-5" />
              素材
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all",
                activeTab === 'dashboard' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-200/50"
              )}
            >
              <BarChart2 className="w-5 h-5" />
              分析
            </button>
            <div className="px-6 py-4 mt-4 border-t border-slate-200/60">
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">管理</div>
              <button className="w-full text-slate-600 hover:bg-slate-200/50 flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all">
                <HelpCircle className="w-5 h-5" />
                帮助
              </button>
              <button className="w-full text-slate-600 hover:bg-slate-200/50 flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all">
                <Archive className="w-5 h-5" />
                归档
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="ml-64 flex-1 p-8 bg-surface min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};
