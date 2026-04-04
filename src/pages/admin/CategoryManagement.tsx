import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCcw, 
  Filter, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Check
} from "lucide-react";
import { clsx } from "clsx";
import { categoryApi } from "../../api/category.api";
import { useToastStore } from "../../store/useToastStore";
import type { Category, CreateCategoryDto, UpdateCategoryDto } from "../../types/category.types";

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "deleted">("all");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToastStore();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryApi.getAllCategories();
      if (response.success) {
        setCategories(response.data || []);
      } else {
        // Fallback or error handle
        // addToast("Không thể tải danh sách danh mục", "error");
      }
    } catch (error) {
      // addToast("Đã có lỗi xảy ra khi tải dữ liệu", "error");
      
      // MOCK DATA for development/demonstration since API might not be ready
      const mockCategories: Category[] = [
        {
          id: 1,
          name: "Căn hộ chung cư",
          slug: "can-ho-chung-cu",
          description: "Các loại hình căn hộ từ bình dân đến cao cấp",
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Nhà riêng",
          slug: "nha-rieng",
          description: "Nhà ở riêng lẻ, nhà phố",
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Đất nền",
          slug: "dat-nen",
          description: "Đất dự án, đất thổ cư",
          isActive: true,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          name: "Biệt thự",
          slug: "biet-thu",
          description: "Biệt thự đơn lập, song lập",
          isActive: false,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 5,
          name: "Kho bãi",
          slug: "kho-bai",
          description: "Danh mục cũ đã xóa",
          isActive: false,
          isDeleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      setCategories(mockCategories);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           cat.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === "all" ? true :
        filterStatus === "active" ? (!cat.isDeleted && cat.isActive) :
        filterStatus === "deleted" ? cat.isDeleted : true;
        
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, filterStatus]);

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ 
      name: category.name, 
      description: category.description || "" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast("Vui lòng nhập tên danh mục", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      if (selectedCategory) {
        const res = await categoryApi.updateCategory(selectedCategory.id, formData);
        if (res.success) {
          addToast("Cập nhật danh mục thành công", "success");
          fetchCategories();
          setIsModalOpen(false);
        }
      } else {
        const res = await categoryApi.createCategory(formData);
        if (res.success) {
          addToast("Thêm danh mục thành công", "success");
          fetchCategories();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      addToast("Thao tác thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async (id: number) => {
    try {
      setIsSubmitting(true);
      const res = await categoryApi.softDeleteCategory(id);
      if (res.success) {
        addToast("Đã chuyển danh mục vào thùng rác", "success");
        fetchCategories();
        setIsDeleting(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      addToast("Xóa thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await categoryApi.restoreCategory(id);
      if (res.success) {
        addToast("Đã khôi phục danh mục", "success");
        fetchCategories();
      }
    } catch (error) {
      addToast("Khôi phục thất bại", "error");
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const res = await categoryApi.updateCategory(category.id, { isActive: !category.isActive });
      if (res.success) {
        addToast(`Đã ${!category.isActive ? 'kích hoạt' : 'tạm dừng'} danh mục`, "success");
        fetchCategories();
      }
    } catch (error) {
      addToast("Cập nhật trạng thái thất bại", "error");
    }
  };

  return (
    <div className="space-y-6 admin-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Danh mục</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý các loại hình bất động sản trên hệ thống.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-200 active:scale-95"
        >
          <Plus size={18} />
          Thêm danh mục mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="deleted">Đã xóa mềm</option>
          </select>
          
          <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className={clsx("hover:bg-slate-50/80 transition-colors group", cat.isDeleted && "opacity-60 grayscale-[0.5]")}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{cat.name}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">{cat.description || "Không có mô tả"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-500">{cat.slug}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cat.isDeleted ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          Đã xóa mềm
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleToggleStatus(cat)}
                          className={clsx(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                            cat.isActive 
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <div className={clsx("w-1.5 h-1.5 rounded-full mr-1.5", cat.isActive ? "bg-green-500" : "bg-slate-400")}></div>
                          {cat.isActive ? "Hoạt động" : "Tạm dừng"}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {cat.isDeleted ? (
                          <button 
                            onClick={() => handleRestore(cat.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Khôi phục"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleOpenEditModal(cat)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => { setSelectedCategory(cat); setIsDeleting(true); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa mềm"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Search size={48} className="mb-4 opacity-20" />
                      <p className="font-medium">Không tìm thấy danh mục nào</p>
                      <p className="text-sm">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-700">1</span> đến <span className="font-medium text-slate-700">{filteredCategories.length}</span> trong <span className="font-medium text-slate-700">{filteredCategories.length}</span> danh mục
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-400 cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {selectedCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên danh mục <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Căn hộ chung cư"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về danh mục này..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? "Đang xử lý..." : selectedCategory ? "Lưu thay đổi" : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Xác nhận xóa mềm?</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Danh mục <strong className="text-slate-900">"{selectedCategory.name}"</strong> sẽ được chuyển vào mục lưu trữ. Bạn có thể khôi phục nó sau này.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleSoftDelete(selectedCategory.id)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 active:scale-95"
                >
                  {isSubmitting ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
