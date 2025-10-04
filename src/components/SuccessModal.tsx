import { CheckCircle, Download, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'purchase' | 'upgrade';
  message: string;
}

export default function SuccessModal({ isOpen, onClose, type, message }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {type === 'purchase' ? 'Purchase Complete!' : 'Welcome to Premium!'}
            </h3>
            <p className="text-gray-600 mb-6">{message}</p>
            {type === 'purchase' && (
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mb-3">
                <Download className="w-5 h-5" />
                <span>Download Now</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full py-3 ${
                type === 'purchase'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
              } rounded-lg font-semibold transition-colors`}
            >
              {type === 'purchase' ? 'View in Library' : 'Start Exploring'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
