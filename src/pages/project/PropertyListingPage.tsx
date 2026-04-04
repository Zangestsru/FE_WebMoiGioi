import { useState, useEffect, useMemo, useCallback } from 'react';
import { listingApi } from '../../api/listing.api';
import { ListingCard } from '../../components/listing/ListingCard';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Modal } from '../../components/ui/Modal';
import { RegisterModal } from '../../components/auth/RegisterModal';
import { LoginModal } from '../../components/auth/LoginModal';
import { VerifyOtpModal } from '../../components/auth/VerifyOtpModal';
import { StatusModal } from '../../components/ui/StatusModal';
import type { Listing } from '../../types/listing.types';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Home,
} from 'lucide-react';

/* ──────────────────────────────── Constants ──────────────────────────────── */

const ITEMS_PER_PAGE = 6;

const SORT_OPTIONS = [
  { value: 'price-desc', label: 'Giá: Cao → Thấp' },
  { value: 'price-asc', label: 'Giá: Thấp → Cao' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'area-desc', label: 'Diện tích: Lớn → Nhỏ' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

const LISTING_TYPE_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'SALE', label: 'Bán' },
  { value: 'RENT', label: 'Cho thuê' },
] as const;

/* ──────────────────────────────── Helpers ──────────────────────────────── */

function sortListings(listings: Listing[], sort: SortValue): Listing[] {
  const sorted = [...listings];
  switch (sort) {
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt || 0).getTime() -
          new Date(a.publishedAt || 0).getTime()
      );
    case 'area-desc':
      return sorted.sort((a, b) => (b.areaGross || 0) - (a.areaGross || 0));
    default:
      return sorted;
  }
}

/* ──────────────────────────────── Component ──────────────────────────────── */

export default function PropertyListingPage() {
  /* ── Auth modal state ── */
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOtpOpen, setIsVerifyOtpOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  /* ── Data state ── */
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Filter / view state ── */
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortValue>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [listingTypeFilter, setListingTypeFilter] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50_000_000_000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

  /* ── Fetch listings ── */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await listingApi.getPublicListings();
        if (response.success && response.data) {
          setListings(response.data);
        }
      } catch {
        setError('Không thể tải danh sách bất động sản. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  /* ── Derive unique property types from data ── */
  const availablePropertyTypes = useMemo(() => {
    const types = new Map<string, string>();
    listings.forEach((l) => {
      if (l.propertyType) {
        types.set(String(l.propertyType.id), l.propertyType.name);
      }
    });
    return Array.from(types, ([id, name]) => ({ id, name }));
  }, [listings]);

  /* ── Filtered + sorted listings ── */
  const processedListings = useMemo(() => {
    let result = [...listings];

    if (listingTypeFilter !== 'ALL') {
      result = result.filter((l) => l.listingType === listingTypeFilter);
    }

    result = result.filter(
      (l) => l.price >= priceRange[0] && l.price <= priceRange[1]
    );

    if (selectedPropertyTypes.length > 0) {
      result = result.filter(
        (l) =>
          l.propertyType &&
          selectedPropertyTypes.includes(String(l.propertyType.id))
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.addressDisplay?.toLowerCase().includes(q) ||
          l.provinceName?.toLowerCase().includes(q) ||
          l.districtName?.toLowerCase().includes(q)
      );
    }

    return sortListings(result, sortBy);
  }, [listings, listingTypeFilter, priceRange, selectedPropertyTypes, searchQuery, sortBy]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(processedListings.length / ITEMS_PER_PAGE));
  const paginatedListings = useMemo(
    () =>
      processedListings.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [processedListings, currentPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [listingTypeFilter, priceRange, selectedPropertyTypes, searchQuery, sortBy]);

  /* ── Auth modal handlers ── */
  const handleSwitchToLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const handleSwitchToRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };
  const handleRegisterSuccess = (email: string) => { setPendingEmail(email); setIsRegisterOpen(false); setIsVerifyOtpOpen(true); };
  const handleVerifySuccess = () => { setIsVerifyOtpOpen(false); window.location.reload(); };
  const handleLoginSuccess = () => { setIsLoginOpen(false); };

  const resetFilters = useCallback(() => {
    setListingTypeFilter('ALL');
    setPriceRange([0, 50_000_000_000]);
    setSelectedPropertyTypes([]);
    setSearchQuery('');
  }, []);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const formatRangePrice = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const FiltersSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className={`${
        isMobile
          ? 'w-full'
          : 'hidden lg:block w-[280px] shrink-0 sticky top-[96px] self-start'
      }`}
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-primary text-lg font-bold text-gray-900">Bộ lọc</h3>
          <button
            onClick={resetFilters}
            className="font-primary text-[13px] font-semibold text-[#c4a946] hover:text-[#a88e30] transition-colors"
          >
            Đặt lại
          </button>
        </div>

        <div className="mb-6">
          <label className="font-primary text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Home size={15} className="text-gray-400" />
            Loại tin
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {LISTING_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setListingTypeFilter(opt.value)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
                  listingTypeFilter === opt.value
                    ? 'bg-[#0a1632] text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="font-primary text-sm font-bold text-gray-700 mb-3 block">
            Khoảng giá
          </label>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-primary text-[12px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              {formatRangePrice(priceRange[0])}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-primary text-[12px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              {formatRangePrice(priceRange[1])}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50_000_000_000}
            step={500_000_000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full mt-3 accent-[#c4a946] cursor-pointer"
          />
        </div>

        {availablePropertyTypes.length > 0 && (
          <div className="mb-6">
            <label className="font-primary text-sm font-bold text-gray-700 mb-3 block">
              Loại bất động sản
            </label>
            <div className="flex flex-col gap-2.5 mt-2">
              {availablePropertyTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedPropertyTypes.includes(type.id)
                        ? 'bg-[#0a1632] border-[#0a1632]'
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}
                  >
                    {selectedPropertyTypes.includes(type.id) && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="font-primary text-[14px] text-gray-700 group-hover:text-gray-900 transition-colors">
                    {type.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full mt-4 py-3 bg-[#0a1632] text-white font-primary text-sm font-bold rounded-xl hover:bg-[#0d1d42] transition-colors"
          >
            Áp dụng bộ lọc
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      <div className="h-[72px]" />

      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 font-primary text-[13px]">
            <a href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              Trang chủ
            </a>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-semibold">Danh sách bất động sản</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 py-4 md:py-6 flex-1">
        <div className="flex gap-8">
          <FiltersSidebar />

          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
              <div>
                <h1 className="font-heading text-2xl md:text-[32px] font-bold text-[#0a1632] leading-tight italic mb-1">
                  Danh sách bất động sản
                </h1>
                {!loading && (
                  <p className="font-primary text-[13px] text-gray-400 mt-1.5">
                    Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, processedListings.length)} trong{' '}
                    {processedListings.length} bất động sản
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-primary text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Bộ lọc
                </button>

                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[#0a1632] text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[#0a1632] text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-primary text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors min-w-[180px] justify-between"
                  >
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isSortOpen && (
                    <div className="absolute right-0 mt-2 w-full bg-white rounded-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 font-primary text-sm transition-colors ${
                            sortBy === option.value
                              ? 'bg-gray-50 text-[#0a1632] font-bold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên, địa chỉ, khu vực..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-primary text-sm focus:ring-2 focus:ring-[#0a1632] focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {loading && (
              <div
                className={`grid gap-7 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
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
            )}

            {error && !loading && (
              <div className="text-center py-20">
                <p className="font-primary text-gray-500 text-base">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2.5 bg-[#0a1632] text-white font-primary text-sm font-bold hover:bg-[#0d1d42] transition-colors rounded-xl"
                >
                  Thử lại
                </button>
              </div>
            )}

            {!loading && !error && processedListings.length === 0 && (
              <div className="text-center py-20">
                <p className="font-primary text-gray-500 text-base font-medium">
                  Không tìm thấy bất động sản nào phù hợp
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2.5 bg-[#0a1632] text-white font-primary text-sm font-bold hover:bg-[#0d1d42] transition-colors rounded-xl"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}

            {!loading && !error && paginatedListings.length > 0 && (
              <>
                <div
                  className={`grid gap-7 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1 max-w-[800px]'
                  }`}
                >
                  {paginatedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {getPageNumbers().map((page, idx) =>
                      page === 'ellipsis' ? (
                        <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center font-primary text-gray-400 text-sm">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-primary text-sm font-bold transition-all duration-200 ${
                            currentPage === page
                              ? 'bg-[#0a1632] text-white shadow-lg shadow-[#0a1632]/25'
                              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <StatusModal />
    </div>
  );
}
