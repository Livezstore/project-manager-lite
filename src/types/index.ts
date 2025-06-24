
export interface Project {
  id: string;
  name: string;
  client: string;
  clientEmail?: string;
  clientPhone?: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  startDate: string;
  deadline: string;
  budget: number;
  description: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  dateReceived: string;
  paymentMethod: string;
  status: 'Pending' | 'Partial' | 'Paid';
  notes?: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'Upcoming' | 'Completed';
  minutes?: string;
  participants: string[];
}
