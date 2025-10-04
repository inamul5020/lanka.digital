import { TrendingUp, Eye, Download, Star, ArrowRight, Flame, MessageSquare, Crown, Award, Users, Package } from 'lucide-react';
import { mockProducts, mockThreads, mockUsers } from '../data/mockData';
import { useEffect, useState } from 'react';

const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
  onUpgradeClick: () => void;
}

export default function HomePage({ onNavigate, onUpgradeClick }: HomePageProps) {
  const trendingProducts = mockProducts.slice(0, 6);
  const hotThreads = mockThreads.slice(0, 4);
  const topUsers = mockUsers.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Sri Lanka's #1 Digital Resources Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Free downloads, premium products, active forum – all in one place
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('store')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Explore Free Resources</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onUpgradeClick}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span>Join Premium</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                <CountUp end={15420} />
              </div>
              <div className="text-sm text-gray-600">Registered Members</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                <CountUp end={8932} />
              </div>
              <div className="text-sm text-gray-600">Digital Products</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                <CountUp end={3456} />
              </div>
              <div className="text-sm text-gray-600">Forum Threads</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                <CountUp end={234567} />
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Trending Resources</h2>
          </div>
          <button
            onClick={() => onNavigate('store')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('product', product.id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.isPremium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">{product.uploadedAt}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{product.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{product.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Flame className="w-8 h-8 text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">Hot Discussions</h2>
              </div>
              <div className="space-y-4">
                {hotThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => onNavigate('thread', thread.id)}
                    className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex-1">
                        {thread.isPinned && '📌 '}
                        {thread.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          {thread.category}
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{thread.replies} replies</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{thread.views} views</span>
                        </span>
                      </div>
                      <span className="text-gray-500">{thread.lastActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('forum')}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Visit Forum
              </button>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Top Contributors</h2>
              </div>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <div
                    key={user.id}
                    onClick={() => onNavigate('profile')}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                          {user.avatar}
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.rank}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{user.points.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="mt-6 w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="text-blue-100 mb-6">
                Get unlimited access to exclusive resources, priority support, and more benefits
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <span>10 unlocks per day (vs 5 free)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <span>Access to premium-only resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <span>Early access to new uploads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <span>Exclusive discounts on store items</span>
                </div>
              </div>
              <button
                onClick={onUpgradeClick}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold">Rs. 2,999</span>
                  <span className="text-xl text-blue-100">/year</span>
                </div>
                <p className="text-center text-blue-100">That's only Rs. 250 per month!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}