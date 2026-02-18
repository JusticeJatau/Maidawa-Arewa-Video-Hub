import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Folder, 
  TrendingUp, 
  Eye, 
  Clock,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from 'lucide-react';
import API from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalViews: 0,
  });
  
  const [recentVideos, setRecentVideos] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await API.get('/dashboard/stats');
      const data = response.data

      const activityData = data.activityData;
      const platformStats = data.platformStats;
      const recentVideos = data.recentVideos;
      const totals = data.totals

      setActivityData(activityData)

      console.log(data)

      const BASE_URL = "http://localhost:5000"; 
      
      setStats({
        totalVideos: totals.totalVideos,
        totalUsers: totals.totalUsers,
        totalCategories: totals.totalCategories,
        totalViews: totals.totalViews,
      });

      const videos = recentVideos.map(video=>({
        ...video,
        thumbnail:`${BASE_URL}${video.thumbnail}`,
      }))
      setRecentVideos(videos);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Folder,
      color: 'from-purple-500 to-pink-500',
      change: '+3%',
      trend: 'up',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      change: '+23%',
      trend: 'up',
    },
  ];

  // const activityData = [
  //   { month: 'Jan', videos: 0, views: 0 },
  //   { month: 'Feb', videos: 0, views: 0 },
  //   { month: 'Mar', videos: 0, views: 0 },
  //   { month: 'Apr', videos: 0, views: 0 },
  //   { month: 'May', videos: 0, views: 0 },
  //   { month: 'Jun', videos: 0, views: 0 },
  //   { month: 'Jul', videos: 0, views: 0 },
  // ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your content.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="text-sm font-medium ml-1">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Monthly Activity</h2>
              <p className="text-sm text-gray-600">Videos uploaded vs views</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg">
              <MoreVertical size={18} className="text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-4">
            {activityData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm text-gray-500">{item.month}</div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.videos} videos</span>
                    <span className="text-sm text-gray-500">{item.views.toLocaleString()} views</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${(item.videos / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Platform Stats</h2>
              <p className="text-sm text-gray-600">Real-time metrics</p>
            </div>
            <BarChart3 size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Clock size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Watch Time</p>
                  {/* <p className="text-lg font-semibold text-gray-900">18m 45s</p> */}
                </div>
              </div>
              {/* <div className="text-green-600 text-sm font-medium">+12%</div> */}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  {/* <p className="text-lg font-semibold text-gray-900">64.5%</p> */}
                </div>
              </div>
              {/* <div className="text-green-600 text-sm font-medium">+8%</div> */}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Users size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">New Users (7d)</p>
                  {/* <p className="text-lg font-semibold text-gray-900">142</p> */}
                </div>
              </div>
              {/* <div className="text-green-600 text-sm font-medium">+5%</div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Videos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Videos</h2>
          <p className="text-sm text-gray-600">Recently uploaded videos</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentVideos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {/* <div className="flex-shrink-0 h-10 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center mr-3">
                        <Video size={20} className="text-white" />
                      </div> */}
                      <div className="flex-shrink-0 h-12 w-20 rounded overflow-hidden bg-gray-100">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{video.title}</div>
                        <div className="text-xs text-gray-500">ID: #{video.id.toString().padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Eye size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{video.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {video.duration}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{video.uploaded}</td>
                  <td className="py-4 px-6">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium py-2">
            View All Videos →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;