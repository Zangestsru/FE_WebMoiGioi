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

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      // We will create this backend endpoint next
      const res = await axiosClient.get("/listings/admin/pending");
      setListings(res.data?.data || []);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast("Lỗi tải danh sách duyệt tin", "error");
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
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi duyệt tin", "error");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn Từ chối duyệt tin này không?")) return;
    try {
      await axiosClient.patch(`/listings/${id}/admin-status`, { status: 'SOLD' }); // Or a REJECTED model if you want
      useToastStore.getState().addToast("Đã từ chối tin đăng", "success");
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi từ chối tin", "error");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filtered = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.addressDisplay.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">Duyệt Tin Đăng Bất Động Sản</h1>
          <p className="text-sm font-medium text-slate-500">Xem xét và phê duyệt các tin đăng mới từ Môi giới.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm tin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter size={16} />
            Bộ lọc
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="animate-spin text-slate-400 mx-auto" size={24} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Không có tin đăng nào cần duyệt.
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
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        Chờ duyệt
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleApprove(listing.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleReject(listing.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
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
