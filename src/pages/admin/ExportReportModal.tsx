import { useState } from 'react';
import { FileSpreadsheet, X, Download, CheckCircle2, Loader2, Building2, Users, ListChecks, LayoutDashboard } from 'lucide-react';
import { reportApi, type ReportType } from '../../api/report.api';

interface ReportOption {
  id: ReportType;
  label: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  sheetName: string;
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    id: 'properties',
    label: 'Báo cáo Bất động sản',
    description: 'ID, tiêu đề, loại, địa chỉ, giá, diện tích, trạng thái, chủ sở hữu',
    icon: Building2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    sheetName: 'Properties',
  },
  {
    id: 'users',
    label: 'Báo cáo Người dùng',
    description: 'ID, họ tên, email/SĐT, vai trò, ngày đăng ký, trạng thái',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
    sheetName: 'Users',
  },
  {
    id: 'listings',
    label: 'Báo cáo Tin đăng',
    description: 'ID tin, người đăng, lượt yêu thích, trạng thái duyệt, ngày đăng',
    icon: ListChecks,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    sheetName: 'Listings',
  },
  {
    id: 'summary',
    label: 'Báo cáo Tổng hợp',
    description: 'Tổng user, tổng BĐS, top BĐS yêu thích, tổng tin đăng tháng này',
    icon: LayoutDashboard,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    sheetName: 'Summary',
  },
];

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportReportModal({ isOpen, onClose }: ExportReportModalProps) {
  const [selected, setSelected] = useState<Set<ReportType>>(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleOption = (id: ReportType) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setError(null);
    setSuccess(false);
  };

  const selectAll = () => {
    if (selected.size === REPORT_OPTIONS.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(REPORT_OPTIONS.map((o) => o.id)));
    }
  };

  const handleExport = async () => {
    if (selected.size === 0) {
      setError('Vui lòng chọn ít nhất một loại báo cáo');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const blob = await reportApi.exportReport(Array.from(selected));

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      a.href = url;
      a.download = `BaoCao_${dateStr}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSelected(new Set());
      }, 1500);
    } catch (err: any) {
      console.error('Export error:', err);
      setError('Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const isAllSelected = selected.size === REPORT_OPTIONS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileSpreadsheet size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Xuất Báo cáo Excel</h2>
                <p className="text-blue-100 text-sm mt-0.5">Chọn loại báo cáo bạn muốn xuất</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Select all */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600">
              Đã chọn {selected.size}/{REPORT_OPTIONS.length} báo cáo
            </span>
            <button
              onClick={selectAll}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {REPORT_OPTIONS.map((option) => {
              const isChecked = selected.has(option.id);
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isChecked
                      ? `${option.bgColor} ring-2 ring-offset-1 ring-blue-400/30`
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 p-2.5 rounded-lg ${
                      isChecked ? 'bg-white shadow-sm' : 'bg-slate-100'
                    }`}
                  >
                    <Icon size={20} className={isChecked ? option.color : 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                        {option.label}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                        isChecked ? 'bg-white/80 text-slate-500' : 'bg-slate-100 text-slate-400'
                      }`}>
                        Sheet: {option.sheetName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{option.description}</p>
                  </div>
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {isChecked && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <span className="text-red-400">⚠</span>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              Xuất báo cáo thành công! Đang tải xuống...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={loading || selected.size === 0}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download size={16} />
                Xuất Excel ({selected.size})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
