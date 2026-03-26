import React, { useState } from 'react';
import { Search, Bell, HelpCircle, Settings, Upload, Video, BarChart2, Tag, Trash2, User, Menu } from 'lucide-react';
import { useAppStore } from '../store';
import clsx from 'clsx';
import { message } from 'antd';

const MAIN_TABS = [
  { id: 'assets', headerLabel: '素材管理', sideLabel: '素材', icon: Video },
  { id: 'dashboard', headerLabel: '数据看板', sideLabel: '分析', icon: BarChart2 },
] as const;

const TOOLBAR_ITEMS = [
  { id: 'notifications', icon: Bell, hasBadge: true, hideOnMobile: true },
  { id: 'help', icon: HelpCircle, hideOnMobile: true },
  { id: 'settings', icon: Settings, hideOnMobile: false },
] as const;

/**
 * 核心布局组件
 * 包含顶部导航栏、侧边栏以及主内容区域。
 * 支持响应式设计：在移动端自动切换为抽屉式侧边栏。
 */
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useAppStore();
  // 桌面端侧边栏折叠状态
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // 移动端侧边栏显示状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNotImplemented = () => {
    message.info('功能待实现');
  };

  /**
   * 切换侧边栏状态
   * 移动端切换抽屉，桌面端切换折叠
   */
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="w-full h-16 sticky top-0 z-50 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight ml-1 md:ml-2 whitespace-nowrap">光影中心</span>
        </div>
        
        {/* 搜索框区域 */}
        <div className="flex items-center gap-4 flex-1 max-w-md mx-2 md:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4 md:w-5 md:h-5" />
            <input
              className="w-full pl-9 md:pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-primary/20"
              placeholder="搜索视频名称..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 右侧工具栏 */}
        <div className="flex items-center gap-1 md:gap-3">
          {TOOLBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={handleNotImplemented} 
                className={clsx(
                  "p-2 hover:bg-slate-50 rounded-full transition-colors relative",
                  item.hideOnMobile && "hidden sm:block"
                )}
              >
                <Icon className="text-on-surface-variant w-5 h-5" />
                {'hasBadge' in item && item.hasBadge && <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>}
              </button>
            );
          })}
          <button onClick={handleNotImplemented} className="ml-1 md:ml-2 w-8 h-8 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* 移动端遮罩层 */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 侧边导航栏 */}
        <aside className={clsx(
          "fixed left-0 top-16 bottom-0 bg-white flex flex-col py-4 border-r border-slate-200 z-50 overflow-y-auto overflow-x-hidden transition-all duration-300",
          // 桌面端逻辑：控制宽度
          "md:translate-x-0",
          isSidebarOpen ? "md:w-64" : "md:w-20",
          // 移动端逻辑：控制位移和宽度
          isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}>
          {/* 上传按钮 */}
          <div className="px-4 mb-6">
            <button 
              onClick={handleNotImplemented}
              className={clsx(
              "w-full bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-medium flex items-center justify-center shadow-md hover:opacity-90 active:scale-95 transition-all",
              (isSidebarOpen || isMobileMenuOpen) ? "py-3 px-4 gap-2" : "py-3 px-0 h-12"
            )}>
              <Upload className="w-5 h-5 shrink-0" />
              {(isSidebarOpen || isMobileMenuOpen) && <span>上传新素材</span>}
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 space-y-1 px-4">
            {(isSidebarOpen || isMobileMenuOpen) && <div className="px-3 py-2 text-[10px] font-bold text-outline uppercase tracking-wider">主菜单</div>}
            {MAIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const isOpen = isSidebarOpen || isMobileMenuOpen;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // 移动端点击后自动收起
                    if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                  }}
                  className={clsx(
                    "flex items-center rounded-lg font-medium transition-all",
                    isOpen ? "w-full gap-3 px-3 py-3 mb-1" : "w-12 h-12 justify-center mx-auto mb-2",
                    activeTab === tab.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                  title={!isOpen ? tab.sideLabel : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{tab.sideLabel}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className={clsx(
          "flex-1 p-4 md:p-8 bg-slate-50 min-h-[calc(100vh-64px)] transition-all duration-300",
          "ml-0", // 移动端默认无边距
          isSidebarOpen ? "md:ml-64" : "md:ml-20" // 桌面端根据侧边栏宽度调整边距
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
