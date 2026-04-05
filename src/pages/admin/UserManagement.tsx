import { useState, useEffect } from "react";
import { Users, Search, Loader2, ShieldAlert, CheckCircle, Ban, Edit2, Lock, RefreshCw } from "lucide-react";
import { userApi } from "../../api/user.api";
import type { User, UserProfile } from "../../types/user.types";
import { useToastStore } from "../../store/useToastStore";
import { clsx } from "clsx";

type UserWithProfile = any; // Will use any for now to avoid strict type issues with nested profile

export function UserManagement() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithProfile | null>(null);
  
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const addToast = useToastStore((state) => state.addToast);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await userApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      addToast("Lỗi tải danh sách người dùng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: UserWithProfile) => {
    setEditingUser(user);
    setEditRole(user.accountType);
    setEditStatus(user.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsSubmitting(true);
      await userApi.updateUser(editingUser.id.toString(), { 
        accountType: editRole,
        status: editStatus
      });
      addToast("Cập nhật thông tin người dùng thành công", "success");
      handleCloseModal();
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async (user: UserWithProfile) => {
    if (!window.confirm(`Bạn có chắc chắn muốn KHÓA (xóa mềm) tài khoản của ${user.email || user.phoneNumber}?`)) return;
    try {
      await userApi.updateUser(user.id.toString(), { status: "LOCKED" });
      addToast("Đã khóa tài khoản thành công", "success");
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Lỗi khi khóa người dùng";
      addToast(msg, "error");
    }
  };

  const filtered = users.filter(u => {
    const term = searchTerm.toLowerCase();
    const emailMatch = u.email?.toLowerCase().includes(term);
    const phoneMatch = u.phoneNumber?.toLowerCase().includes(term);
    const nameMatch = u.profile?.displayName?.toLowerCase().includes(term);
    return emailMatch || phoneMatch || nameMatch;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1 flex items-center gap-2">
            <Users size={24} className="text-blue-600" /> Quản lý Người dùng
          </h1>
          <p className="text-sm font-medium text-slate-500">Quản lý tài khoản, quyền hạn và trạng thái của người dùng.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo email, sđt, hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className={isLoading ? "animate-spin" : ""} size={16} />
            Làm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-500 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">ID / Loại TK</th>
                <th className="px-6 py-4">Thông tin liên hệ</th>
                <th className="px-6 py-4">Tên hiển thị</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="animate-spin text-slate-400 mx-auto" size={24} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id?.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-500 text-xs mb-1">#{u.id?.toString()}</div>
                      <span className={clsx(
                        "px-2 py-0.5 text-[11px] rounded-full font-semibold outline outline-1 outline-offset-1",
                        u.accountType === 'ADMIN' ? "bg-purple-100 text-purple-700 outline-purple-200" :
                        u.accountType === 'AGENT' ? "bg-amber-100 text-amber-700 outline-amber-200" :
                        "bg-slate-100 text-slate-700 outline-slate-200"
                      )}>
                        {u.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div>{u.email || <span className="text-slate-400 italic">Chưa có Email</span>}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{u.phoneNumber || "---"}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {u.profile?.displayName || <span className="text-slate-400 italic">Chưa cập nhật</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={clsx(
                        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full",
                        u.status === 'ACTIVE' ? "bg-green-100 text-green-700" :
                        u.status === 'LOCKED' ? "bg-red-100 text-red-700" :
                        u.status === 'BANNED' ? "bg-slate-800 text-white" :
                        "bg-yellow-100 text-yellow-700"
                      )}>
                        {u.status === 'ACTIVE' && <CheckCircle size={12} />}
                        {u.status === 'LOCKED' && <Lock size={12} />}
                        {u.status === 'BANNED' && <Ban size={12} />}
                        {u.status === 'PENDING_VERIFICATION' && <Loader2 size={12} className="animate-spin" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(u)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" 
                          title="Chỉnh sửa phân quyền"
                        >
                          <Edit2 size={16} />
                        </button>
                        
                        {u.status !== 'LOCKED' && u.status !== 'BANNED' && (
                          <button 
                            onClick={() => handleSoftDelete(u)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Xóa mềm (Khóa)"
                          >
                            <Lock size={16} />
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

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={20} className="text-blue-600"/> Cập nhật Người dùng
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingUser.email || editingUser.phoneNumber || "Không rõ"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Loại tài khoản (Role)
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="MEMBER">MEMBER (Thành viên)</option>
                    <option value="AGENT">AGENT (Môi giới)</option>
                    <option value="ADMIN">ADMIN (Quản trị)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="ACTIVE">ACTIVE (Hoạt động)</option>
                    <option value="PENDING_VERIFICATION">PENDING (Chờ duyệt)</option>
                    <option value="LOCKED">LOCKED (Bị khóa)</option>
                    <option value="BANNED">BANNED (Bị cấm)</option>
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    Mẹo: Chuyển sang LOCKED để thực hiện thao tác "Xóa tài khoản".
                  </p>
                </div>

              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition disabled:opacity-70"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
