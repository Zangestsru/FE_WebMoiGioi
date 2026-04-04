import { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Listing } from "../../types/listing.types";
import { useFavoriteStore } from "../../store/useFavoriteStore";
import { useAuthStore } from "../../store/useAuthStore";
import { listingApi } from "../../api/listing.api";

interface ListingCardProps {
  listing: Listing;
}

/**
 * Format price to Vietnamese currency display.
 * e.g. 3000000000 => "3.000.000.000"
 */
function formatPrice(price: number, unit: string = "VND"): string {
  if (!price) return "Thỏa thuận";

  if (unit === "VND") {
    if (price >= 1_000_000_000) {
      const ty = price / 1_000_000_000;
      return ty % 1 === 0
        ? `${ty.toFixed(0)} tỷ`
        : `${Number(ty.toFixed(2))} tỷ`;
    }
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  }

  if (unit === "USD") {
    return "$" + new Intl.NumberFormat("en-US").format(price);
  }

  return new Intl.NumberFormat("vi-VN").format(price);
}

/**
 * Get the primary image URL from listing media.
 */
function getPrimaryImage(listing: Listing): string {
  const primary = listing.media?.find((m) => m.isPrimary);
  if (primary) return primary.originalUrl;
  if (listing.media?.length > 0) return listing.media[0].originalUrl;
  return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop";
}

export function ListingCard({ listing }: Readonly<ListingCardProps>) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { favoriteIds, addFavoriteId, removeFavoriteId } = useFavoriteStore();

  const isLiked = favoriteIds.includes(listing.id.toString());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để lưu bất động sản");
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      const res = await listingApi.toggleFavorite(listing.id.toString());
      if (res.success) {
        if (res.data.action === "added") {
          addFavoriteId(listing.id.toString());
        } else {
          removeFavoriteId(listing.id.toString());
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const imageUrl = getPrimaryImage(listing);
  const propertyTypeName = listing.propertyType?.name || "Bất động sản";

  let fullAddress = listing.addressDisplay || "";
  if (listing.wardName && !fullAddress.includes(listing.wardName)) {
    fullAddress += fullAddress ? `, ${listing.wardName}` : listing.wardName;
  }
  if (listing.districtName && !fullAddress.includes(listing.districtName)) {
    fullAddress += fullAddress
      ? `, ${listing.districtName}`
      : listing.districtName;
  }
  if (listing.provinceName && !fullAddress.includes(listing.provinceName)) {
    fullAddress += fullAddress
      ? `, ${listing.provinceName}`
      : listing.provinceName;
  }

  return (
    <article
      id={`listing-card-${listing.id}`}
      onClick={() => navigate(`/bat-dong-san/${listing.id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out cursor-pointer border border-gray-100/60 hover:border-gray-200/80"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 rounded-b-xl">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        )}

        <img
          src={imageUrl}
          alt={listing.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Like button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isLiked
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
              : "bg-white/90 backdrop-blur-sm text-black hover:text-red-500 shadow-md"
          } ${isToggling ? "opacity-70 scale-95" : "hover:scale-110"}`}
          aria-label={isLiked ? "Bỏ yêu thích" : "Thêm yêu thích"}
        >
          <Heart
            size={18}
            className={`transition-transform duration-300 ${isLiked ? "scale-110" : ""}`}
            fill={isLiked ? "currentColor" : "none"}
          />
        </button>

        {/* Listing type badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              listing.listingType === "RENT"
                ? "bg-emerald-500/90 text-white"
                : "bg-amber-500/90 text-white"
            }`}
          >
            {listing.listingType === "RENT" ? "Cho thuê" : "Bán"}
          </span>
        </div>

        {/* Image count badge */}
        {listing.media && listing.media.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-semibold backdrop-blur-sm">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            {listing.media.length}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5 pb-5">
        {/* Price */}
        <div className="mb-1.5">
          <span className="text-[18px] sm:text-[20px] font-extrabold text-[#c4a946] tracking-tight leading-none">
            {formatPrice(listing.price, listing.priceUnit)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[18px] sm:text-[20px] font-black text-black leading-tight mb-2 line-clamp-2 group-hover:text-[#c4a946] transition-colors duration-300">
          {listing.title}
        </h3>

        {/* Property Type and Project */}
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wide">
            {propertyTypeName}
          </span>
          {listing.project && (
            <span
              className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wide truncate max-w-full"
              title={`Dự án: ${listing.project.name}`}
            >
              {listing.project.name}
            </span>
          )}
        </div>

        {/* Address */}
        {fullAddress && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin size={16} className="text-[#c4a946] mt-0.5 shrink-0" />
            <span className="text-[13px] sm:text-[14px] text-gray-900 leading-snug line-clamp-2">
              {fullAddress}
            </span>
          </div>
        )}

        {/* Attributes */}
        <div className="pt-1">
          <div className="flex flex-row items-center justify-between px-2 text-center">
            {/* Beds */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-800 font-medium tracking-wide mb-2">
                BEDS
              </span>
              <span className="text-[14px] sm:text-[15px] font-extrabold text-black">
                {listing.attributes?.beds || "-"}
              </span>
            </div>

            {/* Rooms / Baths */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-800 font-medium tracking-wide mb-2">
                ROOMS
              </span>
              <span className="text-[14px] sm:text-[15px] font-extrabold text-black">
                {listing.attributes?.rooms || "-"}
              </span>
            </div>

            {/* Area */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] text-gray-800 font-medium tracking-wide mb-2">
                SOFT
              </span>
              <span className="text-[14px] sm:text-[15px] font-extrabold text-black">
                {listing.areaGross ? Number(listing.areaGross).toFixed(0) : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
