export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  walletBalance: number;
  referralCode: string;
  referredBy?: string | null;
  referralEarnings: number;
  isVerified: boolean;
  bankName: string;
  accountNumber: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'DATA' | 'AIRTIME' | 'FUNDING' | 'CABLE' | 'ELECTRICITY';
  provider: string;
  recipient: string;
  planName: string;
  amount: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED' | 'REFUNDED';
  reference: string;
  timestamp: string;
  profit?: number;
}

export interface DataPlan {
  id: string;
  network: 'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE';
  name: string;
  size: string;
  validity: string;
  price: number;
  originalPrice?: number;
  type: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  replies: { sender: string; message: string; timestamp: string }[];
}

export interface AppSettings {
  siteName: string;
  supportPhone: string;
  supportEmail: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  vtuApiMode: string;
  airtimeDiscount: number;
  referralBonus: number;
  maintenanceMode: boolean;
}
