import React, { useEffect, useState } from 'react';
import { RouterStatus, Transaction, User, WifiPackage, Voucher, RouterDevice } from '../types';
import { 
  getRouterStatus, 
  getRecentTransactions, 
  getActiveUsers, 
  kickUser,
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
  getVouchers,
  generateVoucher,
  getRouters,
  addRouter,
  deleteRouter
} from '../services/mockApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Server, Users, DollarSign, Activity, RefreshCw, 
  LayoutDashboard, Ticket, Wifi, CreditCard, Settings,
  Trash2, Plus, Monitor, Laptop, AlertTriangle, Edit2, X,
  Terminal, Router as RouterIcon, Copy, Lock, ShieldCheck, Key, Check
} from 'lucide-react';
import { Button } from '../components/Button';
import { Tooltip } from '../components/Tooltip';

// --- Sub Components for Admin Views ---

const StatCard: React.FC<{ title: string; value: string; icon: any; color: string; subtext?: string }> = ({ 
  title, value, icon: Icon, color, subtext 
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
    </div>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    {subtext && <p className="text-sm text-gray-500 mt-1">{subtext}</p>}
  </div>
);

// --- Main Admin Component ---

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages' | 'vouchers' | 'billing' | 'devices' | 'settings'>('dashboard');
  const [routerStatus, setRouterStatus] = useState<RouterStatus | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<WifiPackage[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [routers, setRouters] = useState<RouterDevice[]>([]);

  // Form states
  const [newPackage, setNewPackage] = useState({ name: '', price: '', speed: '', duration: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [voucherDuration, setVoucherDuration] = useState('1 Hour');
  const [newRouter, setNewRouter] = useState({ name: '', ip: '', location: '' });
  
  // UI States
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [selectedRouterIp, setSelectedRouterIp] = useState('');
  const [macbookIp, setMacbookIp] = useState('192.168.88.254'); // Default placeholder
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      getRouterStatus().then(setRouterStatus);
      setTransactions(getRecentTransactions());
      setUsers(getActiveUsers());
      setPackages(getPackages());
      setVouchers(getVouchers());
      setRouters(getRouters());
    };

    fetchData();
    const interval = setInterval(() => {
       // Only poll router status frequently
       getRouterStatus().then(setRouterStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab]); // Refresh data when tab changes

  const handleKickUser = (id: string) => {
    kickUser(id);
    setUsers(getActiveUsers());
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newPackage.name || !newPackage.price) return;

    if (editingId) {
      updatePackage(editingId, {
        name: newPackage.name,
        price: parseInt(newPackage.price),
        speed: newPackage.speed,
        duration: newPackage.duration
      });
      setEditingId(null);
    } else {
      addPackage({
        name: newPackage.name,
        price: parseInt(newPackage.price),
        speed: newPackage.speed,
        duration: newPackage.duration,
        currency: 'TZS',
        description: 'Custom Plan',
        color: 'bg-gray-600'
      });
    }

    setPackages(getPackages());
    setNewPackage({ name: '', price: '', speed: '', duration: '' });
  };

  const startEditing = (pkg: WifiPackage) => {
    setNewPackage({
      name: pkg.name,
      price: pkg.price.toString(),
      speed: pkg.speed,
      duration: pkg.duration
    });
    setEditingId(pkg.id);
  };

  const cancelEditing = () => {
    setNewPackage({ name: '', price: '', speed: '', duration: '' });
    setEditingId(null);
  };

  const confirmDeletePackage = () => {
    if (deleteConfirmationId) {
      deletePackage(deleteConfirmationId);
      setPackages(getPackages());
      setDeleteConfirmationId(null);
      // If deleting the package currently being edited, reset edit state
      if (editingId === deleteConfirmationId) {
        cancelEditing();
      }
    }
  };

  const handleGenerateVoucher = () => {
    generateVoucher(voucherDuration);
    setVouchers(getVouchers());
  };

  const handleAddRouter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouter.name || !newRouter.ip) return;
    addRouter(newRouter);
    setRouters(getRouters());
    setNewRouter({ name: '', ip: '', location: '' });
  };

  const handleDeleteRouter = (id: string) => {
    deleteRouter(id);
    setRouters(getRouters());
  };

  const handleCopyScript = () => {
     const code = document.getElementById('mk-script')?.innerText;
     if(code) {
       navigator.clipboard.writeText(code);
       setCopySuccess(true);
       setTimeout(() => setCopySuccess(false), 2000);
     }
  };

  const renderDashboard = () => {
    const revenueData = [
      { name: 'Mon', revenue: 40000 },
      { name: 'Tue', revenue: 30000 },
      { name: 'Wed', revenue: 55000 },
      { name: 'Thu', revenue: 45000 },
      { name: 'Fri', revenue: 80000 },
      { name: 'Sat', revenue: 95000 },
      { name: 'Sun', revenue: 70000 },
    ];

    return (
      <div className="space-y-6">
         {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Users" value={routerStatus?.activeUsers.toString() || '...'} icon={Users} color="bg-blue-500" subtext="Currently connected" />
          <StatCard title="Daily Revenue" value="TZS 245K" icon={DollarSign} color="bg-emerald-500" subtext="+12% from yesterday" />
          <StatCard title="CPU Load" value={`${routerStatus?.cpuLoad || 0}%`} icon={Activity} color="bg-orange-500" subtext={routerStatus?.model} />
          <StatCard title="System Uptime" value={routerStatus?.uptime || '...'} icon={Server} color="bg-purple-500" subtext={`Ver: ${routerStatus?.version}`} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            Revenue Overview
            <Tooltip content="Gross revenue calculated before payment provider fees" />
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Connected Devices</h3>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{users.length} Online</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Device / IP</th>
              <th className="px-6 py-4 font-semibold">MAC Address</th>
              <th className="px-6 py-4 font-semibold">Usage (In/Out)</th>
              <th className="px-6 py-4 font-semibold">Uptime</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600"><Laptop className="w-4 h-4"/></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.device}</p>
                      <p className="text-xs text-gray-500">{u.ip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{u.mac}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.bytesIn} / {u.bytesOut}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.uptime}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleKickUser(u.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition-colors" title="Disconnect User">
                    Disconnect
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
               <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No active users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPackages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Active Packages</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${editingId === pkg.id ? 'bg-blue-50/50' : ''}`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${pkg.color} mr-4`}></div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{pkg.name}</h4>
                  <p className="text-xs text-gray-500">{pkg.speed} - {pkg.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                 <span className="font-mono font-medium text-gray-700 mr-2">{pkg.price.toLocaleString()} {pkg.currency}</span>
                 <button 
                  onClick={() => startEditing(pkg)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit Package"
                >
                   <Edit2 className="w-5 h-5" />
                 </button>
                 <button 
                  onClick={() => setDeleteConfirmationId(pkg.id)} 
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete Package"
                >
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Package' : 'Add New Package'}</h3>
          {editingId && (
            <button onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSavePackage} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Package Name</label>
            <input 
              type="text" 
              value={newPackage.name}
              onChange={e => setNewPackage({...newPackage, name: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Weekend Special"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Price (TZS)</label>
            <input 
              type="number" 
              value={newPackage.price}
              onChange={e => setNewPackage({...newPackage, price: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="5000"
            />
          </div>
           <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  Speed
                  <Tooltip content="Max bandwidth per user (e.g. 5Mbps)" />
                </label>
                <input 
                  type="text" 
                  value={newPackage.speed}
                  onChange={e => setNewPackage({...newPackage, speed: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="5 Mbps"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
                  Duration
                  <Tooltip content="Validity period (e.g. 24h, 30d)" />
                </label>
                 <input 
                  type="text" 
                  value={newPackage.duration}
                  onChange={e => setNewPackage({...newPackage, duration: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="24 Hours"
                />
              </div>
           </div>
          
          <div className="pt-2 flex gap-2">
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEditing} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={!newPackage.name || !newPackage.price}>
              {editingId ? <RefreshCw className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />} 
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderVouchers = () => (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Vouchers</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center">
              Duration
              <Tooltip content="Voucher validity starts from first login" />
            </label>
            <select 
              value={voucherDuration}
              onChange={(e) => setVoucherDuration(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>1 Hour</option>
              <option>24 Hours</option>
              <option>7 Days</option>
              <option>30 Days</option>
            </select>
          </div>
          <Button onClick={handleGenerateVoucher} className="w-full" variant="secondary">
            Generate Code
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Voucher List</h3>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 font-semibold">Code</th>
              <th className="px-6 py-3 font-semibold">Duration</th>
              <th className="px-6 py-3 font-semibold">Created At</th>
              <th className="px-6 py-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vouchers.map((v, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono font-medium text-blue-600">{v.code}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{v.duration}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{v.generatedAt}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'Unused' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {v.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
     </div>
  );

  const renderBilling = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
        <Button variant="outline" className="text-sm py-1 border-gray-300 text-gray-600">Export CSV</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Package</th>
              <th className="px-6 py-4 font-semibold">Provider</th>
              <th className="px-6 py-4 font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{tx.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.user}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{tx.packageName || 'Unknown'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{tx.provider}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  {tx.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{tx.date}</td>
                <td className="px-6 py-4 text-right">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                    {tx.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Mikrotik Routers</h3>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{routers.length} Devices</span>
        </div>
        <div className="divide-y divide-gray-100">
          {routers.map((router) => (
            <div key={router.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${router.status === 'Online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                   <RouterIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{router.name}</h4>
                  <p className="text-xs text-gray-500">{router.ip} • {router.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                 <Button 
                   variant="secondary" 
                   className="text-xs px-3 py-1.5"
                   onClick={() => {
                     setSelectedRouterIp(router.ip);
                     setProvisionModalOpen(true);
                   }}
                 >
                   <Terminal className="w-3 h-3 mr-2" />
                   Provision
                 </Button>
                 <button onClick={() => handleDeleteRouter(router.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Remove Router">
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </div>
          ))}
          {routers.length === 0 && (
             <div className="p-8 text-center text-gray-400">No routers added. Add a Mikrotik device to start.</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Device</h3>
        <form onSubmit={handleAddRouter} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Router Name</label>
            <input 
              type="text" 
              value={newRouter.name}
              onChange={e => setNewRouter({...newRouter, name: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Main Hub"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">IP Address</label>
            <input 
              type="text" 
              value={newRouter.ip}
              onChange={e => setNewRouter({...newRouter, ip: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="192.168.88.1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              value={newRouter.location}
              onChange={e => setNewRouter({...newRouter, location: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Server Room"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!newRouter.name || !newRouter.ip}>
            <Plus className="w-4 h-4 mr-2" /> Add Router
          </Button>
        </form>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'Vodacom M-Pesa', color: 'border-red-500' },
        { name: 'PawaPay', color: 'border-orange-500' },
        { name: 'Pesapal', color: 'border-blue-500' },
        { name: 'PayPal', color: 'border-blue-800' },
        { name: 'Paystack', color: 'border-teal-500' },
        { name: 'Flutterwave', color: 'border-yellow-500' },
      ].map((provider) => (
        <div key={provider.name} className={`bg-white rounded-2xl shadow-sm border-l-4 ${provider.color} p-6`}>
          <div className="flex justify-between items-start mb-4">
             <h3 className="font-bold text-gray-900">{provider.name} Integration</h3>
             <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                 API Key / Client ID
                 <Tooltip content="Obtain this from your merchant dashboard" />
               </label>
               <div className="relative">
                 <input type="password" value="************************" readOnly className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm" />
                 <Lock className="w-3 h-3 absolute right-3 top-3 text-gray-400" />
               </div>
             </div>
             <div>
               <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                 Secret Key
                 <Tooltip content="Keep this private! Used for server-side auth." />
               </label>
               <div className="relative">
                 <input type="password" value="************************" readOnly className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm" />
                 <Key className="w-3 h-3 absolute right-3 top-3 text-gray-400" />
               </div>
             </div>
             <Button variant="outline" className="w-full text-xs mt-2">Update Credentials</Button>
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar Navigation Item
  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg">
             <Monitor className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Furaha Admin</span>
        </div>
        
        <nav className="flex-1">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="users" icon={Users} label="Users" />
          <NavItem id="packages" icon={Wifi} label="Packages" />
          <NavItem id="vouchers" icon={Ticket} label="Vouchers" />
          <NavItem id="devices" icon={RouterIcon} label="Devices" />
          <NavItem id="billing" icon={CreditCard} label="Billing" />
          <NavItem id="settings" icon={Settings} label="Integrations" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-sm text-gray-500">System Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-500 text-sm">Manage your ISP settings</p>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                 XAMPP Backend: Connected
               </span>
               <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
                 <RefreshCw className="w-5 h-5 text-gray-600" />
               </button>
            </div>
          </div>

          {/* View Router */}
          <div className="animate-fade-in">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'packages' && renderPackages()}
            {activeTab === 'vouchers' && renderVouchers()}
            {activeTab === 'billing' && renderBilling()}
            {activeTab === 'devices' && renderDevices()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all scale-100">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Package?</h3>
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete this package? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={() => setDeleteConfirmationId(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeletePackage} className="flex-1">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Provision Script Modal */}
      {provisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gray-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Terminal className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-lg font-bold font-mono">Mikrotik Terminal Script</h3>
                  <p className="text-xs text-gray-400">Target Router: {selectedRouterIp}</p>
                </div>
              </div>
              <button onClick={() => setProvisionModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <label className="block text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  Your MacBook (XAMPP Server) IP Address:
                  <Tooltip content="The IP address of this computer on the local network" />
                </label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={macbookIp}
                    onChange={(e) => setMacbookIp(e.target.value)}
                    className="flex-1 border border-blue-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 192.168.88.254"
                  />
                  <Button onClick={() => {}} className="text-sm">Update Script</Button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Enter the local IP address of your MacBook running Furaha Surfing. This allows the walled garden to redirect users to your portal.
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-4 relative group shadow-inner">
                <div className="absolute top-4 right-4 flex space-x-2">
                   <button 
                    className={`text-xs px-3 py-1.5 rounded transition-colors flex items-center space-x-1 ${copySuccess ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                    onClick={handleCopyScript}
                  >
                    {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                
                <pre id="mk-script" className="font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-all pt-8">
{`/ip hotspot walled-garden
add dst-address=${macbookIp} action=allow comment="Furaha Billing Server (MacBook)"
add dst-host=*pesapal.com action=allow comment="Pesapal Payment API"
add dst-host=*pawapay.io action=allow comment="PawaPay API"
add dst-host=*vodacom.co.tz action=allow comment="Vodacom M-Pesa"
add dst-host=*paypal.com action=allow comment="PayPal"
add dst-host=*paystack.com action=allow comment="Paystack"
add dst-host=*flutterwave.com action=allow comment="Flutterwave"

/ip hotspot profile
set [find name="hsprof1"] login-by=http-chap,http-pap split-user-domain=no hotspot-address=${selectedRouterIp} html-directory=hotspot

/ip hotspot user profile
set [find default=yes] shared-users=1 rate-limit="" transparent-proxy=yes

# Ensure MacBook is accessible
/ping ${macbookIp} count=3`}
                </pre>
              </div>

              <div className="mt-6 space-y-3">
                 <h4 className="text-sm font-bold text-gray-900 flex items-center">
                   <Monitor className="w-4 h-4 mr-2 text-gray-500"/> 
                   Installation Instructions
                 </h4>
                 <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <li>Open <strong>WinBox</strong> on your computer and connect to the Mikrotik router.</li>
                  <li>Click on the <strong>New Terminal</strong> button in the left sidebar menu.</li>
                  <li>Click the <strong>Copy Script</strong> button below to copy the configuration.</li>
                  <li><strong>Paste</strong> the script into the terminal window (Right Click &gt; Paste).</li>
                  <li>Press <strong>Enter</strong> to execute the commands.</li>
                </ol>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <Button onClick={() => setProvisionModalOpen(false)} variant="secondary">
                Close
              </Button>
              <Button onClick={handleCopyScript} variant="primary">
                 {copySuccess ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                 {copySuccess ? 'Copied to Clipboard' : 'Copy Script'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};