import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, UploadCloud, FileText, BadgeCheck, AlertCircle, Phone, MapPin, Briefcase, User } from "lucide-react";
import { clsx } from "clsx";
import { Navbar } from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useToastStore } from "../../store/useToastStore";

type BrokerFormData = {
  fullName: string;
  phoneNumber: string;
  experienceYears: number;
  specializedArea: string;
  idFront: FileList;
  idBack: FileList;
  brokerLicense: FileList;
};

export default function BrokerRegistrationPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BrokerFormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const onSubmit = async (data: BrokerFormData) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("experienceYears", data.experienceYears.toString());
      formData.append("specializedArea", data.specializedArea);
      
      if (data.idFront?.[0]) formData.append("idFront", data.idFront[0]);
      if (data.idBack?.[0]) formData.append("idBack", data.idBack[0]);
      if (data.brokerLicense?.[0]) formData.append("brokerLicense", data.brokerLicense[0]);

      await axiosClient.post("/user/register-broker", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      useToastStore.getState().addToast("Nộp đơn đăng ký thành công", "success");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast("Lỗi nộp đơn đăng ký", "error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileNames((prev) => ({ ...prev, [name]: e.target.files![0].name }));
    }
  };

  // Placeholder handlers for Navbar (login/register modals are not needed here)
  const handleLoginClick = () => navigate('/');
  const handleRegisterClick = () => navigate('/');

  if (isSubmitted) {
    return (
      <>
        <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
        <div className="min-h-screen bg-slate-50 pt-[72px]">
          <div className="flex-1 max-w-2xl mx-auto w-full p-6 md:py-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Đã Nộp Đơn!</h2>
              <p className="text-lg text-slate-600 mb-8">
                Cảm ơn bạn đã đăng ký trở thành Môi giới Bất động sản. <strong className="text-slate-900">Yêu cầu của bạn đang được Admin xem xét.</strong> Chúng tôi sẽ thông báo cho bạn khi đơn đăng ký được xử lý.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 flex items-start gap-3 text-left">
                <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p>
                  Quá trình xét duyệt thường mất 1-2 ngày làm việc. Hãy đảm bảo tài liệu bạn tải lên rõ ràng. Bạn có thể theo dõi trạng thái hồ sơ trong phần cài đặt tài khoản.
                </p>
              </div>
              
              <button 
                onClick={() => navigate('/')}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto"
              >
                Về Trang chủ
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <div className="min-h-screen bg-slate-50 pt-[72px]">
        <div className="flex-1 max-w-3xl mx-auto w-full p-6 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Nâng cấp Môi giới</h1>
            <p className="text-slate-500">Gia nhập mạng lưới đại lý bất động sản chuyên nghiệp của chúng tôi. Hoàn thành biểu mẫu dưới đây để đăng ký cấp bậc môi giới.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50/50 p-6 border-b border-slate-200 flex items-start gap-4">
              <BadgeCheck className="text-blue-600 shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-blue-900">Tại sao nên trở thành môi giới?</h3>
                <p className="text-sm text-blue-800/80 mt-1">
                  Môi giới được quyền truy cập vào các công cụ cao cấp, vị trí ưu tiên cho tin đăng, và huy hiệu xác minh chính thức trên hồ sơ để tăng độ tin cậy với người mua và người bán.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-8">
              
              {/* Section 1: Personal Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-slate-400" /> Thông tin Cá nhân
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ và Tên *</label>
                    <input
                      {...register("fullName", { required: "Vui lòng nhập họ và tên" })}
                      className={clsx(
                        "w-full bg-slate-50 border rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                        errors.fullName ? "border-red-300 focus:ring-red-500" : "border-slate-300"
                      )}
                      placeholder="VD: Trần Văn An"
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Số Điện thoại *</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register("phoneNumber", { required: "Vui lòng nhập số điện thoại" })}
                        className={clsx(
                          "w-full bg-slate-50 border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          errors.phoneNumber ? "border-red-300 focus:ring-red-500" : "border-slate-300"
                        )}
                        placeholder="VD: 0912345678"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              {/* Section 2: Professional Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Briefcase size={18} className="text-slate-400" /> Thông tin Nghề nghiệp
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Số năm Kinh nghiệm *</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        {...register("experienceYears", { required: "Vui lòng nhập số năm kinh nghiệm", min: 0 })}
                        className={clsx(
                          "w-full bg-slate-50 border rounded-lg py-2.5 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          errors.experienceYears ? "border-red-300 focus:ring-red-500" : "border-slate-300"
                        )}
                        placeholder="VD: 5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">Năm</span>
                    </div>
                    {errors.experienceYears && <p className="text-xs text-red-500 mt-1">{errors.experienceYears.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Khu vực Chuyên môn *</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        {...register("specializedArea", { required: "Vui lòng nhập khu vực chuyên môn" })}
                        className={clsx(
                          "w-full bg-slate-50 border rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
                          errors.specializedArea ? "border-red-300 focus:ring-red-500" : "border-slate-300"
                        )}
                        placeholder="VD: Quận 1, TP.HCM"
                      />
                    </div>
                    {errors.specializedArea && <p className="text-xs text-red-500 mt-1">{errors.specializedArea.message}</p>}
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full" />

              {/* Section 3: Verification Documents */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-slate-400" /> Tài liệu Xác minh
                </h4>
                <p className="text-sm text-slate-500">Tải lên hình ảnh tài liệu rõ nét, dễ đọc. Kích thước tối đa: 5MB mỗi ảnh (JPG, PNG).</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* ID Card Front */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CMND/CCCD (Mặt trước) *</label>
                    <div className={clsx(
                      "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50 cursor-pointer",
                      errors.idFront ? "border-red-300" : "border-slate-300"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("idFront", { required: "Vui lòng tải lên mặt trước CMND/CCCD" })}
                        onChange={(e) => {
                          register("idFront").onChange(e);
                          handleFileChange(e, "idFront");
                        }}
                      />
                      <UploadCloud size={32} className={fileNames.idFront ? "text-blue-500" : "text-slate-400"} />
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {fileNames.idFront || "Nhấp để tải lên"}
                      </p>
                      {!fileNames.idFront && <p className="text-xs text-slate-500 mt-1">hoặc kéo và thả</p>}
                    </div>
                    {errors.idFront && <p className="text-xs text-red-500 mt-1">{errors.idFront.message as string}</p>}
                  </div>

                  {/* ID Card Back */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CMND/CCCD (Mặt sau) *</label>
                    <div className={clsx(
                      "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50 cursor-pointer",
                      errors.idBack ? "border-red-300" : "border-slate-300"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("idBack", { required: "Vui lòng tải lên mặt sau CMND/CCCD" })}
                        onChange={(e) => {
                          register("idBack").onChange(e);
                          handleFileChange(e, "idBack");
                        }}
                      />
                      <UploadCloud size={32} className={fileNames.idBack ? "text-blue-500" : "text-slate-400"} />
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {fileNames.idBack || "Nhấp để tải lên"}
                      </p>
                      {!fileNames.idBack && <p className="text-xs text-slate-500 mt-1">hoặc kéo và thả</p>}
                    </div>
                    {errors.idBack && <p className="text-xs text-red-500 mt-1">{errors.idBack.message as string}</p>}
                  </div>

                  {/* Broker License */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Chứng chỉ Hành nghề Môi giới *</label>
                    <div className={clsx(
                      "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-50 cursor-pointer",
                      errors.brokerLicense ? "border-red-300" : "border-slate-300 bg-slate-50/50"
                    )}>
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...register("brokerLicense", { required: "Vui lòng tải lên chứng chỉ" })}
                        onChange={(e) => {
                          register("brokerLicense").onChange(e);
                          handleFileChange(e, "brokerLicense");
                        }}
                      />
                      <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                        <BadgeCheck size={32} className={fileNames.brokerLicense ? "text-blue-500" : "text-blue-600/70"} />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {fileNames.brokerLicense || "Tải lên Chứng chỉ Hành nghề Môi giới Bất động sản chính thức của bạn"}
                      </p>
                      {!fileNames.brokerLicense && <p className="text-xs text-slate-500 mt-1">Hỗ trợ JPG, PNG, PDF tối đa 10MB</p>}
                    </div>
                    {errors.brokerLicense && <p className="text-xs text-red-500 mt-1">{errors.brokerLicense.message as string}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang Gửi...
                    </>
                  ) : (
                    "Gửi Yêu cầu"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
