import { MessageSquare, Eye, Pin, Lock, Search, Plus, Filter } from 'lucide-react';
import { useState } from 'react';
import { mockThreads } from '../data/mockData';

interface ForumPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export default function ForumPage({ onNavigate }: ForumPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Threads', count: mockThreads.length },
    { id: 'general', name: 'General Chat', count: 45 },
    { id: 'resources', name: 'Free Resources', count: 234 },
    { id: 'premium', name: 'Premium Store', count: 67 },
    { id: 'requests', name: 'Requests', count: 89 },
    { id: 'tutorials', name: 'Tutorials', count: 123 },
    { id: 'announcements', name: 'Announcements', count: 12 },
  ];

  const filteredThreads = selectedCategory === 'all'
    ? mockThreads
    : mockThreads;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
          <p className="text-blue-100 text-lg">
            Connect, share, and learn with our active community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-6 flex items-center justify-center space-x-2 transition-colors">
                <Plus className="w-5 h-5" />
                <span>New Thread</span>
              </button>

              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Forum Rules</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be respectful</li>
                  <li>• No spam</li>
                  <li>• Stay on topic</li>
                  <li>• Help others</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search threads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => onNavigate('thread', thread.id)}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {thread.author.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex items-center space-x-2">
                            {thread.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                            {thread.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                            <span>{thread.title}</span>
                          </h3>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                          <span className="font-medium">{thread.author}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                            {thread.authorRank}
                          </span>
                          <span>•</span>
                          <span>{thread.lastActivity}</span>
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-2">{thread.content}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {thread.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{thread.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{thread.views} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
