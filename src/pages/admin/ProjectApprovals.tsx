import { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, Search, Filter, Building2, MapPin } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";
import { projectApi, type ProjectSummary } from "../../api/project.api";

type AdminProject = ProjectSummary & {
  user?: {
    email: string;
    profile?: {
      displayName: string;
    };
  };
};

export function ProjectApprovals() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await projectApi.adminGetAllProjects();
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast("Lỗi tải danh sách dự án", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await projectApi.adminUpdateProjectStatus(id, "APPROVED");
      useToastStore.getState().addToast("Đã phê duyệt dự án", "success");
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approvalStatus: "APPROVED" } : p))
      );
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi phê duyệt dự án", "error");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn Từ chối duyệt dự án này không?")) return;
    try {
      await projectApi.adminUpdateProjectStatus(id, "REJECTED");
      useToastStore.getState().addToast("Đã từ chối dự án", "success");
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, approvalStatus: "REJECTED" } : p))
      );
    } catch (err) {
      useToastStore.getState().addToast("Lỗi khi từ chối dự án", "error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">Đã duyệt</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">Đã từ chối</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-600 border border-amber-200">Chờ duyệt</span>;
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.user?.profile?.displayName || p.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && p.approvalStatus === statusFilter;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">Quản lý Dự án</h1>
          <p className="text-sm font-medium text-slate-500">Xem xét và quản lý các dự án do Môi giới khởi tạo.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên dự án, môi giới..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select 
            className="w-full md:w-auto bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING_REVIEW">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-400 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">Thông tin Dự án</th>
                <th className="px-6 py-4">Môi giới</th>
                <th className="px-6 py-4">Ngày tạo</th>
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
                    Không tìm thấy dự án nào.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border bg-slate-100 shrink-0">
                        {project.media?.[0]?.originalUrl ? (
                          <img src={project.media[0].originalUrl} alt={project.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Building2 size={24} className="opacity-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{project.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {project.provinceName ? `${project.districtName ? project.districtName + ", " : ""}${project.provinceName}` : "Chưa cập nhật vị trí"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{project.user?.profile?.displayName || 'Ẩn danh'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{project.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {project.createdAt ? new Date(project.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(project.approvalStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors" title="Xem chi tiết">
                          <Eye size={18} />
                        </button>
                        {project.approvalStatus !== "APPROVED" && (
                          <button 
                            onClick={() => handleApprove(project.id)}
                            className="p-2 text-slate-500 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                            title="Phê duyệt dự án"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {project.approvalStatus !== "REJECTED" && (
                          <button 
                            onClick={() => handleReject(project.id)}
                            className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Từ chối dự án"
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
