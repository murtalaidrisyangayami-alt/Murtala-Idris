import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-Memory Database with robust initial seed data for MASANI DATA
let db = {
  users: [
    {
      id: 'usr_admin_1',
      name: 'Super Admin',
      email: 'admin@masanidata.ng',
      phone: '08030000000',
      role: 'admin',
      walletBalance: 250000.0,
      referralCode: 'MASANIADMIN',
      referredBy: null,
      referralEarnings: 15400.0,
      isVerified: true,
      bankName: 'Moniepoint MFB',
      accountNumber: '8123456789',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: 'usr_demo_1',
      name: 'Murtala Idris',
      email: 'murtala@gmail.com',
      phone: '08031234567',
      role: 'user',
      walletBalance: 4850.0,
      referralCode: 'MURTALA2026',
      referredBy: 'MASANIADMIN',
      referralEarnings: 2300.0,
      isVerified: true,
      bankName: 'Opay Digital Services',
      accountNumber: '7012345678',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    }
  ],
  transactions: [
    {
      id: 'TXN-98421056',
      userId: 'usr_demo_1',
      userName: 'Murtala Idris',
      type: 'DATA',
      provider: 'MTN',
      recipient: '08031234567',
      planName: 'MTN 1GB SME Data (30 Days)',
      amount: 260.0,
      status: 'SUCCESSFUL',
      reference: 'MSN-DATA-8839201',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      profit: 25.0
    },
    {
      id: 'TXN-88319024',
      userId: 'usr_demo_1',
      userName: 'Murtala Idris',
      type: 'FUNDING',
      provider: 'PAYSTACK',
      recipient: '08031234567',
      planName: 'Wallet Funding via Paystack Card',
      amount: 5000.0,
      status: 'SUCCESSFUL',
      reference: 'PAYSTACK-TRX-554291',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      profit: 0
    },
    {
      id: 'TXN-77215091',
      userId: 'usr_demo_1',
      userName: 'Murtala Idris',
      type: 'AIRTIME',
      provider: 'AIRTEL',
      recipient: '08023456789',
      planName: 'Airtel AirtimeVTU - ₦1,000',
      amount: 980.0,
      status: 'SUCCESSFUL',
      reference: 'MSN-AIR-4491028',
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      profit: 20.0
    }
  ],
  dataPlans: [
    { id: 'plan_mtn_1', network: 'MTN', name: 'MTN 500MB SME', size: '500MB', validity: '30 Days', price: 140, originalPrice: 150, type: 'SME' },
    { id: 'plan_mtn_2', network: 'MTN', name: 'MTN 1GB SME', size: '1GB', validity: '30 Days', price: 260, originalPrice: 300, type: 'SME' },
    { id: 'plan_mtn_3', network: 'MTN', name: 'MTN 2GB SME', size: '2GB', validity: '30 Days', price: 520, originalPrice: 600, type: 'SME' },
    { id: 'plan_mtn_4', network: 'MTN', name: 'MTN 3GB SME', size: '3GB', validity: '30 Days', price: 780, originalPrice: 900, type: 'SME' },
    { id: 'plan_mtn_5', network: 'MTN', name: 'MTN 5GB SME', size: '5GB', validity: '30 Days', price: 1300, originalPrice: 1500, type: 'SME' },
    { id: 'plan_mtn_6', network: 'MTN', name: 'MTN 10GB Corp Gifting', size: '10GB', validity: '30 Days', price: 2650, originalPrice: 3000, type: 'GIFTING' },
    
    { id: 'plan_airtel_1', network: 'AIRTEL', name: 'Airtel 500MB SME', size: '500MB', validity: '30 Days', price: 145, originalPrice: 160, type: 'SME' },
    { id: 'plan_airtel_2', network: 'AIRTEL', name: 'Airtel 1GB SME', size: '1GB', validity: '30 Days', price: 270, originalPrice: 300, type: 'SME' },
    { id: 'plan_airtel_3', network: 'AIRTEL', name: 'Airtel 2GB SME', size: '2GB', validity: '30 Days', price: 540, originalPrice: 600, type: 'SME' },
    { id: 'plan_airtel_4', network: 'AIRTEL', name: 'Airtel 5GB Gifting', size: '5GB', validity: '30 Days', price: 1350, originalPrice: 1500, type: 'GIFTING' },

    { id: 'plan_glo_1', network: 'GLO', name: 'Glo 1GB Corporate', size: '1GB', validity: '30 Days', price: 245, originalPrice: 280, type: 'CORPORATE' },
    { id: 'plan_glo_2', network: 'GLO', name: 'Glo 2GB Corporate', size: '2GB', validity: '30 Days', price: 490, originalPrice: 550, type: 'CORPORATE' },
    { id: 'plan_glo_3', network: 'GLO', name: 'Glo 5GB Corporate', size: '5GB', validity: '30 Days', price: 1220, originalPrice: 1400, type: 'CORPORATE' },

    { id: 'plan_9mobile_1', network: '9MOBILE', name: '9mobile 1GB Gifting', size: '1GB', validity: '30 Days', price: 250, originalPrice: 300, type: 'GIFTING' },
    { id: 'plan_9mobile_2', network: '9MOBILE', name: '9mobile 2GB Gifting', size: '2GB', validity: '30 Days', price: 500, originalPrice: 600, type: 'GIFTING' }
  ],
  supportTickets: [
    {
      id: 'TKT-5521',
      userId: 'usr_demo_1',
      userName: 'Murtala Idris',
      subject: 'Wallet funding via bank transfer confirmation',
      message: 'Hello, I transferred ₦5,000 to the Moniepoint account but it has not reflected. Please help.',
      status: 'RESOLVED',
      priority: 'HIGH',
      createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      replies: [
        { sender: 'Admin', message: 'Hello Murtala, your transfer has been verified and wallet credited with ₦5,000. Thank you!', timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString() }
      ]
    }
  ],
  settings: {
    siteName: 'MASANI DATA',
    supportPhone: '+234 803 000 0000',
    supportEmail: 'support@masanidata.ng',
    bankName: 'Moniepoint MFB',
    accountNumber: '8123456789',
    accountName: 'MASANI DATA TECHNOLOGIES',
    vtuApiMode: 'LIVE_SIMULATION',
    airtimeDiscount: 2.0, // 2% discount on airtime
    referralBonus: 100.0, // ₦100 per referral bonus
    maintenanceMode: false
  }
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    // Simple password check or demo bypass
    res.json({ success: true, user });
  });

  // Auth: Register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password, referralCode } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    let referredBy = null;
    if (referralCode) {
      const refUser = db.users.find(u => u.referralCode === referralCode.toUpperCase());
      if (refUser) {
        referredBy = refUser.id;
        refUser.walletBalance += db.settings.referralBonus;
        refUser.referralEarnings += db.settings.referralBonus;
      }
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      role: 'user',
      walletBalance: 100.0, // Welcome bonus
      referralCode: name.substring(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000),
      referredBy,
      referralEarnings: 0,
      isVerified: true,
      bankName: 'Opay',
      accountNumber: phone.substring(1),
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    res.json({ success: true, user: newUser });
  });

  // Get user profile & stats
  app.get('/api/user/:id', (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userTxns = db.transactions.filter(t => t.userId === user.id);
    res.json({ user, transactions: userTxns });
  });

  // Fund Wallet
  app.post('/api/wallet/fund', (req, res) => {
    const { userId, amount, method, reference } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid funding amount' });
    }

    user.walletBalance += numAmount;

    const txn = {
      id: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
      userId: user.id,
      userName: user.name,
      type: 'FUNDING',
      provider: method || 'PAYSTACK',
      recipient: user.phone,
      planName: `Wallet Funding via ${method || 'Paystack'}`,
      amount: numAmount,
      status: 'SUCCESSFUL',
      reference: reference || 'MSN-FUND-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toISOString(),
      profit: 0
    };

    db.transactions.unshift(txn);
    res.json({ success: true, user, transaction: txn });
  });

  // Get Data Plans
  app.get('/api/vtu/plans', (req, res) => {
    res.json({ success: true, plans: db.dataPlans, settings: db.settings });
  });

  // Buy Data Subscription
  app.post('/api/vtu/buy-data', (req, res) => {
    const { userId, network, planId, phone } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const plan = db.dataPlans.find(p => p.id === planId);
    if (!plan) return res.status(404).json({ error: 'Data plan not found' });

    if (user.walletBalance < plan.price) {
      return res.status(400).json({ error: 'Insufficient wallet balance. Please fund your wallet.' });
    }

    // Deduct wallet
    user.walletBalance -= plan.price;

    const txn = {
      id: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
      userId: user.id,
      userName: user.name,
      type: 'DATA',
      provider: network.toUpperCase(),
      recipient: phone,
      planName: plan.name,
      amount: plan.price,
      status: 'SUCCESSFUL',
      reference: 'MSN-DATA-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      profit: plan.price - (plan.originalPrice || (plan.price * 0.9))
    };

    db.transactions.unshift(txn);
    res.json({ success: true, user, transaction: txn });
  });

  // Buy Airtime
  app.post('/api/vtu/buy-airtime', (req, res) => {
    const { userId, network, amount, phone } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 50) {
      return res.status(400).json({ error: 'Minimum airtime purchase is ₦50' });
    }

    // Airtime discount e.g. 2% off
    const discount = db.settings.airtimeDiscount || 2;
    const payable = numAmount * (1 - discount / 100);

    if (user.walletBalance < payable) {
      return res.status(400).json({ error: 'Insufficient wallet balance.' });
    }

    user.walletBalance -= payable;

    const txn = {
      id: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
      userId: user.id,
      userName: user.name,
      type: 'AIRTIME',
      provider: network.toUpperCase(),
      recipient: phone,
      planName: `${network.toUpperCase()} Airtime - ₦${numAmount.toLocaleString()}`,
      amount: payable,
      status: 'SUCCESSFUL',
      reference: 'MSN-AIR-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      profit: numAmount - payable
    };

    db.transactions.unshift(txn);
    res.json({ success: true, user, transaction: txn });
  });

  // Support Tickets
  app.get('/api/support/:userId', (req, res) => {
    const tickets = db.supportTickets.filter(t => t.userId === req.params.userId || req.params.userId === 'usr_admin_1');
    res.json({ success: true, tickets });
  });

  app.post('/api/support', (req, res) => {
    const { userId, subject, message, priority } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newTicket = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      userId: user.id,
      userName: user.name,
      subject,
      message,
      status: 'OPEN',
      priority: priority || 'MEDIUM',
      createdAt: new Date().toISOString(),
      replies: []
    };

    db.supportTickets.unshift(newTicket);
    res.json({ success: true, ticket: newTicket });
  });

  // --- Admin Routes ---
  app.get('/api/admin/dashboard', (req, res) => {
    const totalUsers = db.users.length;
    const totalRevenue = db.transactions.reduce((acc, t) => acc + (t.profit || 0), 0);
    const totalVolume = db.transactions.reduce((acc, t) => t.status === 'SUCCESSFUL' ? acc + t.amount : acc, 0);
    const totalTransactions = db.transactions.length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRevenue,
        totalVolume,
        totalTransactions
      },
      users: db.users,
      transactions: db.transactions,
      dataPlans: db.dataPlans,
      supportTickets: db.supportTickets,
      settings: db.settings
    });
  });

  app.post('/api/admin/plans', (req, res) => {
    const { id, network, name, size, validity, price, type } = req.body;
    if (id) {
      const plan = db.dataPlans.find(p => p.id === id);
      if (plan) {
        plan.network = network;
        plan.name = name;
        plan.size = size;
        plan.validity = validity;
        plan.price = parseFloat(price);
        plan.type = type;
      }
    } else {
      const newPlan = {
        id: 'plan_' + Math.random().toString(36).substring(2, 8),
        network,
        name,
        size,
        validity,
        price: parseFloat(price),
        originalPrice: parseFloat(price) * 1.1,
        type: type || 'SME'
      };
      db.dataPlans.push(newPlan);
    }
    res.json({ success: true, dataPlans: db.dataPlans });
  });

  app.post('/api/admin/user-balance', (req, res) => {
    const { userId, amount, action } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const val = parseFloat(amount);
    if (action === 'CREDIT') {
      user.walletBalance += val;
    } else if (action === 'DEBIT') {
      user.walletBalance = Math.max(0, user.walletBalance - val);
    }
    res.json({ success: true, user });
  });

  // Vite middleware in dev
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`MASANI DATA VTU Server running on http://localhost:${port}`);
  });
}

startServer();
