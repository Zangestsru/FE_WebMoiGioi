import { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight, Home, Trash2, Edit3, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { listingApi } from '../../api/listing.api';
import type { Listing } from '../../types/listing.types';
import { useToastStore } from '../../store/useToastStore';

export function AgentDashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await listingApi.getMyListings();
      setListings(res.data || []);
    } catch(err) {
      console.error(err);
      useToastStore.getState().addToast("Lỗi tải danh sách tin đăng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tin đăng này không? Hành động này không thể hoàn tác.")) return;
    try {
      await listingApi.deleteListing(id);
      useToastStore.getState().addToast("Xoá tin đăng thành công", "success");
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi xoá tin đăng", "error");
    }
  };

  const handleStatusChange = async () => {
      useToastStore.getState().addToast("Trạng thái duyệt tin do Admin quản lý. Bạn không thể tự thay đổi.", "warning");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Stats calculation
  const totalListings = listings.length;
  const activeValue = listings.filter(l => l.status === 'PUBLISHED').reduce((sum, l) => sum + Number(l.price), 0);
  // Default Views for demo
  const totalViews = totalListings * 310;

  return (
    <div className="font-primary max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-[32px] font-black tracking-tight text-gray-900 mb-1">Quản lý tin đăng</h1>
           <p className="text-[15px] font-bold text-gray-400">Quản lý và theo dõi danh sách bất động sản của bạn</p>
        </div>
        <button 
           onClick={() => navigate('/agent/post')}
           className="bg-[#f0dc5a] hover:bg-[#e0cc4a] text-black px-6 py-3.5 rounded-full font-bold text-[15px] transition-all shadow-sm flex items-center gap-2 w-fit">
          + Thêm tin mới
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
            <div className="w-[60px] h-[60px] rounded-full bg-blue-50 flex items-center justify-center shrink-0 mr-4">
               <Home className="text-blue-500" size={28} />
            </div>
            <div>
              <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Số tin đăng</p>
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black text-gray-900 leading-none">{totalListings}</span>
              </div>
            </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
            <div className="w-[60px] h-[60px] rounded-full bg-yellow-50 flex items-center justify-center shrink-0 mr-4">
               <span className="text-yellow-500 font-bold text-xl">đ</span>
            </div>
            <div>
              <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Tổng giá trị</p>
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black text-gray-900 leading-none">{formatPrice(activeValue)}</span>
              </div>
            </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
            <div className="w-[60px] h-[60px] rounded-full bg-pink-50 flex items-center justify-center shrink-0 mr-4">
               <Eye className="text-pink-500" size={28} />
            </div>
            <div>
              <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Tổng lượt xem</p>
              <div className="flex items-center gap-3">
                <span className="text-[28px] font-black text-gray-900 leading-none">{totalViews}</span>
              </div>
            </div>
        </div>
      </div>

      {/* LISTINGS TABLE/LIST */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden text-sm">
         <div className="grid grid-cols-[100px_minmax(200px,1fr)_120px_120px_100px_100px] bg-gray-100 py-4 px-6 text-[13px] font-black text-gray-600 uppercase tracking-widest gap-4 hidden md:grid">
            <div>Hình ảnh</div>
            <div className="ml-4">Thông tin cơ bản</div>
            <div>Mức giá</div>
            <div>Trạng thái</div>
            <div>Lượt xem</div>
            <div className="text-right">Thao tác</div>
         </div>

         <div className="divide-y divide-gray-100 min-h-[300px] relative">
            {isLoading ? (
               <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                 <Loader2 className="animate-spin text-gray-400" size={32} />
               </div>
            ) : listings.length === 0 ? (
               <div className="p-12 text-center text-gray-400 font-bold">Bạn chưa có tin đăng nào.</div>
            ) : (
                listings.map((prop) => (
                    <div key={prop.id} className="grid grid-cols-1 md:grid-cols-[100px_minmax(200px,1fr)_120px_120px_100px_100px] items-center p-6 md:py-4 gap-4 hover:bg-gray-50 transition-colors">
                        <div className="h-[80px] md:h-[60px] rounded-xl overflow-hidden shadow-sm">
                            {prop.media && prop.media.length > 0 ? (
                                <img src={prop.media[0].originalUrl} alt={prop.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center border border-gray-300">
                                    <Home className="text-gray-400" size={20} />
                                </div>
                            )}
                        </div>
                        <div className="md:ml-4 flex flex-col justify-center">
                            <span className="font-bold text-gray-900 text-[15px] truncate max-w-[250px]" title={prop.title}>{prop.title}</span>
                            <span className="font-bold text-gray-400 text-[13px] mt-0.5 truncate max-w-[250px]" title={prop.addressDisplay}>{prop.addressDisplay}</span>
                        </div>
                        <div className="font-bold text-[#cfb53b] text-[15px]">{formatPrice(prop.price)}</div>
                        <div className="flex items-center">
                            <button 
                                onClick={() => handleStatusChange()}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-colors border
                                    ${prop.status === 'PUBLISHED' ? 'bg-[#bdfbc8] text-[#1caf40] border-[#bdfbc8] hover:bg-white' : 
                                      prop.status === 'SOLD' ? 'bg-gray-200 text-gray-600 border-gray-200 hover:bg-white' : 
                                      prop.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-600 border-amber-100 hover:bg-white' :
                                      'bg-gray-100 text-gray-600 border-gray-100'}
                                `}
                            >
                                {prop.status === 'PUBLISHED' ? 'Đã duyệt' : prop.status === 'SOLD' ? 'Đã bán' : prop.status === 'PENDING_REVIEW' ? 'Chưa duyệt' : prop.status}
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 text-[15px]">{prop.views || 310}</span>
                            <span className="font-bold text-gray-400 text-[11px] uppercase tracking-wider mt-0.5">Toàn bộ</span>
                        </div>
                        <div className="flex justify-start md:justify-end gap-2 text-right">
                           <button 
                              onClick={() => navigate(`/agent/edit/${prop.id}`)}
                              className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                           >
                              <Edit3 size={18} />
                           </button>
                           <button 
                             onClick={() => handleDelete(prop.id)}
                             className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                    </div>
                ))
            )}
         </div>

         {/* PAGINATION */}
         {!isLoading && listings.length > 0 && (
            <div className="flex items-center justify-between p-6 bg-gray-50/50 border-t border-gray-100">
                <div className="font-bold text-gray-500 text-[14px]">
                Hiển thị <span className="text-gray-900">{listings.length}</span> tin đăng
                </div>
                
                <div className="flex gap-2">
                    <button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-400 text-white font-bold transition-colors">1</button>
                    <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
         )}
      </div>
    </div>
  );
}
