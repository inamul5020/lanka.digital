import { Trophy, Award, TrendingUp, Upload, Download, Medal } from 'lucide-react';
import { mockUsers } from '../data/mockData';

interface LeaderboardPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function LeaderboardPage({ onNavigate }: LeaderboardPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-yellow-100 text-lg">
            Top contributors making our community amazing
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {mockUsers.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform ${
                index === 0
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600'
              }`}
              onClick={() => onNavigate('profile')}
            >
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-6xl font-bold opacity-20">#{index + 1}</div>
                  {index === 0 ? (
                    <Medal className="w-12 h-12" />
                  ) : index === 1 ? (
                    <Medal className="w-12 h-12" />
                  ) : (
                    <Medal className="w-12 h-12" />
                  )}
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                    {user.avatar}
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
                  <p className="text-white/80 mb-4">{user.rank}</p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-3xl font-bold">{user.points.toLocaleString()}</div>
                    <div className="text-sm text-white/80">points</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Rankings</h2>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                  This Week
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                  All Time
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Uploads
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Badges
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    onClick={() => onNavigate('profile')}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            index === 0
                              ? 'bg-yellow-100 text-yellow-600'
                              : index === 1
                              ? 'bg-gray-100 text-gray-600'
                              : index === 2
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.rank}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-blue-600">
                          {user.points.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Upload className="w-4 h-4" />
                        <span>{user.uploads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Download className="w-4 h-4" />
                        <span>{user.downloads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {user.badges.slice(0, 3).map((badge, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                            title={badge}
                          >
                            <Award className="w-3 h-3" />
                          </div>
                        ))}
                        {user.badges.length > 3 && (
                          <span className="text-xs text-gray-500">+{user.badges.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Most Uploads</h3>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{user.uploads}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Most Downloads</h3>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">{user.downloads}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Most Helpful</h3>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
            </div>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {Math.floor(user.points / 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
