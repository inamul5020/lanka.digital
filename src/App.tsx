import { useState } from 'react';
import { AuthProvider } from './lib/auth';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ForumPage from './pages/ForumPage';
import StorePage from './pages/StorePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import AuthCallback from './pages/AuthCallback';
import UpgradeModal from './components/UpgradeModal';
import SuccessModal from './components/SuccessModal';
import SupabaseTest from './components/SupabaseTest';
import DatabaseTest from './components/DatabaseTest';
import StorageTest from './components/StorageTest';

type Page = 'home' | 'forum' | 'store' | 'leaderboard' | 'profile' | 'product' | 'thread' | 'auth-callback';

interface NavigationState {
  page: Page;
  id?: string;
}

function App() {
  const [currentNavigation, setCurrentNavigation] = useState<NavigationState>({
    page: 'home',
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState<'purchase' | 'upgrade'>('upgrade');
  const [successMessage, setSuccessMessage] = useState('');

  const handleNavigate = (page: string, id?: string) => {
    setCurrentNavigation({ page: page as Page, id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    setShowUpgradeModal(false);
    setSuccessType('upgrade');
    setSuccessMessage(
      `You're now a Premium member! ${
        plan === 'yearly' ? 'Enjoy your annual savings!' : 'Welcome to monthly premium!'
      }`
    );
    setShowSuccessModal(true);
  };

  const renderPage = () => {
    switch (currentNavigation.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onUpgradeClick={handleUpgradeClick} />;
      case 'forum':
        return <ForumPage onNavigate={handleNavigate} />;
      case 'store':
        return <StorePage onNavigate={handleNavigate} />;
      case 'leaderboard':
        return <LeaderboardPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'product':
        return (
          <ProductDetailPage
            productId={currentNavigation.id || '1'}
            onNavigate={handleNavigate}
            onUpgradeClick={handleUpgradeClick}
          />
        );
      case 'thread':
        return (
          <ThreadDetailPage
            threadId={currentNavigation.id || '1'}
            onNavigate={handleNavigate}
          />
        );
      case 'auth-callback':
        return <AuthCallback onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onUpgradeClick={handleUpgradeClick} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          currentPage={currentNavigation.page}
          onNavigate={handleNavigate}
          onUpgradeClick={handleUpgradeClick}
        />
        {renderPage()}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
        />
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type={successType}
          message={successMessage}
        />
        <SupabaseTest />
        <DatabaseTest />
        <StorageTest />
        <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-xl font-bold">lanka.digital</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sri Lanka's premier hub for digital resources, community, and innovation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <button
                    onClick={() => handleNavigate('store')}
                    className="hover:text-white transition-colors"
                  >
                    Browse Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('forum')}
                    className="hover:text-white transition-colors"
                  >
                    Community Forum
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('leaderboard')}
                    className="hover:text-white transition-colors"
                  >
                    Leaderboard
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Premium Membership
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Report Issue
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    License Info
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 lanka.digital. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </AuthProvider>
  );
}

export default App;
