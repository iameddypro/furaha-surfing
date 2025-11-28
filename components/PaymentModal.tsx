import React, { useState } from 'react';
import { WifiPackage, PaymentProvider } from '../types';
import { X, Smartphone, CreditCard, Wallet, Layers, Globe, QrCode as QrIcon } from 'lucide-react';
import { Button } from './Button';
import QRCode from 'react-qr-code';

interface PaymentModalProps {
  pkg: WifiPackage;
  onClose: () => void;
  onConfirm: (provider: PaymentProvider, contact: string) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ pkg, onClose, onConfirm }) => {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [contactInfo, setContactInfo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'input' | 'qr'>('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    setIsProcessing(true);
    // If in QR mode, we simulate the "I have paid" action passing "QR_SCAN" as contact info
    await onConfirm(selectedProvider, paymentMode === 'qr' ? 'QR_SCAN' : contactInfo);
    setIsProcessing(false);
  };

  const providers = [
    { id: PaymentProvider.VODACOM, icon: Smartphone, color: 'text-red-600', label: 'Vodacom M-Pesa' },
    { id: PaymentProvider.PAWAPAY, icon: Wallet, color: 'text-orange-500', label: 'PawaPay' },
    { id: PaymentProvider.PESAPAL, icon: CreditCard, color: 'text-blue-500', label: 'Pesapal' },
    { id: PaymentProvider.PAYPAL, icon: Wallet, color: 'text-blue-800', label: 'PayPal' },
    { id: PaymentProvider.PAYSTACK, icon: Layers, color: 'text-teal-500', label: 'Paystack' },
    { id: PaymentProvider.FLUTTERWAVE, icon: Globe, color: 'text-yellow-500', label: 'Flutterwave' },
  ];

  const isEmailRequired = 
    selectedProvider === PaymentProvider.PAYPAL || 
    selectedProvider === PaymentProvider.PAYSTACK || 
    selectedProvider === PaymentProvider.FLUTTERWAVE;

  const supportsQR = selectedProvider === PaymentProvider.PESAPAL || selectedProvider === PaymentProvider.PAWAPAY;

  const handleProviderSelect = (id: PaymentProvider) => {
    setSelectedProvider(id);
    setContactInfo('');
    setPaymentMode('input'); // Reset to input mode on provider change
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Checkout</h3>
            <p className="text-blue-100 text-sm">{pkg.name} - {pkg.price} {pkg.currency}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderSelect(p.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedProvider === p.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p.icon className={`w-6 h-6 mb-2 ${p.color}`} />
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedProvider && supportsQR && (
             <div className="flex bg-gray-100 p-1 rounded-lg">
               <button
                 type="button"
                 onClick={() => setPaymentMode('input')}
                 className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${paymentMode === 'input' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <Smartphone className="w-4 h-4 mr-2" />
                 Direct Input
               </button>
               <button
                 type="button"
                 onClick={() => setPaymentMode('qr')}
                 className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-md transition-all ${paymentMode === 'qr' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 <QrIcon className="w-4 h-4 mr-2" />
                 Scan QR
               </button>
             </div>
          )}

          {selectedProvider && paymentMode === 'input' && (
            <div className="animate-fade-in-up">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEmailRequired ? 'Email Address' : 'Mobile Number'}
              </label>
              <input
                type={isEmailRequired ? 'email' : 'tel'}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={isEmailRequired ? 'you@example.com' : '255 7XX XXX XXX'}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                required
              />
            </div>
          )}

          {selectedProvider && paymentMode === 'qr' && (
             <div className="animate-fade-in-up flex flex-col items-center space-y-4 py-2">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <QRCode 
                    value={`https://furahasurfing.com/pay?p=${selectedProvider}&a=${pkg.price}&id=${pkg.id}`}
                    size={180}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">Scan to pay with {selectedProvider}</p>
                  <p className="text-xs text-gray-500 mt-1">Amount: {pkg.price.toLocaleString()} {pkg.currency}</p>
                </div>
             </div>
          )}

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!selectedProvider || (paymentMode === 'input' && !contactInfo)}
              isLoading={isProcessing}
            >
              {paymentMode === 'qr' ? 'I Have Paid' : `Pay ${pkg.price.toLocaleString()} ${pkg.currency}`}
            </Button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Secured by SSL. Integration with XAMPP backend active.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};