import React, { useState, useEffect } from 'react';
import { WifiPackage, PaymentProvider, Transaction } from '../types';
import { getPackages, processPayment } from '../services/mockApi';
import { PackageCard } from '../components/PackageCard';
import { PaymentModal } from '../components/PaymentModal';
import { Waves, HelpCircle, CheckCircle, Receipt, Calendar, Server } from 'lucide-react';
import { Button } from '../components/Button';

export const Portal: React.FC = () => {
  const [packages, setPackages] = useState<WifiPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<WifiPackage | null>(null);
  const [confirmedTransaction, setConfirmedTransaction] = useState<{ pkg: WifiPackage, tx: Transaction } | null>(null);

  useEffect(() => {
    setPackages(getPackages());
  }, []);

  const handlePayment = async (provider: PaymentProvider, phone: string) => {
    if (!selectedPackage) return;
    
    // Simulate API call to XAMPP backend -> Payment Gateway -> Mikrotik
    const result = await processPayment(provider, selectedPackage.price, selectedPackage);
    
    if (result.success && result.transaction) {
      setConfirmedTransaction({ pkg: selectedPackage, tx: result.transaction });
      setSelectedPackage(null);
    }
  };

  if (confirmedTransaction) {
    const { pkg, tx } = confirmedTransaction;
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
          {/* Receipt Header */}
          <div className="bg-green-50 p-8 text-center border-b border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 mt-1">You are now connected.</p>
          </div>

          {/* Receipt Details */}
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Transaction ID</span>
                <span className="font-mono font-medium text-gray-900">{tx.id}</span>
              </div>
               <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium text-gray-900">{tx.date}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">{tx.provider}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Package Details</h3>
                <div className={`h-2 w-2 rounded-full ${pkg.color}`}></div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Server className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700 font-medium">{pkg.name}</span>
                </div>
                <span className="font-bold text-gray-900">{pkg.price.toLocaleString()} {pkg.currency}</span>
              </div>
               <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Duration</span>
                </div>
                <span className="font-medium text-gray-900">{pkg.duration}</span>
              </div>
               <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Status</span>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">ACTIVE</span>
              </div>
            </div>

            <Button onClick={() => setConfirmedTransaction(null)} variant="primary" className="w-full">
              Done & Continue Surfing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 50 Q 50 100 100 50 T 200 50" stroke="white" strokeWidth="2" fill="none" />
             <path d="M0 60 Q 50 110 100 60 T 200 60" stroke="white" strokeWidth="2" fill="none" />
           </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Waves className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Furaha Surfing
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Fast, reliable, and affordable internet. Choose a plan that fits your lifestyle and connect instantly.
          </p>
        </div>
      </div>

      {/* Packages Section */}
      <div className="flex-1 bg-gray-50 -mt-16 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPackage} />
            ))}
          </div>

          {/* Help / Footer */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-4">Need help connecting?</p>
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>Contact Support: +255 700 000 000</span>
            </div>
          </div>
        </div>
      </div>

      {selectedPackage && (
        <PaymentModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onConfirm={handlePayment}
        />
      )}
    </div>
  );
};