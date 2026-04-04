import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadCloud, X, ArrowLeft } from 'lucide-react';
import { listingApi } from '../../api/listing.api';
import { projectApi, type ProjectOption } from '../../api/project.api';
import { locationApi } from '../../api/location.api';
import { useToastStore } from '../../store/useToastStore';

export function AgentPostPage() {
  const navigate = useNavigate();
  const { id } = useParams<{id?: string}>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    addressDisplay: '',
    price: '',
    areaGross: '',
    propertyTypeId: '',
    provinceCode: '',
    provinceName: '',
    wardCode: '',
    wardName: '',
    beds: '',
    rooms: '',
    projectId: '',
  });
  
  // Property Types State
  const [propertyTypes, setPropertyTypes] = useState<{id: number, name: string}[]>([]);
  
  // Location States
  const [provinces, setProvinces] = useState<{name: string, code: number}[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Projects for linking
  const [myProjects, setMyProjects] = useState<ProjectOption[]>([]);

  // Images handling
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchListing = async () => {
        try {
          setIsSubmitting(true);
          const res = await listingApi.getListing(id);
          const data = res.data;
          setFormData({
            title: data.title,
            description: data.attributes?.description || '',
            addressDisplay: data.addressDisplay,
            price: data.price ? data.price.toString() : '',
            areaGross: data.areaGross ? data.areaGross.toString() : '',
            propertyTypeId: data.propertyTypeId ? data.propertyTypeId.toString() : '',
            provinceCode: data.provinceCode || '',
            provinceName: data.provinceName || '',
            wardCode: data.wardCode || '',
            wardName: data.wardName || '',
            beds: data.attributes?.beds ? data.attributes.beds.toString() : '',
            rooms: data.attributes?.rooms ? data.attributes.rooms.toString() : '',
            projectId: data.projectId ? data.projectId.toString() : '',
          });
          
          // Pre-fetch wards if edit mode
          if (data.provinceCode) {
             try {
                const provinceData = await locationApi.getProvince(parseInt(data.provinceCode), 2);
                setWards(provinceData?.wards || []);
             } catch { /* ward loading failed silently, user can re-select province */ }
          }
          
          if (data.media && data.media.length > 0) {
            const urls = data.media.map((m: any) => m.originalUrl);
            setPreviewUrls(urls);
          }
        } catch (err: any) {
           console.error(err);
           useToastStore.getState().addToast("Không thể tải thông tin bất động sản", "error");
        } finally {
           setIsSubmitting(false);
        }
      };
      fetchListing();
    }
  }, [id]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await listingApi.getPropertyTypes();
        setPropertyTypes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch property types", err);
      }
    };
    
    const fetchProvinces = async () => {
      try {
        const data = await locationApi.getProvinces();
        setProvinces(data);
      } catch { /* provinces loading failed */ }
    };

    fetchTypes();
    fetchProvinces();

    // Fetch the agent's approved projects for the dropdown
    const fetchMyProjects = async () => {
      try {
        const res = await projectApi.getMyApprovedProjects();
        setMyProjects(res.data || []);
      } catch { /* ignore */ }
    };
    fetchMyProjects();
  }, []);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    const selected = provinces.find(p => p.code === code);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        provinceCode: code.toString(),
        provinceName: selected.name,
        wardCode: '',
        wardName: ''
      }));
      try {
        const provinceData = await locationApi.getProvince(code, 2);
        setWards(provinceData?.wards || []);
      } catch { /* wards loading failed */ }
    }
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = parseInt(e.target.value);
    const selected = wards.find((w: any) => w.code === code);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        wardCode: code.toString(),
        wardName: selected.name
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles];
      
      // Limit to 10 images max
      if (newImages.length > 10) {
        useToastStore.getState().addToast("Bạn chỉ có thể upload tối đa 10 ảnh.", "error");
        return;
      }

      setImages(newImages);
      
      // Generate previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.addressDisplay || !formData.propertyTypeId || !formData.provinceCode || !formData.wardCode) {
      useToastStore.getState().addToast("Vui lòng điền đầy đủ các trường bắt buộc (*)", "error");
      return;
    }
    if (!isEditMode && images.length === 0) {
      useToastStore.getState().addToast("Vui lòng upload ít nhất 1 ảnh của bất động sản.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value as string);
      });
      


      images.forEach(image => {
        submitData.append('images', image);
      });

      if (isEditMode) {
        await listingApi.updateListing(id!, submitData);
        useToastStore.getState().addToast("Cập nhật tin thành công!", "success");
      } else {
        await listingApi.createListing(submitData);
        useToastStore.getState().addToast("Đăng tin thành công!", "success");
      }
      
      navigate('/agent/dashboard');
    } catch (error: any) {
      console.error('Lỗi khi đăng tin:', error);
      useToastStore.getState().addToast(error.response?.data?.message || "Đã có lỗi xảy ra.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-primary max-w-[800px] mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/agent/dashboard')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
           <h1 className="text-[28px] font-black tracking-tight text-gray-900 mb-1">
             {isEditMode ? 'Cập nhật tin đăng' : 'Đăng tin mới'}
           </h1>
           <p className="text-[14px] font-bold text-gray-400">
             {isEditMode ? 'Chỉnh sửa thông tin bất động sản đã lưu' : 'Điền thông tin chi tiết về bất động sản để tiếp cận khách hàng'}
           </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100">
        <div className="space-y-6">
          
          {/* Photos Upload */}
          <div>
            <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
              Hình ảnh bất động sản {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <p className="text-[13px] font-bold text-gray-400 mb-4">
              {isEditMode ? 'Tải ảnh mới nếu bạn muốn ghi đè lên các ảnh cũ.' : 'Tải lên ít nhất 1 ảnh. Ảnh đầu tiên sẽ được dùng làm ảnh bìa.'}
            </p>
            
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#cfb53b] hover:bg-[#fffdf5] transition-all"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={32} />
                </div>
                <p className="text-[15px] font-bold text-gray-900 text-center mb-1">Click để tải ảnh lên (Tối đa 10 ảnh)</p>
                <p className="text-[13px] font-bold text-gray-400 text-center">Hỗ trợ JPG, PNG, WEBP</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                  {previewUrls.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group border border-gray-100">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">
                          Ảnh bìa
                        </div>
                      )}
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 w-8 h-8 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 my-8"></div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Loại nhà đất <span className="text-red-500">*</span>
              </label>
              <select 
                name="propertyTypeId"
                value={formData.propertyTypeId}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all text-gray-900 appearance-none" 
              >
                <option value="" disabled>-- Chọn loại nhà đất --</option>
                {propertyTypes.map(type => (
                   <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Thuộc dự án
              </label>
              <select 
                name="projectId"
                value={formData.projectId}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all text-gray-900 appearance-none" 
              >
                <option value="">-- Không thuộc dự án --</option>
                {myProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p className="text-[12px] font-bold text-gray-400 mt-1">Chỉ hiển thị dự án đã được duyệt của bạn</p>
            </div>

            <div className="md:col-span-1">
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                placeholder="VD: Bán biệt thự siêu sang trung tâm Quận 1..." />
            </div>

            <div>
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Mức giá <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                placeholder="VD: 5500000000" />
            </div>

            <div>
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Diện tích (m²)
              </label>
              <input 
                type="number" 
                name="areaGross"
                value={formData.areaGross}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                placeholder="VD: 150" />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full col-span-1 md:col-span-2">
              <div>
                <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Số phòng ngủ (Beds)
                </label>
                <input 
                  type="number" 
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                  placeholder="VD: 3" />
              </div>

              <div>
                <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Số phòng tắm/khác (Rooms)
                </label>
                <input 
                  type="number" 
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                  placeholder="VD: 2" />
              </div>
            </div>

            {/* Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
              <div>
                <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Tỉnh/Thành <span className="text-red-500">*</span>
                </label>
                <select 
                  name="provinceCode"
                  value={formData.provinceCode}
                  onChange={handleProvinceChange}
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all text-gray-900 appearance-none"
                >
                  <option value="" disabled>-- Chọn Tỉnh/Thành --</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                  Phường/Xã <span className="text-red-500">*</span>
                </label>
                <select 
                  name="wardCode"
                  value={formData.wardCode}
                  onChange={handleWardChange}
                  disabled={!formData.provinceCode}
                  className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all text-gray-900 appearance-none disabled:opacity-50"
                >
                  <option value="" disabled>-- Chọn Phường/Xã --</option>
                  {wards.map((w: any) => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="addressDisplay"
                value={formData.addressDisplay}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900" 
                placeholder="VD: Số nhà, Tên đường..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[14px] font-black text-gray-900 mb-2 uppercase tracking-wide">
                Mô tả chi tiết
              </label>
              <textarea 
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-[#F3F4F6] border-none rounded-2xl p-4 font-bold text-[15px] focus:ring-2 focus:ring-[#cfb53b] outline-none transition-all placeholder-gray-400 text-gray-900 resize-none" 
                placeholder="Mô tả kỹ hơn về đặc điểm, tiện ích, tình trạng nội thất..." />
            </div>
          </div>
          
        </div>

        <div className="mt-8 flex justify-end gap-4">
           <button 
             type="button" 
             onClick={() => navigate('/agent/dashboard')}
             className="px-8 py-4 rounded-2xl text-[15px] font-black text-gray-500 hover:bg-gray-50 uppercase tracking-widest transition-colors"
           >
             Hủy bỏ
           </button>
           <button 
             type="submit" 
             disabled={isSubmitting}
             className="bg-[#0f243c] hover:bg-black text-white px-10 py-4 rounded-full font-black text-[15px] uppercase tracking-widest transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2 min-w-[200px]"
           >
             {isSubmitting ? (
                 <>
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   Đang xử lý...
                 </>
             ) : isEditMode ? 'Cập nhật' : 'Đăng Tin Ngay'}
           </button>
        </div>
      </form>
    </div>
  );
}
