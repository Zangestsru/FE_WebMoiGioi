import { useState, useEffect } from "react";
import { listingApi } from "../api/listing.api";
import type { Listing } from "../types/listing.types";

export function useProjectDetail(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await listingApi.getPublicListingById(id);
        if (res.success) {
          setListing(res.data);
          console.log("listing: ", res.data);
        } else {
          setError(res.message || "Lỗi tải chi tiết bất động sản");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Lỗi kết nối");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { listing, loading, error };
}
