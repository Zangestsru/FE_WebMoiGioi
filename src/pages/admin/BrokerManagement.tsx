import { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Search,
  Loader2,
  CheckCircle,
  Lock,
  Eye,
  X,
  Users,
  UserCheck,
  UserX,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  RefreshCw,
} from "lucide-react";
import { userApi } from "../../api/user.api";
import { useToastStore } from "../../store/useToastStore";
import { clsx } from "clsx";
import { ImageWithFallback } from "../../components/ui/ImageWithFallback";

type BrokerStats = {
  total: number;
  active: number;
  locked: number;
  newThisMonth: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function BrokerManagement() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [stats, setStats] = useState<BrokerStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBroker, setSelectedBroker] = useState<any | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  // Fetch stats
  const fetchStats = async () => {
    try {
      setIsStatsLoading(true);
      const res = await userApi.getAdminBrokerStats();
      setStats(res.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Fetch brokers
  const fetchBrokers = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const res = await userApi.getAdminBrokers({
          page,
          limit: 10,
          search: searchTerm || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        });
        const data = res.data as any;
        setBrokers(data?.brokers || []);
        setPagination(
          data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }
        );
      } catch (err) {
        console.error(err);
        addToast("Lỗi tải danh sách môi giới", "error");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter]
  );

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBrokers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fetchBrokers]);

  // Toggle status
  const handleToggleStatus = async (broker: any) => {
    const currentStatus = broker.status;
    const newStatus = currentStatus === "ACTIVE" ? "LOCKED" : "ACTIVE";
    const confirmMsg =
      newStatus === "LOCKED"
        ? `Bạn có chắc muốn KHÓA tài khoản môi giới "${broker.profile?.displayName || broker.email}"?`
        : `Bạn có chắc muốn MỞ KHÓA tài khoản "${broker.profile?.displayName || broker.email}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setIsActionLoading(true);
      await userApi.updateBrokerStatus(broker.id.toString(), newStatus);
      addToast(
        newStatus === "LOCKED"
          ? "Đã khóa tài khoản thành công"
          : "Đã mở khóa tài khoản thành công",
        "success"
      );
      fetchBrokers(pagination.page);
      fetchStats();
      if (selectedBroker?.id === broker.id) {
        setSelectedBroker(null);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra";
      addToast(msg, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const statsCards = [
    {
      label: "Tổng Môi giới",
      value: stats?.total ?? "—",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Đang hoạt động",
      value: stats?.active ?? "—",
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Bị khóa",
      value: stats?.locked ?? "—",
      icon: UserX,
      color: "from-red-400 to-red-500",
      bgLight: "bg-red-50",
      textColor: "text-red-500",
    },
    {
      label: "Mới tháng này",
      value: stats?.newThisMonth ?? "—",
      icon: CalendarPlus,
      color: "from-violet-500 to-violet-600",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1 flex items-center gap-2">
            <Briefcase size={24} className="text-blue-600" /> Danh sách Môi giới
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Quản lý danh sách người môi giới đã được duyệt trong hệ thống.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-300"
          >
            <div
              className={clsx(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                card.bgLight
              )}
            >
              <card.icon size={22} className={card.textColor} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.label}
              </p>
              {isStatsLoading ? (
                <Loader2
                  size={20}
                  className="animate-spin text-slate-300 mt-1"
                />
              ) : (
                <p className="text-2xl font-black text-slate-800 mt-0.5">
                  {card.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Tìm theo tên, email, hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Bị khóa</option>
              <option value="BANNED">Bị cấm</option>
            </select>

            <button
              onClick={() => {
                fetchBrokers(pagination.page);
                fetchStats();
              }}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw
                className={isLoading ? "animate-spin" : ""}
                size={16}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">Thông tin</th>
                <th className="px-6 py-4">Liên hệ</th>
                {/* <th className="px-6 py-4">CCCD</th> */}
                <th className="px-6 py-4">Ngày tham gia</th>
                <th className="px-6 py-4 text-center">Tin đăng</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && brokers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2
                      className="animate-spin text-slate-400 mx-auto"
                      size={28}
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : brokers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-slate-400"
                  >
                    <Briefcase
                      className="mx-auto text-slate-300 mb-2"
                      size={32}
                    />
                    <p>Không tìm thấy môi giới nào.</p>
                  </td>
                </tr>
              ) : (
                brokers.map((broker) => {
                  return (
                    <tr
                      key={broker.id?.toString()}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={broker.profile?.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(broker.profile?.displayName || broker.email || "B")}&background=random&size=40`}
                            alt={broker.profile?.displayName || "Broker"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-100" />
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">
                              {broker.profile?.displayName || (
                                <span className="text-slate-400 italic">
                                  Chưa cập nhật
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              #{broker.id?.toString()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">
                          {broker.email || "—"}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {broker.profile?.zaloContactPhone ||
                            broker.phoneNumber ||
                            "—"}
                        </div>
                      </td>

                      {/* CCCD
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {broker.profile?.identityCardNumber || (
                          <span className="text-slate-300">—</span>
                        )}
                      </td> */}

                      {/* Join Date */}
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(broker.createdAt).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Listing Count */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          {broker._count?.listings ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full",
                            broker.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : broker.status === "LOCKED"
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                : broker.status === "BANNED"
                                  ? "bg-slate-800 text-white"
                                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                          )}
                        >
                          {broker.status === "ACTIVE" && (
                            <CheckCircle size={12} />
                          )}
                          {broker.status === "LOCKED" && <Lock size={12} />}
                          {broker.status === "ACTIVE"
                            ? "Hoạt động"
                            : broker.status === "LOCKED"
                              ? "Bị khóa"
                              : broker.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedBroker(broker)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>

                          {broker.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleToggleStatus(broker)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Khóa tài khoản"
                            >
                              <Lock size={16} />
                            </button>
                          ) : broker.status === "LOCKED" ? (
                            <button
                              onClick={() => handleToggleStatus(broker)}
                              className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                              title="Mở khóa tài khoản"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <span className="text-slate-500">
            Hiển thị{" "}
            <strong>
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            trong tổng <strong>{pagination.total}</strong> môi giới
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchBrokers(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Trước
            </button>

            {/* Page numbers */}
            {Array.from(
              { length: Math.min(pagination.totalPages, 5) },
              (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchBrokers(pageNum)}
                    className={clsx(
                      "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      pageNum === pagination.page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() => fetchBrokers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tiếp <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ─────────────────────────────────────────────── */}
      {selectedBroker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert size={20} /> Chi tiết Môi giới
              </h2>
              <button
                onClick={() => setSelectedBroker(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={
                    selectedBroker.profile?.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedBroker.profile?.displayName || selectedBroker.email || "B")}&background=4F46E5&color=fff&size=80`
                  }
                  alt={selectedBroker.profile?.displayName || "Broker"}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedBroker.profile?.displayName || "Chưa cập nhật tên"}
                  </h3>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full mt-2",
                      selectedBroker.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-red-50 text-red-700 ring-1 ring-red-200"
                    )}
                  >
                    {selectedBroker.status === "ACTIVE" ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Lock size={12} />
                    )}
                    {selectedBroker.status === "ACTIVE"
                      ? "Đang hoạt động"
                      : "Bị khóa"}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={selectedBroker.email || "—"}
                />
                <InfoCard
                  icon={Phone}
                  label="Số điện thoại"
                  value={
                    selectedBroker.profile?.zaloContactPhone ||
                    selectedBroker.phoneNumber ||
                    "—"
                  }
                />
                <InfoCard
                  icon={CreditCard}
                  label="Số CMND/CCCD"
                  value={
                    selectedBroker.profile?.identityCardNumber || "Chưa cung cấp"
                  }
                />
                <InfoCard
                  icon={CalendarPlus}
                  label="Ngày tham gia"
                  value={new Date(selectedBroker.createdAt).toLocaleDateString(
                    "vi-VN",
                    { day: "2-digit", month: "2-digit", year: "numeric" }
                  )}
                />
                <InfoCard
                  icon={FileText}
                  label="Tin đăng"
                  value={`${selectedBroker._count?.listings ?? 0} tin`}
                />
                <InfoCard
                  icon={MapPin}
                  label="Địa chỉ"
                  value={selectedBroker.profile?.address || "Chưa cập nhật"}
                />
              </div>

              {/* Bio */}
              {selectedBroker.profile?.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
                    Giới thiệu
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedBroker.profile.bio}
                  </p>
                </div>
              )}

              {/* Documents */}
              {(selectedBroker.profile?.socialLinks?.brokerLicenseUrl ||
                selectedBroker.profile?.socialLinks?.idFrontUrl ||
                selectedBroker.profile?.socialLinks?.idBackUrl) && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                      Tài liệu
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedBroker.profile?.socialLinks?.brokerLicenseUrl && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1.5">
                            Chứng chỉ hành nghề
                          </p>
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <ImageWithFallback
                              src={
                                selectedBroker.profile.socialLinks
                                  .brokerLicenseUrl
                              }
                              alt="Broker License"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {selectedBroker.profile?.socialLinks?.idFrontUrl && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1.5">
                            CMND/CCCD (Mặt trước)
                          </p>
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <ImageWithFallback
                              src={
                                selectedBroker.profile.socialLinks.idFrontUrl
                              }
                              alt="ID Front"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      {selectedBroker.profile?.socialLinks?.idBackUrl && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 mb-1.5">
                            CMND/CCCD (Mặt sau)
                          </p>
                          <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                            <ImageWithFallback
                              src={
                                selectedBroker.profile.socialLinks.idBackUrl
                              }
                              alt="ID Back"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBroker(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Đóng
              </button>
              {selectedBroker.status === "ACTIVE" ? (
                <button
                  onClick={() => handleToggleStatus(selectedBroker)}
                  disabled={isActionLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition disabled:opacity-70"
                >
                  {isActionLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  <Lock size={14} /> Khóa tài khoản
                </button>
              ) : selectedBroker.status === "LOCKED" ? (
                <button
                  onClick={() => handleToggleStatus(selectedBroker)}
                  disabled={isActionLoading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition disabled:opacity-70"
                >
                  {isActionLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  <CheckCircle size={14} /> Mở khóa
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Helper component for detail modal ──────────────────────────────────────── */
function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
