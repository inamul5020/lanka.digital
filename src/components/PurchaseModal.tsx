import { X, CreditCard, Smartphone, Building2, Lock } from 'lucide-react';
import { useState } from 'react';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  price: number;
  onPurchase: (paymentMethod: string) => void;
}

type PaymentMethod = 'card' | 'mobile' | 'bank';

export default function PurchaseModal({
  isOpen,
  onClose,
  productTitle,
  price,
  onPurchase,
}: PurchaseModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      onPurchase(paymentMethod);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Complete Purchase</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{productTitle}</span>
              <span className="font-bold text-gray-900">Rs. {price.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === 'card' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <CreditCard
                    className={`w-5 h-5 ${
                      paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, Amex</div>
                </div>
                {paymentMethod === 'card' && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                  paymentMethod === 'mobile'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === 'mobile' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <Smartphone
                    className={`w-5 h-5 ${
                      paymentMethod === 'mobile' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Mobile Payment</div>
                  <div className="text-sm text-gray-600">Dialog, Mobitel, Hutch</div>
                </div>
                {paymentMethod === 'mobile' && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod('bank')}
                className={`w-full p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                  paymentMethod === 'bank'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === 'bank' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <Building2
                    className={`w-5 h-5 ${
                      paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Bank Transfer</div>
                  <div className="text-sm text-gray-600">Direct bank deposit</div>
                </div>
                {paymentMethod === 'bank' && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'mobile' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Provider
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Dialog</option>
                  <option>Mobitel</option>
                  <option>Hutch</option>
                  <option>Airtel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="077 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'bank' && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Bank Details</h4>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Bank:</span> Commercial Bank of Ceylon
                </p>
                <p>
                  <span className="font-medium">Account Name:</span> Lanka Digital (Pvt) Ltd
                </p>
                <p>
                  <span className="font-medium">Account Number:</span> 1234567890
                </p>
                <p>
                  <span className="font-medium">Branch:</span> Colombo 03
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                After making the transfer, please email the receipt to payments@lanka.digital
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Lock className="w-4 h-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay Rs. ${price.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
