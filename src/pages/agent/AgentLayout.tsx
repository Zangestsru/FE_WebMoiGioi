import { Outlet } from 'react-router-dom';
import { AgentSidebar } from './components/AgentSidebar';
import { useAuthStore } from '../../store/useAuthStore';

export function AgentLayout() {
  const { user } = useAuthStore();
  
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-primary">
      <AgentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-[72px] bg-white md:bg-transparent flex items-center justify-end px-8 shrink-0 z-10 w-full pt-4 md:pt-6">
            <div className="flex items-center gap-3 bg-[#ffb7b2] bg-opacity-30 p-1.5 pl-4 pr-1.5 rounded-full border border-red-100/50 shadow-sm cursor-pointer hover:bg-opacity-50 transition">
                <div className="text-right">
                    <p className="text-[13px] font-black text-gray-900 tracking-tight">{user?.email?.split('@')[0] || 'Agent'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden shadow-inner">
                    <span className="text-white font-bold text-xs">{user?.email?.[0]?.toUpperCase()}</span>
                    {/* If using avatar image:
                      <img src="/avatar-placeholder.png" alt="avatar" className="w-full h-full object-cover" /> 
                    */}
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
