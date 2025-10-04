import { Eye, MessageSquare, ThumbsUp, Share2, Flag, ArrowLeft, Pin, Lock } from 'lucide-react';
import { mockThreads } from '../data/mockData';

interface ThreadDetailPageProps {
  threadId: string;
  onNavigate: (page: string, id?: string) => void;
}

export default function ThreadDetailPage({ threadId, onNavigate }: ThreadDetailPageProps) {
  const thread = mockThreads.find((t) => t.id === threadId) || mockThreads[0];

  const replies = [
    {
      id: '1',
      author: 'HelpfulUser',
      authorRank: 'Expert',
      avatar: '🎨',
      content:
        'I would recommend checking out Figma, Adobe XD, and Canva. All have great free tiers for beginners. Also, explore resources like Dribbble and Behance for inspiration.',
      likes: 12,
      timestamp: '1 hour ago',
    },
    {
      id: '2',
      author: 'DesignPro',
      authorRank: 'Elite Member',
      avatar: '✨',
      content:
        'Don\'t forget about free icon packs from sites like Flaticon and illustration resources from unDraw. Also YouTube has tons of free tutorials.',
      likes: 8,
      timestamp: '2 hours ago',
    },
    {
      id: '3',
      author: 'CreativeGuru',
      authorRank: 'Contributor',
      avatar: '🚀',
      content:
        'I\'d also add that practicing daily is more important than the tools you use. Try the Daily UI challenge!',
      likes: 5,
      timestamp: '3 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('forum')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Forum</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg">
                    {thread.category}
                  </span>
                  {thread.isPinned && (
                    <span className="flex items-center space-x-1 text-blue-600">
                      <Pin className="w-4 h-4" />
                      <span className="text-sm font-medium">Pinned</span>
                    </span>
                  )}
                  {thread.isLocked && (
                    <span className="flex items-center space-x-1 text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Locked</span>
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{thread.title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {thread.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{thread.author}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                      {thread.authorRank}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{thread.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 ml-auto text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{thread.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.replies}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">{thread.content}</p>
            </div>

            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-medium">Helpful</span>
                <span className="text-sm">24</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="font-medium">Share</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Flag className="w-4 h-4" />
                <span className="font-medium">Report</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="w-6 h-6" />
              <span>{thread.replies} Replies</span>
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {replies.map((reply) => (
              <div key={reply.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                      {reply.avatar}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">{reply.author}</h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          {reply.authorRank}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{reply.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{reply.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{reply.likes}</span>
                      </button>
                      <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!thread.isLocked && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Your Reply</h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={5}
              placeholder="Share your thoughts..."
            ></textarea>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                <span>Earn </span>
                <span className="font-semibold text-blue-600">+10 points</span>
                <span> for helpful replies</span>
              </div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                Post Reply
              </button>
            </div>
          </div>
        )}

        {thread.isLocked && (
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">This thread is locked and no longer accepting replies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
