export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: ReportPriority;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  citizenId?: string;
  citizenName?: string;
  citizenPhone?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  estimatedResolution?: Date;
  actualResolution?: Date;
  notes: string[];
}

export type ReportCategory = 
  | 'pothole'
  | 'streetlight'
  | 'garbage'
  | 'water_supply'
  | 'drainage'
  | 'traffic_signal'
  | 'road_maintenance'
  | 'park_maintenance'
  | 'noise_pollution'
  | 'other';

export type ReportStatus = 
  | 'pending'
  | 'in-progress'
  | 'resolved'
  | 'rejected';

export type ReportPriority = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  isAdmin: boolean;
}

export interface ReportFilter {
  category?: ReportCategory;
  status?: ReportStatus;
  priority?: ReportPriority;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}