import { useState, useEffect } from 'react';
import { FolderKanban, Trash2, Edit3, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { projectApi, type ProjectSummary } from '../../api/project.api';
import { useToastStore } from '../../store/useToastStore';

const APPROVAL_LABELS: Record<string, { label: string; cls: string }> = {
  PENDING_REVIEW: { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-600 border-amber-100' },
  APPROVED: { label: 'Đã duyệt', cls: 'bg-[#bdfbc8] text-[#1caf40] border-[#bdfbc8]' },
  REJECTED: { label: 'Từ chối', cls: 'bg-red-100 text-red-600 border-red-100' },
};

export function AgentProjectDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await projectApi.getMyProjects();
      setProjects(res.data || []);
    } catch {
      useToastStore.getState().addToast('Lỗi tải danh sách dự án', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá dự án này? Hành động này không thể hoàn tác.')) return;
    try {
      await projectApi.deleteProject(id);
      useToastStore.getState().addToast('Xoá dự án thành công', 'success');
      setProjects(projects.filter(p => p.id !== id));
    } catch {
      useToastStore.getState().addToast('Lỗi khi xoá dự án', 'error');
    }
  };

  return (
    <div className="font-primary max-w-[1200px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[32px] font-black tracking-tight text-gray-900 mb-1">Quản lý dự án</h1>
          <p className="text-[15px] font-bold text-gray-400">Quản lý các dự án bất động sản của bạn</p>
        </div>
        <button
          onClick={() => navigate('/agent/project-post')}
          className="bg-[#f0dc5a] hover:bg-[#e0cc4a] text-black px-6 py-3.5 rounded-full font-bold text-[15px] transition-all shadow-sm flex items-center gap-2 w-fit"
        >
          + Thêm dự án mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
          <div className="w-[60px] h-[60px] rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mr-4">
            <FolderKanban className="text-indigo-500" size={28} />
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Tổng dự án</p>
            <span className="text-[28px] font-black text-gray-900 leading-none">{projects.length}</span>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
          <div className="w-[60px] h-[60px] rounded-full bg-green-50 flex items-center justify-center shrink-0 mr-4">
            <span className="text-green-500 font-bold text-xl">✓</span>
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Đã duyệt</p>
            <span className="text-[28px] font-black text-gray-900 leading-none">
              {projects.filter(p => p.approvalStatus === 'APPROVED').length}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex items-center shadow-sm">
          <div className="w-[60px] h-[60px] rounded-full bg-amber-50 flex items-center justify-center shrink-0 mr-4">
            <span className="text-amber-500 font-bold text-xl">⏳</span>
          </div>
          <div>
            <p className="text-[13px] font-bold tracking-wide text-gray-400 uppercase mb-1">Chờ duyệt</p>
            <span className="text-[28px] font-black text-gray-900 leading-none">
              {projects.filter(p => p.approvalStatus === 'PENDING_REVIEW').length}
            </span>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden text-sm">
        <div className="grid grid-cols-[100px_minmax(200px,1fr)_120px_120px_100px] bg-gray-100 py-4 px-6 text-[13px] font-black text-gray-600 uppercase tracking-widest gap-4 hidden md:grid">
          <div>Hình ảnh</div>
          <div className="ml-4">Thông tin dự án</div>
          <div>Trạng thái</div>
          <div>Số tin đăng</div>
          <div className="text-right">Thao tác</div>
        </div>

        <div className="divide-y divide-gray-100 min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-bold">Bạn chưa có dự án nào.</div>
          ) : (
            projects.map((project) => {
              const approval = APPROVAL_LABELS[project.approvalStatus] || APPROVAL_LABELS.PENDING_REVIEW;
              const coverImg = project.media?.find(m => m.isPrimary)?.originalUrl || project.media?.[0]?.originalUrl;
              return (
                <div key={project.id} className="grid grid-cols-1 md:grid-cols-[100px_minmax(200px,1fr)_120px_120px_100px] items-center p-6 md:py-4 gap-4 hover:bg-gray-50 transition-colors">
                  <div className="h-[80px] md:h-[60px] rounded-xl overflow-hidden shadow-sm">
                    {coverImg ? (
                      <img src={coverImg} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center border border-gray-300">
                        <FolderKanban className="text-gray-400" size={20} />
                      </div>
                    )}
                  </div>
                  <div className="md:ml-4 flex flex-col justify-center">
                    <span className="font-bold text-gray-900 text-[15px] truncate max-w-[300px]" title={project.name}>{project.name}</span>
                    <span className="font-bold text-gray-400 text-[13px] mt-0.5 truncate max-w-[300px]" title={project.addressText || ''}>
                      {project.addressText || project.wardName || project.provinceName || '—'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${approval.cls}`}>
                      {approval.label}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-[15px]">{project._count?.listings ?? 0}</span>
                    <span className="font-bold text-gray-400 text-[11px] uppercase tracking-wider mt-0.5">tin đăng</span>
                  </div>
                  <div className="flex justify-start md:justify-end gap-2">
                    <button
                      onClick={() => navigate(`/agent/project-edit/${project.id}`)}
                      className="text-blue-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isLoading && projects.length > 0 && (
          <div className="flex items-center justify-between p-6 bg-gray-50/50 border-t border-gray-100">
            <div className="font-bold text-gray-500 text-[14px]">
              Hiển thị <span className="text-gray-900">{projects.length}</span> dự án
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
