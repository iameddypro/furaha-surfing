import React from 'react';
import { WifiPackage } from '../types';
import { Wifi, Check, Clock, Zap } from 'lucide-react';
import { Button } from './Button';

interface PackageCardProps {
  pkg: WifiPackage;
  onSelect: (pkg: WifiPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onSelect }) => {
  return (
    <div className="relative group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      <div className={`h-2 w-full ${pkg.color}`}></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-full ${pkg.color} bg-opacity-10 text-${pkg.color.replace('bg-', '')}`}>
            <Wifi className="w-6 h-6" />
          </div>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            {pkg.duration}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="flex items-baseline mb-6">
          <span className="text-3xl font-extrabold text-gray-900">{pkg.price.toLocaleString()}</span>
          <span className="text-gray-500 ml-1 font-medium">{pkg.currency}</span>
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-center text-gray-600">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            <span>Speed up to <strong>{pkg.speed}</strong></span>
          </li>
           <li className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span>Valid for {pkg.duration}</span>
          </li>
           <li className="flex items-center text-gray-600">
            <Check className="w-4 h-4 mr-2 text-green-500" />
            <span>Unlimited Data</span>
          </li>
           <li className="flex items-center text-gray-600 text-sm">
            <span className="w-4 h-4 mr-2"></span>
            <span>{pkg.description}</span>
          </li>
        </ul>

        <Button 
          onClick={() => onSelect(pkg)} 
          className="w-full mt-auto"
          variant="primary"
        >
          Select Plan
        </Button>
      </div>
    </div>
  );
};