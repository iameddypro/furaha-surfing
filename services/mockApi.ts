import { RouterStatus, Transaction, WifiPackage, PaymentProvider, User, Voucher, RouterDevice } from '../types';

// --- In-Memory Database State (Simulates XAMPP MySQL) ---

let packages: WifiPackage[] = [
  {
    id: '1',
    name: 'Furaha 1 Hour',
    speed: '5 Mbps',
    duration: '1 Hour',
    price: 500,
    currency: 'TZS',
    description: 'Perfect for quick emails and browsing.',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Furaha Daily',
    speed: '10 Mbps',
    duration: '24 Hours',
    price: 2000,
    currency: 'TZS',
    description: 'Stream movies and surf all day.',
    color: 'bg-purple-500'
  },
  {
    id: '3',
    name: 'Furaha Weekly',
    speed: '15 Mbps',
    duration: '7 Days',
    price: 10000,
    currency: 'TZS',
    description: 'Best value for short stays.',
    color: 'bg-orange-500'
  },
  {
    id: '4',
    name: 'Furaha Monthly',
    speed: '20 Mbps',
    duration: '30 Days',
    price: 35000,
    currency: 'TZS',
    description: 'Ultimate speed for professionals.',
    color: 'bg-emerald-500'
  }
];

let transactions: Transaction[] = [
  { id: 'TXN-9981', user: 'MacBook Pro 15', amount: 2000, packageId: '2', packageName: 'Furaha Daily', provider: PaymentProvider.VODACOM, status: 'Completed', date: '2023-10-27 10:30' },
  { id: 'TXN-9982', user: 'iPhone 13', amount: 500, packageId: '1', packageName: 'Furaha 1 Hour', provider: PaymentProvider.PESAPAL, status: 'Completed', date: '2023-10-27 10:45' },
  { id: 'TXN-9983', user: 'Samsung S21', amount: 10000, packageId: '3', packageName: 'Furaha Weekly', provider: PaymentProvider.PAWAPAY, status: 'Completed', date: '2023-10-27 11:15' },
  { id: 'TXN-9984', user: 'Laptop Dell', amount: 35000, packageId: '4', packageName: 'Furaha Monthly', provider: PaymentProvider.PAYPAL, status: 'Completed', date: '2023-10-27 12:00' },
];

let activeUsers: User[] = [
  { id: 'u1', mac: 'A1:B2:C3:D4:E5:F6', ip: '192.168.88.10', device: 'iPhone 13 Pro', uptime: '2h 15m', bytesIn: '450 MB', bytesOut: '120 MB', status: 'Active' },
  { id: 'u2', mac: '11:22:33:44:55:66', ip: '192.168.88.11', device: 'Samsung S21', uptime: '45m', bytesIn: '120 MB', bytesOut: '15 MB', status: 'Active' },
  { id: 'u3', mac: 'AA:BB:CC:DD:EE:FF', ip: '192.168.88.12', device: 'MacBook Pro', uptime: '5h 30m', bytesIn: '1.2 GB', bytesOut: '300 MB', status: 'Active' },
];

let vouchers: Voucher[] = [
  { code: 'FURAHA-7782', duration: '24 Hours', status: 'Unused', generatedAt: '2023-10-28 09:00' },
  { code: 'FURAHA-3321', duration: '1 Hour', status: 'Used', generatedAt: '2023-10-27 14:00' },
];

let routers: RouterDevice[] = [
  { id: 'r1', name: 'Main Gate Router', ip: '192.168.88.1', location: 'Reception', status: 'Online', lastSeen: 'Just now' },
  { id: 'r2', name: 'Poolside AP', ip: '192.168.88.2', location: 'Pool Area', status: 'Online', lastSeen: '2 mins ago' },
];

// --- API Functions ---

export const getPackages = (): WifiPackage[] => {
  return [...packages];
};

export const addPackage = (pkg: Omit<WifiPackage, 'id'>): void => {
  const newPkg = { ...pkg, id: Math.random().toString(36).substr(2, 9) };
  packages.push(newPkg);
};

export const updatePackage = (id: string, updates: Partial<WifiPackage>): void => {
  packages = packages.map(p => p.id === id ? { ...p, ...updates } : p);
};

export const deletePackage = (id: string): void => {
  packages = packages.filter(p => p.id !== id);
};

export const getRouterStatus = (): Promise<RouterStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        cpuLoad: Math.floor(Math.random() * 30) + 10,
        memoryUsage: Math.floor(Math.random() * 40) + 20,
        uptime: '4d 12h 30m',
        activeUsers: activeUsers.length + Math.floor(Math.random() * 5), // varies slightly
        model: 'MikroTik RB4011',
        version: '7.11.2 (Stable)'
      });
    }, 1000);
  });
};

export const processPayment = (
  provider: PaymentProvider, 
  amount: number, 
  pkg?: WifiPackage
): Promise<{ success: boolean; message: string; transaction?: Transaction }> => {
  return new Promise((resolve) => {
    console.log(`Processing payment via ${provider} for amount ${amount}...`);
    setTimeout(() => {
      const newTx: Transaction = {
        id: 'TXN-' + Math.floor(Math.random() * 10000),
        user: 'Current Device',
        amount: amount,
        packageId: pkg?.id || 'unknown',
        packageName: pkg?.name,
        provider: provider,
        status: 'Completed',
        date: new Date().toLocaleString()
      };
      transactions.unshift(newTx); // Add to history
      resolve({ 
        success: true, 
        message: 'Payment confirmed. Internet access granted.', 
        transaction: newTx 
      });
    }, 2000);
  });
};

export const getRecentTransactions = (): Transaction[] => {
  return [...transactions];
};

export const getActiveUsers = (): User[] => {
  return [...activeUsers];
};

export const kickUser = (id: string): void => {
  activeUsers = activeUsers.filter(u => u.id !== id);
};

export const getVouchers = (): Voucher[] => {
  return [...vouchers];
};

export const generateVoucher = (duration: string): Voucher => {
  const code = 'FURAHA-' + Math.floor(1000 + Math.random() * 9000);
  const voucher: Voucher = {
    code,
    duration,
    status: 'Unused',
    generatedAt: new Date().toLocaleString()
  };
  vouchers.unshift(voucher);
  return voucher;
};

export const getRouters = (): RouterDevice[] => {
  return [...routers];
};

export const addRouter = (router: Omit<RouterDevice, 'id' | 'status' | 'lastSeen'>): void => {
  const newRouter: RouterDevice = {
    ...router,
    id: 'r' + Math.floor(Math.random() * 1000),
    status: 'Offline', // Default to offline until connected
    lastSeen: 'Never'
  };
  routers.push(newRouter);
};

export const deleteRouter = (id: string): void => {
  routers = routers.filter(r => r.id !== id);
};