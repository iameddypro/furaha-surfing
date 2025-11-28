export interface WifiPackage {
  id: string;
  name: string;
  speed: string;
  duration: string;
  price: number;
  currency: string;
  description: string;
  color: string;
}

export enum PaymentProvider {
  PESAPAL = 'Pesapal',
  PAWAPAY = 'PawaPay',
  VODACOM = 'Vodacom M-Pesa',
  PAYPAL = 'PayPal',
  PAYSTACK = 'Paystack',
  FLUTTERWAVE = 'Flutterwave'
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  packageId: string;
  packageName?: string;
  provider: PaymentProvider;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface RouterStatus {
  cpuLoad: number;
  memoryUsage: number;
  uptime: string;
  activeUsers: number;
  model: string;
  version: string;
}

export interface User {
  id: string;
  mac: string;
  ip: string;
  device: string;
  uptime: string;
  bytesIn: string;
  bytesOut: string;
  status: 'Active' | 'Blocked';
}

export interface Voucher {
  code: string;
  duration: string;
  status: 'Unused' | 'Used';
  generatedAt: string;
}

export interface RouterDevice {
  id: string;
  name: string;
  ip: string;
  location: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
}

export enum AppView {
  PORTAL = 'PORTAL',
  ADMIN = 'ADMIN'
}