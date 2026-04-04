import { useState } from "react";
import { useForm } from "react-hook-form";
import { ReportReason, createReport } from "../../api/report.api";
import { useToastStore } from "../../store/useToastStore";

interface ReportModalProps {
  listingId: string;
  onClose: () => void;
}

interface FormValues {
  reasonCode: ReportReason;
  description: string;
}

const REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.FAKE_PRICE]: "Giá không đúng thực tế",
  [ReportReason.SOLD]: "Bất động sản đã bán/cho thuê",
  [ReportReason.WRONG_IMAGE]: "Hình ảnh không đúng thực tế",
  [ReportReason.SCAM]: "Có dấu hiệu lừa đảo",
  [ReportReason.OTHER]: "Lý do khác",
};

export const ReportModal = ({ listingId, onClose }: ReportModalProps) => {
  const addToast = useToastStore((state) => state.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await createReport({
        listingId,
        reasonCode: data.reasonCode,
        description: data.description,
      });
      addToast("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét sớm nhất.", "success");
      onClose();
    } catch (error: any) {
      addToast(error?.response?.data?.message || "Có lỗi xảy ra khi báo cáo. Vui lòng thử lại.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold font-heading mb-6 text-gray-900 border-b pb-4">
        Báo cáo tin đăng
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Lý do báo cáo
          </label>
          <div className="space-y-3">
            {Object.entries(REASON_LABELS).map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value={value}
                  {...register("reasonCode", { required: "Vui lòng chọn lý do báo cáo" })}
                  className="w-4 h-4 text-[#c4a946] border-gray-300 focus:ring-[#c4a946]"
                />
                <span className="text-gray-700">{label}</span>
              </label>
            ))}
          </div>
          {errors.reasonCode && (
            <p className="mt-2 text-sm text-red-600">{errors.reasonCode.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả thêm (Không bắt buộc)
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#c4a946] focus:border-[#c4a946] outline-none transition-shadow"
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải để chúng tôi xử lý tốt hơn..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#111] text-white rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </form>
    </div>
  );
};
