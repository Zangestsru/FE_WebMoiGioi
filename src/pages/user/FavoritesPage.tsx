import { useEffect, useState } from 'react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { ListingCard } from '../../components/listing/ListingCard'
import { listingApi } from '../../api/listing.api'
import type { Listing } from '../../types/listing.types'

/**
 * FavoritesPage - Component to display user's favorited listings.
 * Clean, minimal and fast.
 */
export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        const res = await listingApi.getMyFavorites()
        if (res.success) {
          setFavorites(res.data)
        }
      } catch (error) {
        console.error('Failed to fetch favorite listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onLoginClick={() => {}} onRegisterClick={() => {}} />
      <div className="h-[72px]" />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        <h1 className="font-heading text-3xl font-bold text-[#111] mb-2 uppercase tracking-wide">
          BĐS Yêu thích
        </h1>
        <p className="text-gray-500 font-primary mb-10">
          Danh sách các bất động sản bạn đã lưu để xem lại sau.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#c4a946] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((listing) => (
              <ListingCard key={listing.id.toString()} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-primary text-lg">Bạn chưa lưu bất động sản nào.</p>
            <button 
              onClick={() => window.location.href = '/projects'}
              className="mt-4 px-8 py-3 bg-[#111] text-white rounded-lg font-bold hover:bg-black transition-all"
            >
              Khám phá ngay
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
