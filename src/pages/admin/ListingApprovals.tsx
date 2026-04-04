import { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, Search, Filter } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";
import axiosClient from "../../api/axiosClient";

interface Listing {
  id: string;
  title: string;
  price: number;
  addressDisplay: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
  };
  media: { originalUrl: string }[];
}

export function ListingApprovals() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get("/listings/admin/all");
      setListings(res.data?.data || []);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast("Lỗi tải danh sách quản lý tin đăng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axiosClient.patch(`/listings/${id}/admin-status`, { status: 'PUBLISHED' });
      useToastStore.getState().addToast("Đã duyệt tin đăng thành công", "success");
      setListings(listings.map(l => l.id === id ? { ...l, status: 'PUBLISHED' } : l));
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi duyệt tin", "error");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn Từ chối hoặc Ngừng đăng tin này không?")) return;
    try {
      await axiosClient.patch(`/listings/${id}/admin-status`, { status: 'REJECTED' });
      useToastStore.getState().addToast("Đã cập nhật trạng thái tin đăng", "success");
      setListings(listings.map(l => l.id === id ? { ...l, status: 'REJECTED' } : l));
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi cập nhật trạng thái tin", "error");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">Chờ duyệt</span>;
      case 'PUBLISHED':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">Đã đăng</span>;
      case 'SOLD':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">Đã bán</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">Bị từ chối</span>;
      case 'HIDDEN':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-100">Đã ẩn</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500">{status}</span>;
    }
  };

  const filtered = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.addressDisplay.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && l.status === statusFilter;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">Quản lý Bất động sản</h1>
          <p className="text-sm font-medium text-slate-500">Xem và quản lý tất cả các tin đăng trên hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm tên, địa chỉ, môi giới..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING_REVIEW">Chờ duyệt</option>
              <option value="PUBLISHED">Đã đăng</option>
              <option value="REJECTED">Bị từ chối</option>
              <option value="SOLD">Đã bán/Kết thúc</option>
              <option value="HIDDEN">Đã ẩn</option>
            </select>
          </div>
          
          <button onClick={fetchListings} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Loader2 className={isLoading ? "animate-spin" : ""} size={16} />
            Làm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-400 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">Thông tin tin đăng</th>
                <th className="px-6 py-4">Môi giới</th>
                <th className="px-6 py-4">Mức giá</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && listings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="animate-spin text-slate-400 mx-auto" size={24} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Không tìm thấy tin đăng nào.
                  </td>
                </tr>
              ) : (
                filtered.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border">
                        {listing.media?.[0]?.originalUrl ? (
                          <img src={listing.media[0].originalUrl} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">?</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 max-w-[200px] truncate">{listing.title}</div>
                        <div className="text-xs text-slate-400 max-w-[200px] truncate">{listing.addressDisplay}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {listing.user.email}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#cfb53b]">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                          <Eye size={18} />
                        </button>
                        
                        {listing.status === 'PENDING_REVIEW' && (
                          <>
                            <button 
                              onClick={() => handleApprove(listing.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Phê duyệt"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleReject(listing.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        
                        {listing.status === 'PUBLISHED' && (
                          <button 
                            onClick={() => handleReject(listing.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Ngừng đăng tin"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
