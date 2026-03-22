import { useState, useEffect } from "react";
import { Search, Filter, Eye, CheckCircle, XCircle, X, Download } from "lucide-react";
import { clsx } from "clsx";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";
import axiosClient from "../../api/axiosClient";
import { useToastStore } from "../../store/useToastStore";

// Mock Data
// Mock Data removed.

export function BrokerApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get("/user/admin/pending-brokers");
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "Đã duyệt" | "Đã từ chối") => {
    try {
      const approve = action === "Đã duyệt";
      await axiosClient.patch(`/user/admin/approve-broker/${id}`, { approve });

      useToastStore.getState().addToast(approve ? "Đã duyệt Môi giới" : "Đã từ chối", "success");
      setRequests(requests.filter(req => req.id !== id));
      setSelectedRequest(null);
      setRejectReason("");
      setIsRejecting(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yêu cầu Duyệt Môi giới</h1>
          <p className="text-sm text-slate-500 mt-1">Xem xét và quản lý các đơn đăng ký trở thành môi giới của người dùng.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} />
            Lọc
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thông tin Người dùng</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày Đăng ký</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kinh nghiệm</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chứng chỉ</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">Đang tải biểu mẫu...</td></tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback 
                        src={req.profile?.avatarUrl || "https://images.unsplash.com/photo-1625502709763-f5f3880c17ba?ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHN1aXR8ZW58MXx8fHwxNzc0MTQxNTg2fDA"} 
                        alt={req.profile?.displayName || req.email} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-medium text-slate-900">{req.profile?.displayName || "Môi giới"}</div>
                        <div className="text-xs text-slate-500">{req.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(req.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">Chi tiết chi tiết</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group/img cursor-pointer w-16 h-12 rounded-md overflow-hidden border border-slate-200">
                      <ImageWithFallback
                        src={req.profile?.socialLinks?.brokerLicenseUrl || "https://images.unsplash.com/photo-1768611873487-67930d5db1b8"}
                        alt="License Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Eye size={16} className="text-white" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {(req.status === 'PENDING_VERIFICATION' || req.status === 'Chờ duyệt') ? (
                      <>
                        <button
                          onClick={() => { setSelectedRequest(req); setIsRejecting(false); }}
                          className="inline-flex items-center justify-center p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Xem Chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "Đã duyệt")}
                          className="inline-flex items-center justify-center p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                          title="Duyệt"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedRequest(req); setIsRejecting(true); }}
                          className="inline-flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Từ chối"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { setSelectedRequest(req); setIsRejecting(false); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye size={16} /> Xem
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">Không tìm thấy yêu cầu phê duyệt nào.</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
          <span className="text-slate-500">Hiển thị 1 đến {requests.length} trong số {requests.length} mục</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white text-slate-400 cursor-not-allowed">Trước</button>
            <button className="px-3 py-1 border border-slate-300 rounded-md bg-white text-slate-600 hover:bg-slate-50">Tiếp</button>
          </div>
        </div>
      </div>

      {/* View/Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm admin-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-900">Chi tiết Đơn đăng ký Môi giới</h2>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* Applicant Info */}
              <div className="flex items-start gap-4">
                <ImageWithFallback 
                  src={selectedRequest.profile?.avatarUrl || "https://images.unsplash.com/photo-1625502709763-f5f3880c17ba"} 
                  alt={selectedRequest.profile?.displayName || selectedRequest.email} 
                  className="w-16 h-16 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedRequest.profile?.displayName || "Môi giới"}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><strong className="text-slate-900">Email:</strong> {selectedRequest.email}</span>
                    <span className="flex items-center gap-1.5"><strong className="text-slate-900">SĐT:</strong> {selectedRequest.profile?.zaloContactPhone || "N/A"}</span>
                    <span className="flex items-center gap-1.5"><strong className="text-slate-900">Ngày ĐK:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Thông tin Nghề nghiệp</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Mô tả lý lịch (Kinh nghiệm & Khu vực)</p>
                    <p className="font-semibold text-slate-900">{selectedRequest.profile?.bio || "Chưa cung cấp"}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Tài liệu đã Nộp</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Số CMND/CCCD: <span className="font-normal">{selectedRequest.profile?.identityCardNumber || "CCCD"}</span></p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">Chứng chỉ Hành nghề Môi giới / Link ảnh</p>
                    </div>
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4">
                      <ImageWithFallback
                        src={selectedRequest.profile?.socialLinks?.brokerLicenseUrl || "https://images.unsplash.com/photo-1768611873487-67930d5db1b8"}
                        alt="License Document"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {selectedRequest.profile?.socialLinks?.idFrontUrl && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Ảnh CMND/CCCD (Mặt trước)</p>
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4">
                        <ImageWithFallback
                          src={selectedRequest.profile.socialLinks.idFrontUrl}
                          alt="ID Front"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {selectedRequest.profile?.socialLinks?.idBackUrl && (
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Ảnh CMND/CCCD (Mặt sau)</p>
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <ImageWithFallback
                          src={selectedRequest.profile.socialLinks.idBackUrl}
                          alt="ID Back"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reject Reason Form */}
              {isRejecting && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 admin-fade-in">
                  <label className="block text-sm font-medium text-red-900 mb-2">Lý do Từ chối *</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-white border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-24"
                    placeholder="Vui lòng ghi rõ lý do từ chối đơn đăng ký này. Lý do này sẽ được gửi tới người dùng..."
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
              >
                Hủy
              </button>
              
              {(selectedRequest.status === 'PENDING_VERIFICATION' || selectedRequest.status === 'Chờ duyệt') && (
                isRejecting ? (
                  <button 
                    onClick={() => handleAction(selectedRequest.id, "Đã từ chối")}
                    disabled={!rejectReason.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận Từ chối
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => setIsRejecting(true)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                    >
                      Từ chối Đơn
                    </button>
                    <button 
                      onClick={() => handleAction(selectedRequest.id, "Đã duyệt")}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Duyệt Môi giới
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
