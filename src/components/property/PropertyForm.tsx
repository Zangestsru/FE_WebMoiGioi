import { useState } from 'react';
import type { Property, PropertyCreateDTO, PropertyUpdateDTO } from '../../types/property.types';
import { PropertyType, PropertyStatus } from '../../types/property.types';
import { FormInput } from '../ui/FormInput';
import { FormButton } from '../ui/FormButton';
import { propertyService } from '../../services/PropertyService';

interface PropertyFormProps {
  initialData?: Property | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * PropertyForm - Unified form for Create and Edit.
 * Rule: DRY (Rule 4), OOP-like structure in service usage.
 */
export function PropertyForm({ initialData, onSuccess, onCancel }: PropertyFormProps) {
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<PropertyCreateDTO>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    area: initialData?.area || 0,
    location: {
      address: initialData?.location.address || '',
      ward: initialData?.location.ward || '',
      district: initialData?.location.district || '',
      city: initialData?.location.city || '',
    },
    images: initialData?.images || [],
    type: initialData?.type || PropertyType.APARTMENT,
    status: initialData?.status || PropertyStatus.AVAILABLE,
    bedRooms: initialData?.bedRooms,
    bathRooms: initialData?.bathRooms,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit && initialData?.id) {
        await propertyService.modifyProperty(initialData.id, formData as PropertyUpdateDTO);
      } else {
        await propertyService.addProperty(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
      <div>
        <h2 className="text-2xl font-bold text-[#0a1632] mb-1">
          {isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Bất động sản
        </h2>
        <p className="text-gray-500 text-sm">Điền đầy đủ thông tin để {isEdit ? 'cập nhật' : 'đăng'} sản phẩm.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 italic">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormInput
            id="title"
            label="Tiêu đề"
            placeholder="Ví dụ: Căn hộ Vinhomes Grand Park 2PN..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Mô tả chi tiết</label>
          <textarea
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 min-h-[120px] resize-none"
            placeholder="Mô tả đặc điểm, lợi thế, tiện ích xung quanh..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <FormInput
          id="price"
          label="Giá bán (VND)"
          type="number"
          placeholder="0"
          value={formData.price.toString()}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          required
        />

        <FormInput
          id="area"
          label="Diện tích (m²)"
          type="number"
          placeholder="0"
          value={formData.area.toString()}
          onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
          required
        />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Loại hình</label>
          <select 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
          >
            {Object.values(PropertyType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Trạng thái</label>
          <select 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
          >
            {Object.values(PropertyStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Location Section */}
        <div className="md:col-span-2 pt-4">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">📍 Vị trí</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="address"
              label="Địa chỉ (Số nhà, Tên đường)"
              value={formData.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              required
            />
            <FormInput
              id="ward"
              label="Phường/Xã"
              value={formData.location.ward}
              onChange={(e) => handleLocationChange('ward', e.target.value)}
              required
            />
            <FormInput
              id="district"
              label="Quận/Huyện"
              value={formData.location.district}
              onChange={(e) => handleLocationChange('district', e.target.value)}
              required
            />
            <FormInput
              id="city"
              label="Thành phố/Tỉnh"
              value={formData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Detail Section */}
        <div className="md:col-span-2 pt-4">
          <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">🏠 Thông tin bổ sung</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="bedRooms"
              label="Số phòng ngủ"
              type="number"
              value={formData.bedRooms?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, bedRooms: Number(e.target.value) })}
            />
            <FormInput
              id="bathRooms"
              label="Số phòng tắm"
              type="number"
              value={formData.bathRooms?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, bathRooms: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      <div className="pt-8 grid grid-cols-2 gap-4 border-t border-gray-100">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-3.5 border border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
        >
          Hủy bỏ
        </button>
        <FormButton variant="primary" type="submit" isLoading={loading}>
          {isEdit ? 'Lưu thay đổi' : 'Đăng bài ngay'}
        </FormButton>
      </div>
    </form>
  );
}
