import { CivicReport, ReportCategory, ReportStatus, ReportPriority } from '@/types/report';

export const mockReports: CivicReport[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the hospital entrance',
    category: 'pothole' as ReportCategory,
    status: 'pending' as ReportStatus,
    priority: 'high' as ReportPriority,
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Main Street, Near City Hospital, New Delhi'
    },
    images: ['/placeholder.svg'],
    citizenName: 'Rajesh Kumar',
    citizenPhone: '+91-9876543210',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    notes: []
  },
  {
    id: '2',
    title: 'Street Light Not Working',
    description: 'Street light has been out for 3 days, creating safety concerns',
    category: 'streetlight' as ReportCategory,
    status: 'in-progress' as ReportStatus,
    priority: 'medium' as ReportPriority,
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'Park Avenue, Sector 12, New Delhi'
    },
    images: ['/placeholder.svg'],
    citizenName: 'Priya Sharma',
    citizenPhone: '+91-9876543211',
    createdAt: new Date('2024-01-14T18:45:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z'),
    assignedTo: 'Electrical Team A',
    estimatedResolution: new Date('2024-01-17T17:00:00Z'),
    notes: ['Electrical team dispatched', 'Parts ordered']
  },
  {
    id: '3',
    title: 'Garbage Collection Issue',
    description: 'Garbage has not been collected for over a week',
    category: 'garbage' as ReportCategory,
    status: 'resolved' as ReportStatus,
    priority: 'high' as ReportPriority,
    location: {
      latitude: 28.5355,
      longitude: 77.3910,
      address: 'Green Park Extension, New Delhi'
    },
    images: ['/placeholder.svg'],
    citizenName: 'Amit Gupta',
    citizenPhone: '+91-9876543212',
    createdAt: new Date('2024-01-10T08:20:00Z'),
    updatedAt: new Date('2024-01-12T14:30:00Z'),
    assignedTo: 'Sanitation Team B',
    actualResolution: new Date('2024-01-12T14:30:00Z'),
    notes: ['Schedule updated', 'Extra collection arranged', 'Issue resolved']
  },
  {
    id: '4',
    title: 'Water Supply Disruption',
    description: 'No water supply for the past 2 days in our area',
    category: 'water_supply' as ReportCategory,
    status: 'pending' as ReportStatus,
    priority: 'critical' as ReportPriority,
    location: {
      latitude: 28.4595,
      longitude: 77.0266,
      address: 'Gurgaon Sector 29, Haryana'
    },
    images: ['/placeholder.svg'],
    citizenName: 'Sunita Devi',
    citizenPhone: '+91-9876543213',
    createdAt: new Date('2024-01-15T06:00:00Z'),
    updatedAt: new Date('2024-01-15T06:00:00Z'),
    notes: []
  },
  {
    id: '5',
    title: 'Blocked Drainage System',
    description: 'Drainage is completely blocked causing water logging',
    category: 'drainage' as ReportCategory,
    status: 'in-progress' as ReportStatus,
    priority: 'high' as ReportPriority,
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
      address: 'Civil Lines, Delhi'
    },
    images: ['/placeholder.svg'],
    citizenName: 'Mohamed Ali',
    citizenPhone: '+91-9876543214',
    createdAt: new Date('2024-01-13T16:20:00Z'),
    updatedAt: new Date('2024-01-14T11:45:00Z'),
    assignedTo: 'Drainage Team C',
    estimatedResolution: new Date('2024-01-16T15:00:00Z'),
    notes: ['Team inspected the area', 'Heavy machinery required']
  }
];

export const categoryIcons = {
  pothole: '🕳️',
  streetlight: '💡',
  garbage: '🗑️',
  water_supply: '💧',
  drainage: '🌊',
  traffic_signal: '🚦',
  road_maintenance: '🛣️',
  park_maintenance: '🌳',
  noise_pollution: '🔊',
  other: '📝'
};

export const categoryLabels = {
  pothole: 'Pothole',
  streetlight: 'Street Light',
  garbage: 'Garbage Collection',
  water_supply: 'Water Supply',
  drainage: 'Drainage',
  traffic_signal: 'Traffic Signal',
  road_maintenance: 'Road Maintenance',
  park_maintenance: 'Park Maintenance',
  noise_pollution: 'Noise Pollution',
  other: 'Other'
};

export const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected'
};

export const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};