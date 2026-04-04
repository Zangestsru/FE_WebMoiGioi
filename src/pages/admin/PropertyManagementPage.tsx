import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Home, MapPin, Maximize, Loader2 } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout';
import { propertyService } from '../../services/PropertyService';
import type { Property, PropertyFilter } from '../../types/property.types';
import { PropertyType } from '../../types/property.types';
import { Modal } from '../../components/ui/Modal';
import { FormButton } from '../../components/ui/FormButton';
import { PropertyForm } from '../../components/property/PropertyForm';

/**
 * PropertyManagementPage - CRUD functionality for Real Estate items.
 * Rule: Clean UI, Layered Architecture (uses propertyService).
 */
export default function PropertyManagementPage() {
  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<PropertyFilter>({});
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Load properties
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const response = await propertyService.getPropertiesList(filter, page, 10);
      setProperties(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      // Notify user via toast or status modal (integrated in MainLayout)
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Handlers
  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await propertyService.removeProperty(id);
      fetchProperties();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  const handleSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    fetchProperties();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-[#0a1632]">Quản lý Bất động sản</h1>
            <p className="text-gray-500 mt-1">Quản lý danh sách, thông tin và trạng thái các sản phẩm.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Thêm bất động sản
          </button>
        </div>

        {/* Filters Section */}
        <form onSubmit={handleApplyFilter} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tên, mô tả, địa chỉ..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                value={filter.query || ''}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
              />
            </div>
          </div>
          
          <div className="w-48">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Loại</label>
            <select 
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              value={filter.type || ''}
              onChange={(e) => setFilter({ ...filter, type: e.target.value as PropertyType })}
            >
              <option value="">Tất cả loại bài</option>
              <option value="APARTMENT">Căn hộ</option>
              <option value="HOUSE">Nhà phố</option>
              <option value="LAND">Đất nền</option>
              <option value="OFFICE">Văn phòng</option>
            </select>
          </div>

          <FormButton variant="primary" type="submit" isLoading={loading} className="!w-auto px-8 !py-2.5">
            Lọc kết quả
          </FormButton>
        </form>

        {/* List Section */}
        {loading && properties.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-gray-100 rounded-3xl">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#0a1632]">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 max-w-xs mx-auto mt-2">Bắt đầu bằng cách thêm sản phẩm bất động sản đầu tiên của bạn vào hệ thống.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Thêm mới ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col">
                {/* Image Placeholder */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  {prop.images && prop.images[0] ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Home size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      prop.status === 'AVAILABLE' ? 'bg-green-500/80 text-white' : 
                      prop.status === 'SOLD' ? 'bg-red-500/80 text-white' : 'bg-orange-500/80 text-white'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button 
                      onClick={() => { setSelectedProperty(prop); setIsEditModalOpen(true); }}
                      className="p-2.5 bg-white rounded-xl shadow-lg hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => { setSelectedProperty(prop); setIsDeleteModalOpen(true); }}
                      className="p-2.5 bg-white rounded-xl shadow-lg hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-2">
                    <span>{prop.type}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span>{prop.location.city}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1632] line-clamp-1 mb-2">
                    {prop.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin size={16} />
                    <span className="line-clamp-1">{prop.location.address}, {prop.location.district}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Maximize size={14} />
                        <span>{prop.area} m²</span>
                      </div>
                      {prop.bedRooms && (
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                          <span>{prop.bedRooms} PN</span>
                        </div>
                      )}
                    </div>
                    <div className="text-blue-600 font-bold text-lg">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prop.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {total > 10 && (
           <div className="flex justify-center gap-2 mt-8">
              {/* Pagination placeholder */}
           </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <PropertyForm
          onSuccess={handleSuccess}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <PropertyForm
          initialData={selectedProperty}
          onSuccess={handleSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-500">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#0a1632]">Xác nhận xóa</h3>
          <p className="text-gray-500 mt-2">Bạn có chắc chắn muốn xóa bất động sản <span className="font-bold text-gray-900">"{selectedProperty?.title}"</span>? Hành động này không thể hoàn tác.</p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-6 py-3 border border-gray-100 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={() => selectedProperty && handleDelete(selectedProperty.id)}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all font-primary"
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
