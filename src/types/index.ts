export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  id: string;
  projectId: string;
  timestamp: any; // Firestore Timestamp
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  description?: string;
  createdAt: any;
  createdBy: string;
  status: 'active' | 'inactive';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'viewer';
  assignedProjects: string[]; // List of project IDs
}
