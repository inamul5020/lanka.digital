import { useState, useRef, useEffect } from 'react';
import { User, Settings, Crown, LogOut, Trophy, Download, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface ProfileDropdownProps {
  onClose: () => void;
}

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    onClose();
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Admin': return 'text-red-600 bg-red-50';
      case 'Moderator': return 'text-orange-600 bg-orange-50';
      case 'Elite Member': return 'text-purple-600 bg-purple-50';
      case 'Expert': return 'text-blue-600 bg-blue-50';
      case 'Contributor': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Admin': return '👑';
      case 'Moderator': return '🛡️';
      case 'Elite Member': return '💎';
      case 'Expert': return '⭐';
      case 'Contributor': return '🌟';
      default: return '👤';
    }
  };

  if (!user || !profile) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {profile.avatar_url || user.email?.[0].toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block text-sm font-medium">
          {profile.display_name || profile.username}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Profile Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                {profile.avatar_url || user.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.display_name || profile.username}
                  </p>
                  {profile.is_premium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRankColor(profile.rank)}`}>
                  <span className="mr-1">{getRankIcon(profile.rank)}</span>
                  {profile.rank}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">{profile.points}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{profile.total_uploads}</div>
                <div className="text-xs text-gray-500">Uploads</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{profile.total_downloads}</div>
                <div className="text-xs text-gray-500">Downloads</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <a
              href="#profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="mr-3 h-4 w-4" />
              View Profile
            </a>

            <a
              href="#settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="mr-3 h-4 w-4" />
              Account Settings
            </a>

            <a
              href="#downloads"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Download className="mr-3 h-4 w-4" />
              My Downloads
            </a>

            <a
              href="#badges"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Trophy className="mr-3 h-4 w-4" />
              Achievements
            </a>

            <a
              href="#reviews"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Star className="mr-3 h-4 w-4" />
              My Reviews
            </a>

            <a
              href="#posts"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              My Posts
            </a>

            {profile.is_premium && (
              <div className="px-4 py-2 border-t border-gray-200 bg-yellow-50">
                <div className="flex items-center text-sm text-yellow-800">
                  <Crown className="mr-2 h-4 w-4" />
                  Premium Member
                </div>
              </div>
            )}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
