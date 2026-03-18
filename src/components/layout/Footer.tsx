import { Building2 } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* COLUMN 1: BRAND */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              {/* Using a simplified version of the logo for footer */}
              <Building2 size={28} className="text-white" />
              <span className="font-primary text-xl font-black tracking-tighter uppercase">
                Luxury Estates
              </span>
            </div>
            <p className="font-primary text-gray-400 text-[15px] leading-relaxed max-w-[300px]">
              Tái định nghĩa bất động sản hạng sang thông qua việc tiếp cận độc quyền, tư vấn chuyên gia và sự hiện diện toàn cầu tại các thị trường uy tín nhất thế giới.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="flex flex-col gap-6">
            <h4 className="font-primary text-[#EAB308] font-bold text-[15px] uppercase tracking-wider">
              Liên kết nhanh
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { label: 'Tìm bất động sản', href: '#' },
                { label: 'Bán nhà của bạn', href: '#' },
                { label: 'Dự án độc quyền', href: '#' },
                { label: 'Báo cáo thị trường', href: '#' }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-primary text-gray-300 hover:text-white transition-colors text-[15px]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: OUR OFFICE */}
          <div className="flex flex-col gap-6">
            <h4 className="font-primary text-[#EAB308] font-bold text-[15px] uppercase tracking-wider">
              Văn phòng
            </h4>
            <ul className="flex flex-col gap-4">
              {['Ho Chi Minh, VN', 'Ha Noi, VN', 'Da Nang, VN'].map((office) => (
                <li key={office} className="font-primary text-gray-300 text-[15px]">
                  {office}
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div className="flex flex-col gap-6">
            <h4 className="font-primary text-[#EAB308] font-bold text-[15px] uppercase tracking-wider">
              Bản tin
            </h4>
            <p className="font-primary text-gray-300 text-[15px]">
              Nhận các bản cập nhật chọn lọc về thị trường cao cấp.
            </p>
            <div className="flex items-center gap-2 bg-[#D1D5DB] rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-[#EAB308] transition-all">
              <input 
                type="email" 
                placeholder="Email của bạn"
                className="bg-transparent border-none text-black font-primary text-sm px-3 py-2 outline-none flex-1 placeholder:text-gray-500"
              />
              <button className="bg-[#EAB308] text-black font-primary font-bold text-sm px-6 py-2 rounded-md hover:bg-[#d49e06] transition-colors">
                Tham gia
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-primary text-gray-500 text-[13px]">
            © {currentYear} Luxury Estates International. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-8">
            {[
              { label: 'Chính sách bảo mật', href: '#' },
              { label: 'Điều khoản dịch vụ', href: '#' },
              { label: 'Cài đặt Cookie', href: '#' }
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="font-primary text-gray-500 hover:text-white transition-colors text-[13px]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
