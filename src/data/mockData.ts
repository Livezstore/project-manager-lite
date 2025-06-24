
import { Project, Requirement, Payment } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    client: 'Tech Solutions Inc',
    clientEmail: 'contact@techsolutions.com',
    clientPhone: '+1 (555) 123-4567',
    status: 'In Progress',
    startDate: '2024-01-15',
    deadline: '2024-03-15',
    budget: 5000,
    description: 'Full-stack e-commerce platform with payment integration'
  },
  {
    id: '2',
    name: 'Mobile App Design',
    client: 'Startup Hub',
    clientEmail: 'hello@startuphub.com',
    clientPhone: '+1 (555) 987-6543',
    status: 'Planning',
    startDate: '2024-02-01',
    deadline: '2024-04-01',
    budget: 3500,
    description: 'UI/UX design for productivity mobile application'
  },
  {
    id: '3',
    name: 'Corporate Dashboard',
    client: 'Global Corp',
    clientEmail: 'projects@globalcorp.com',
    clientPhone: '+1 (555) 456-7890',
    status: 'Completed',
    startDate: '2023-11-01',
    deadline: '2024-01-01',
    budget: 8000,
    description: 'Analytics dashboard for internal company metrics'
  }
];

export const mockRequirements: Requirement[] = [
  {
    id: '1',
    projectId: '1',
    title: 'User Authentication System',
    description: 'Implement secure login/logout functionality',
    status: 'Done',
    priority: 'High',
    notes: 'Used JWT tokens for security',
    createdAt: '2024-01-16'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Product Catalog',
    description: 'Display products with filtering and search',
    status: 'In Review',
    priority: 'High',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    projectId: '1',
    title: 'Shopping Cart',
    description: 'Add/remove items and checkout process',
    status: 'Pending',
    priority: 'Medium',
    createdAt: '2024-01-25'
  },
  {
    id: '4',
    projectId: '2',
    title: 'Wireframes',
    description: 'Create initial app wireframes',
    status: 'Done',
    priority: 'High',
    createdAt: '2024-02-02'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    projectId: '1',
    amount: 2500,
    dateReceived: '2024-01-20',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    notes: 'Initial payment - 50% upfront'
  },
  {
    id: '2',
    projectId: '3',
    amount: 8000,
    dateReceived: '2024-01-05',
    paymentMethod: 'PayPal',
    status: 'Paid',
    notes: 'Full payment upon completion'
  },
  {
    id: '3',
    projectId: '2',
    amount: 1750,
    dateReceived: '2024-02-01',
    paymentMethod: 'Credit Card',
    status: 'Pending',
    notes: 'Awaiting client confirmation'
  }
];
