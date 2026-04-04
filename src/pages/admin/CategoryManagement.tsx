import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Search } from "lucide-react";
import { propertyTypeApi } from "../../api/propertyType.api";
import type { PropertyType } from "../../api/propertyType.api";
import { useToastStore } from "../../store/useToastStore";

export function CategoryManagement() {
  const [categories, setCategories] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const addToast = useToastStore((state) => state.addToast);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await propertyTypeApi.getAll();
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error(err);
      addToast("Lỗi tải danh sách danh mục", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: PropertyType) => {
    if (category) {
      setEditingId(category.id);
      setCategoryName(category.name);
    } else {
      setEditingId(null);
      setCategoryName("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      addToast("Tên danh mục không được để trống", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        await propertyTypeApi.update(editingId, { name: categoryName });
        addToast("Cập nhật danh mục thành công", "success");
      } else {
        await propertyTypeApi.create({ name: categoryName });
        addToast("Thêm danh mục mới thành công", "success");
      }
      handleCloseModal();
      fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra";
      addToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn danh mục này không?")) return;
    try {
      await propertyTypeApi.delete(id);
      addToast("Đã xóa danh mục", "success");
      fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Lỗi khi xóa danh mục";
      addToast(msg, "error");
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 mb-1">Quản lý Danh mục</h1>
          <p className="text-sm font-medium text-slate-500">Quản lý các loại hình bất động sản trên hệ thống.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          <span className="font-semibold">Thêm Danh Mục Mới</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm tên danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button onClick={fetchCategories} className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Loader2 className={isLoading ? "animate-spin" : ""} size={16} />
            Làm mới
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase font-semibold text-slate-400 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4 w-full">Tên danh mục</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center">
                    <Loader2 className="animate-spin text-slate-400 mx-auto" size={24} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-400">
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              ) : (
                filtered.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-500">
                      #{category.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {category.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(category)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Cập nhật danh mục" : "Thêm mới danh mục"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="VD: Căn hộ chung cư"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  {editingId ? "Cập nhật" : "Lưu danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
