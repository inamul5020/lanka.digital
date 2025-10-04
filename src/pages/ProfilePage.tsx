import { Award, Upload, Download, Calendar, TrendingUp, Settings, Share2 } from 'lucide-react';
import { mockUsers, mockProducts } from '../data/mockData';

interface ProfilePageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const user = mockUsers[0];
  const userProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-6xl border-4 border-white shadow-lg">
                  {user.avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                    <p className="text-lg text-blue-600 font-medium mb-2">{user.rank}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {user.joinedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {user.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-medium flex items-center space-x-1"
                    >
                      <Award className="w-3 h-3" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Points</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {user.points.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Uploads</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.uploads}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Downloads</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{user.downloads}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Uploads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onNavigate('product', product.id)}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Download className="w-3 h-3" />
                            <span>{product.downloads}</span>
                          </span>
                        </div>
                        <span className="text-xs">{product.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                View All Uploads
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Timeline</h2>
              <div className="space-y-4">
                {[
                  {
                    type: 'upload',
                    text: 'Uploaded "Professional Photoshop Actions Pack"',
                    time: '2 hours ago',
                  },
                  {
                    type: 'badge',
                    text: 'Earned "Top Contributor" badge',
                    time: '1 day ago',
                  },
                  {
                    type: 'reply',
                    text: 'Replied to "Best free design resources for beginners?"',
                    time: '2 days ago',
                  },
                  {
                    type: 'upload',
                    text: 'Uploaded "UI/UX Design System - Complete Kit"',
                    time: '1 week ago',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'upload'
                          ? 'bg-blue-100'
                          : activity.type === 'badge'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      }`}
                    >
                      {activity.type === 'upload' ? (
                        <Upload className="w-5 h-5 text-blue-600" />
                      ) : activity.type === 'badge' ? (
                        <Award className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <span className="text-green-600">💬</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Achievement Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Upload Master</span>
                    <span className="text-sm font-semibold text-gray-900">234/250</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: '93%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">16 more uploads to unlock</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Community Hero</span>
                    <span className="text-sm font-semibold text-gray-900">156/200</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">44 more helpful replies needed</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Download Champion</span>
                    <span className="text-sm font-semibold text-gray-900">1892/2000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: '94%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">108 more downloads to unlock</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-4">Your Daily Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Unlocks Remaining</span>
                  <span className="font-bold text-2xl">5/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Points Earned Today</span>
                  <span className="font-bold text-2xl">+245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Login Streak</span>
                  <span className="font-bold text-2xl">12 days</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Get More Unlocks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
