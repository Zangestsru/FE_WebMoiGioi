import { useEffect, useState } from "react";
import { Flag, CheckCircle, XCircle, ExternalLink, Clock } from "lucide-react";
import { getAdminReports, updateReportStatus, type ReportFilterResponse, ReportReason } from "../../api/report.api";
import { useToastStore } from "../../store/useToastStore";
import { Link } from "react-router-dom";

const REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.FAKE_PRICE]: "Giá không đúng thực tế",
  [ReportReason.SOLD]: "Bất động sản đã bán/cho thuê",
  [ReportReason.WRONG_IMAGE]: "Hình ảnh không đúng thực tế",
  [ReportReason.SCAM]: "Có dấu hiệu lừa đảo",
  [ReportReason.OTHER]: "Lý do khác",
};

export function ReportApprovals() {
  const [reports, setReports] = useState<ReportFilterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const addToast = useToastStore((state) => state.addToast);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getAdminReports();
      setReports(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách báo cáo:", error);
      addToast("Không thể tải danh sách báo cáo", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: 'VERIFIED' | 'REJECTED') => {
    if (!window.confirm(status === 'VERIFIED' ? "Xác nhận vi phạm? Mọi người sẽ không thấy bài đăng này nữa." : "Từ chối báo cáo?")) {
      return;
    }
    
    try {
      setActionLoading(reportId);
      await updateReportStatus(reportId, status);
      addToast("Cập nhật thành công", "success");
      fetchReports();
    } catch (error: any) {
      addToast(error?.response?.data?.message || "Có lỗi xảy ra", "error");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Báo cáo</h1>
          <p className="text-sm text-slate-500 mt-1">Duyệt các báo cáo vi phạm từ người dùng</p>
        </div>
        <div className="bg-red-50 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-md">
            <Flag size={20} className="text-red-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-red-700 leading-none">
              {reports.filter(r => r.status === 'PENDING').length}
            </div>
            <div className="text-xs text-red-600 font-medium">Chờ duyệt</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Bài đăng</th>
                <th className="px-6 py-4">Người kiện</th>
                <th className="px-6 py-4">Căn cứ / Mô tả</th>
                <th className="px-6 py-4">Kết quả</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <Flag size={32} className="mx-auto text-slate-300 mb-3" />
                    Không có bất kỳ báo cáo nào.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 align-top w-[30%]">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800 line-clamp-2 leading-snug">
                          {report.listing.title}
                        </span>
                        <Link 
                          to={`/du-an/${report.listingId}`} 
                          target="_blank" 
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-xs mt-2 w-max font-medium bg-blue-50 px-2.5 py-1 rounded-md"
                        >
                          Xem trực tiếp <ExternalLink size={12} />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-slate-800">{report.reporter.profile?.displayName || "Nặc danh"}</div>
                      <div className="text-slate-500 text-xs mt-1">{report.reporter.email || "Không rõ email"}</div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-3 font-medium">
                        <Clock size={12} /> {new Date(report.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 text-red-700 font-semibold text-[11px] uppercase border border-red-100 mb-2">
                        <Flag size={10} />
                        {REASON_LABELS[report.reasonCode]}
                      </div>
                      {report.description && (
                        <div className="text-slate-600 text-xs leading-relaxed italic bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                          "{report.description}"
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex px-2.5 py-1 text-[11px] uppercase font-bold rounded-full ${
                        report.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        report.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      {report.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(report.id, 'VERIFIED')}
                            disabled={actionLoading === report.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200 disabled:opacity-50"
                            title="Xác nhận vi phạm và xóa bài"
                          >
                            <CheckCircle size={14} /> Chấp thuận
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(report.id, 'REJECTED')}
                            disabled={actionLoading === report.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 disabled:opacity-50"
                            title="Bỏ qua báo cáo này"
                          >
                            <XCircle size={14} /> Từ chối
                          </button>
                        </div>
                      )}
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
