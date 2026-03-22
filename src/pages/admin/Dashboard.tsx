import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Home, Clock, DollarSign, Activity } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const revenueData = [
  { name: 'T1', revenue: 4000 },
  { name: 'T2', revenue: 3000 },
  { name: 'T3', revenue: 2000 },
  { name: 'T4', revenue: 2780 },
  { name: 'T5', revenue: 1890 },
  { name: 'T6', revenue: 2390 },
  { name: 'T7', revenue: 3490 },
];

const listingsData = [
  { name: 'T2', active: 40, pending: 24, rejected: 24 },
  { name: 'T3', active: 30, pending: 13, rejected: 22 },
  { name: 'T4', active: 20, pending: 98, rejected: 22 },
  { name: 'T5', active: 27, pending: 39, rejected: 20 },
  { name: 'T6', active: 18, pending: 48, rejected: 21 },
  { name: 'T7', active: 23, pending: 38, rejected: 25 },
  { name: 'CN', active: 34, pending: 43, rejected: 21 },
];

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
  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bảng điều khiển (Phân tích)</h1>
          <p className="text-sm text-slate-500 mt-1">Chào mừng trở lại! Dưới đây là tổng quan tình hình hôm nay.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Xuất Báo cáo
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
            Tin đăng Mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng Tin đăng"
          value="1,248"
          change="+12.5%"
          trend="up"
          icon={Home}
          colorClass="bg-blue-600"
        />
        <StatCard
          title="Môi giới Hoạt động"
          value="342"
          change="+4.2%"
          trend="up"
          icon={Users}
          colorClass="bg-indigo-600"
        />
        <StatCard
          title="Doanh thu (Tháng)"
          value="$48,290"
          change="-2.1%"
          trend="down"
          icon={DollarSign}
          colorClass="bg-emerald-600"
        />
        <StatCard
          title="Chờ Phê duyệt"
          value="48"
          change="+18.1%"
          trend="up"
          icon={Clock}
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Tổng quan Doanh thu</h2>
              <p className="text-sm text-slate-500">Doanh thu hàng tháng từ gói đăng ký & tin đăng cao cấp</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip key="tooltip" 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line key="line-1" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Phê duyệt Tin đăng</h2>
              <p className="text-sm text-slate-500">Hoạt động hàng tuần</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={listingsData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip key="tooltip" 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar key="bar-active" dataKey="active" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} name="Đang hiển thị" />
                <Bar key="bar-pending" dataKey="pending" stackId="a" fill="#f59e0b" name="Chờ duyệt" />
                <Bar key="bar-rejected" dataKey="rejected" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Từ chối" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
