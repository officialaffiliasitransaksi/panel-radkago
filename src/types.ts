export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface Customer {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  wallet_balance: number;
  status: UserStatus;
  createdAt: string;
  registeredAreaId: string;
}

export type DriverStatus = 'Active' | 'Pending' | 'Suspended';
export type VehicleType = 'Motor' | 'Mobil' | 'Bentor' | 'Kurir';

export interface Driver {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  wallet_balance: number;
  vehicleType: VehicleType;
  vehiclePlate: string;
  rating: number;
  status: DriverStatus;
  registeredAreaId: string;
  createdAt: string;
}

export type MerchantStatus = 'Active' | 'Pending' | 'Suspended';
export type MerchantCategory = 'Food' | 'Mart' | 'Express' | 'Pharmacy';

export interface Merchant {
  id: string;
  username: string;
  name: string; // Owner name
  businessName: string; // Shop/Restaurant name
  phone: string;
  email: string;
  wallet_balance: number;
  category: MerchantCategory;
  commissionRate: number; // in percent, e.g. 15 for 15%
  status: MerchantStatus;
  registeredAreaId: string;
  createdAt: string;
}

export type AreaType = 'Kabupaten' | 'Kota';

export interface PartnershipArea {
  id: string;
  type: AreaType;
  name: string; // e.g. Surabaya, Sidoarjo
  regionalPartnerName: string; // Area Coordinator name
  phone: string;
  commissionRate: number; // Area coordinator's profit share (e.g. 2.5%)
  status: 'Active' | 'Inactive';
  serviceFeeMultiplier: number; // e.g. 1.0, 1.2 (regional price adjustments)
  totalRevenue: number; // Accumulated regional transaction revenue
}

export interface ActivityLog {
  id: string;
  category: 'Customer' | 'Driver' | 'Merchant' | 'Partnership';
  type: 'Create' | 'Update' | 'Delete' | 'Transaction' | 'Verify';
  description: string;
  timestamp: string;
  user: string;
}
