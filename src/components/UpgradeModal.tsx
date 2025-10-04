import { X, Check, Crown, Zap, Star, Shield } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Premium</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unlock unlimited access to premium resources
            </h3>
            <p className="text-gray-600">
              Join thousands of creators who upgraded their workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Monthly Plan</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">Rs. 399</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <button
                onClick={() => onUpgrade('monthly')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors mb-4"
              >
                Choose Monthly
              </button>
              <p className="text-sm text-gray-600 text-center">Cancel anytime</p>
            </div>

            <div className="border-2 border-blue-500 rounded-xl p-6 relative bg-blue-50">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value - Save 37%
                </span>
              </div>
              <div className="mb-4 mt-2">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Yearly Plan</h4>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-gray-900">Rs. 2,999</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">
                  Only Rs. 250/month - Save Rs. 1,789
                </p>
              </div>
              <button
                onClick={() => onUpgrade('yearly')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg text-white rounded-lg font-semibold transition-shadow mb-4"
              >
                Choose Yearly
              </button>
              <p className="text-sm text-gray-600 text-center">Most popular choice</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Premium Features</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: Zap,
                  title: '10 Daily Unlocks',
                  description: 'Download up to 10 products per day',
                },
                {
                  icon: Crown,
                  title: 'Premium Products',
                  description: 'Access exclusive premium-only items',
                },
                {
                  icon: Star,
                  title: 'Early Access',
                  description: 'Get new uploads before anyone else',
                },
                {
                  icon: Shield,
                  title: 'Priority Support',
                  description: '24/7 dedicated support team',
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm">{feature.title}</h5>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">What's included:</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                'Unlimited browsing',
                'Commercial use license',
                'Ad-free experience',
                'Premium badge',
                'Community access',
                'Regular updates',
                'Special discounts',
                'Cancel anytime',
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
