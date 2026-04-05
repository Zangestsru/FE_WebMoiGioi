import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Home, Clock, TrendingUp, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { listingApi } from '../../api/listing.api';
import { userApi } from '../../api/user.api';
import { ExportReportModal } from './ExportReportModal';

// Skeleton loader cho StatCard
function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          <div className="h-7 bg-slate-200 rounded w-16 mt-2"></div>
        </div>
        <div className="p-3 rounded-lg bg-slate-200 w-11 h-11"></div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-5 bg-slate-200 rounded w-16"></div>
        <div className="h-3 bg-slate-200 rounded w-28"></div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  colorClass
}: {
  title: string,
  value: string,
  change: string,
  icon: any,
  trend: 'up' | 'down',
  colorClass: string
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={twMerge("p-3 rounded-lg flex items-center justify-center", colorClass)}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={clsx(
          "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
          trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          <Activity size={12} className="mr-1" />
          {change}
        </span>
        <span className="text-xs text-slate-400 font-medium">so với tháng trước</span>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Stats data
  const [totalListings, setTotalListings] = useState(0);
  const [pendingListings, setPendingListings] = useState(0);
  const [postsByMonth, setPostsByMonth] = useState<{ name: string; total: number }[]>([]);
  const [userCount, setUserCount] = useState<{
    total: number;
    thisMonth: number;
    lastMonth: number;
    changePercent: number;
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [listingStatsRes, userCountRes] = await Promise.all([
          listingApi.getAdminDashboardStats(),
          userApi.getAdminUserCount(),
        ]);

        if (listingStatsRes.success && listingStatsRes.data) {
          setTotalListings(listingStatsRes.data.totalListings);
          setPendingListings(listingStatsRes.data.pendingListings);
          setPostsByMonth(listingStatsRes.data.postsByMonth);
        }

        if (userCountRes.success && userCountRes.data) {
          setUserCount(userCountRes.data);
        }
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userChangeStr = userCount
    ? `${userCount.changePercent >= 0 ? '+' : ''}${userCount.changePercent}%`
    : '0%';
  const userTrend: 'up' | 'down' = (userCount?.changePercent ?? 0) >= 0 ? 'up' : 'down';

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bảng điều khiển (Phân tích)</h1>
          <p className="text-sm text-slate-500 mt-1">Chào mừng trở lại! Dưới đây là tổng quan tình hình hôm nay.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Xuất Báo cáo
          </button>
          {/* <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
            Tin đăng Mới
          </button> */}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Tổng Tin đăng"
              value={totalListings.toLocaleString('vi-VN')}
              change="+0%"
              trend="up"
              icon={Home}
              colorClass="bg-blue-600"
            />
            <StatCard
              title="Tổng Người dùng"
              value={(userCount?.total ?? 0).toLocaleString('vi-VN')}
              change={userChangeStr}
              trend={userTrend}
              icon={Users}
              colorClass="bg-indigo-600"
            />
            <StatCard
              title="Mới tháng này"
              value={(userCount?.thisMonth ?? 0).toLocaleString('vi-VN')}
              change={userChangeStr}
              trend={userTrend}
              icon={TrendingUp}
              colorClass="bg-emerald-600"
            />
            <StatCard
              title="Chờ Phê duyệt"
              value={pendingListings.toLocaleString('vi-VN')}
              change="+0%"
              trend="up"
              icon={Clock}
              colorClass="bg-amber-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Biểu đồ tổng số bài đăng theo tháng */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tổng số bài đăng theo tháng</h2>
              <p className="text-sm text-slate-500">Thống kê số lượng tin đã đăng trong năm {new Date().getFullYear()}</p>
            </div>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full bg-slate-100 animate-pulse rounded-lg"></div>
            ) : postsByMonth.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Chưa có dữ liệu bài đăng
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={postsByMonth}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} allowDecimals={false} />
                  <Tooltip key="tooltip"
                    formatter={(value: any) => [value, 'Bài đăng']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line key="line-1" type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Bài đăng" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Biểu đồ thống kê user */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Thống kê Người dùng</h2>
              <p className="text-sm text-slate-500">So sánh tháng này và tháng trước</p>
            </div>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Tháng trước', value: userCount?.lastMonth ?? 0 },
                  { name: 'Tháng này', value: userCount?.thisMonth ?? 0 },
                ]}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} allowDecimals={false} />
                  <Tooltip key="tooltip"
                    cursor={{ fill: '#f1f5f9' }}
                    formatter={(value: any) => [value, 'Người dùng mới']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar key="bar-users" dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Người dùng mới" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {!loading && userCount && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Tổng người dùng</span>
                <span className="text-sm font-bold text-slate-800">{userCount.total.toLocaleString('vi-VN')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
