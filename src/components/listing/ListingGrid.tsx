import { useState, useEffect } from "react";
import { listingApi } from "../../api/listing.api";
import { ListingCard } from "./ListingCard";
import type { Listing } from "../../types/listing.types";
import { ArrowRight } from "lucide-react";

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listingApi.getPublicListings();
        if (response.success && response.data) {
          setListings(response.data);
        }
      } catch (err: any) {
        console.error("Failed to fetch listings:", err);
        setError("Không thể tải danh sách tin đăng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* ── Section header (reused across states) ── */
  const SectionHeader = () => (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
      <div>
        <p className="font-primary text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-3">
          Bộ sưu tập được tuyển chọn
        </p>
        <h2 className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0a1632] leading-tight italic">
          Bất động sản nổi bật
        </h2>
        <p className="font-primary text-gray-400 text-sm mt-3 max-w-lg leading-relaxed">
          Các kiệt tác kiến trúc được tuyển chọn kỹ lưỡng về thiết kế, vị trí và
          sự sang trọng vượt trội.
        </p>
      </div>

      <a
        href="#"
        className="inline-flex items-center gap-2 font-primary text-[13px] font-bold uppercase tracking-[0.15em] text-[#0a1632] hover:text-[#d4af37] transition-colors shrink-0 group"
      >
        Xem toàn bộ danh mục
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </a>
    </div>
  );

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section
        id="listings-section"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20"
      >
        <SectionHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="aspect-[4/3] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="border-t border-gray-100 pt-3 flex gap-4">
                  <div className="h-4 bg-gray-100 rounded w-12" />
                  <div className="h-4 bg-gray-100 rounded w-12" />
                  <div className="h-4 bg-gray-100 rounded w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <section
        id="listings-section"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20"
      >
        <SectionHeader />
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <p className="font-primary text-gray-500 text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2.5 bg-[#0a1632] text-white font-primary text-sm font-bold hover:bg-[#0d1d42] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  /* ── Empty state ── */
  if (listings.length === 0) {
    return (
      <section
        id="listings-section"
        className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20"
      >
        <SectionHeader />
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <p className="font-primary text-gray-400 text-base font-medium">
            Chưa có tin đăng nào được xuất bản
          </p>
          <p className="font-primary text-gray-300 text-sm mt-1">
            Các tin đăng mới sẽ xuất hiện tại đây
          </p>
        </div>
      </section>
    );
  }

  /* ── Listing grid ── */
  return (
    <section
      id="listings-section"
      className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20"
    >
      <SectionHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* View more button */}
      {listings.length >= 6 && (
        <div className="text-center mt-14">
          <button className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#0a1632] text-white font-primary text-sm font-bold uppercase tracking-wider hover:bg-[#0d1d42] transition-all duration-300 hover:shadow-xl hover:shadow-[#0a1632]/25 active:scale-[0.98]">
            Xem thêm tin đăng
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
