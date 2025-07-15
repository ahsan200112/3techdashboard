import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Clock
} from 'lucide-react';

const DashboardPage = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Customers',
      value: '856',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Products',
      value: '245',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'from-orange-500 to-red-600'
    }
  ];

  const recentOrders = [
    { id: '001', customer: 'John Doe', amount: '$199.99', status: 'Completed', time: '2 hours ago' },
    { id: '002', customer: 'Jane Smith', amount: '$89.50', status: 'Processing', time: '4 hours ago' },
    { id: '003', customer: 'Mike Johnson', amount: '$299.99', status: 'Shipped', time: '6 hours ago' },
    { id: '004', customer: 'Sarah Wilson', amount: '$149.99', status: 'Completed', time: '8 hours ago' }
  ];

  const topProducts = [
    { name: 'Premium Headphones', sales: 125, revenue: '$24,999', trend: '+15%' },
    { name: 'Smart Watch', sales: 98, revenue: '$19,600', trend: '+8%' },
    { name: 'Wireless Speaker', sales: 87, revenue: '$17,400', trend: '+12%' },
    { name: 'Phone Case', sales: 156, revenue: '$3,900', trend: '+22%' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-blue-100 text-lg">
            {t('dashboard.description')}
          </p>
          <div className="mt-6 flex items-center space-x-4">
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-slate-600 font-medium">
                  {stat.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">#{order.id}</p>
                    <p className="text-sm text-slate-600">{order.customer}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{order.time}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{order.amount}</p>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Top Products</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600">{product.sales} sold this month</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-emerald-600 font-medium">{product.trend}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{product.revenue}</p>
                  <p className="text-sm text-slate-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;