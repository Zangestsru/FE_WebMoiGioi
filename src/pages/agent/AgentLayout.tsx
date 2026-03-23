import { Outlet } from 'react-router-dom';
import { AgentSidebar } from './components/AgentSidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { Search, Bell, HelpCircle } from 'lucide-react';

export function AgentLayout() {
  const { user } = useAuthStore();
  
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-primary">
      <AgentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-[72px] bg-white border-b border-gray-100/80 flex items-center justify-between px-8 shrink-0 z-10 w-full animate-in fade-in duration-300">
            {/* Left side: Breadcrumb structure */}
            <div className="flex items-center gap-2 text-[14px] font-bold">
                <span className="text-gray-400">Agent</span>
                <span className="text-gray-300 text-[12px] font-normal px-1">/</span>
                <span className="text-gray-900">Dashboard</span>
            </div>

            {/* Right side group */}
            <div className="flex items-center gap-5">
                {/* Search Bar - pill shape */}
                <div className="hidden lg:flex items-center bg-[#F3F4F6] rounded-full px-4 py-2.5 w-[240px] border border-gray-100 hover:bg-gray-100 transition-all cursor-text">
                    <Search size={16} className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full placeholder-gray-400" />
                </div>

                {/* Icon Buttons */}
                <button className="relative text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                    <Bell size={20} className="stroke-black stroke-[2]" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer">
                    <HelpCircle size={20} className="stroke-black stroke-[2]" />
                </button>
                
                <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-[13px] font-black text-gray-900 tracking-tight group-hover:text-[#1E88E5] transition-colors">{user?.email?.split('@')[0] || 'Agent'}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-yellow-500 flex items-center justify-center overflow-hidden shadow-inner text-white font-black text-sm border-2 border-white cursor-pointer select-none">
                        {user?.email?.[0]?.toUpperCase()}
                    </div>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:px-8 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
