
export interface GeneratedFile {
  fileName: string;
  content: string;
  language: 'kotlin' | 'xml' | 'gradle' | 'json';
}

export interface AppSpecification {
  app_name: string;
  screens: string[];
  features: string[];
  theme: string;
  offline: boolean;
}

export interface AndroidAppProject {
  appName: string;
  packageName: string;
  description: string;
  files: GeneratedFile[];
}

export enum BuildStatus {
  IDLE = 'IDLE',
  GENERATING_CODE = 'GENERATING_CODE',
  COMPILING = 'COMPILING',
  SIGNING = 'SIGNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export enum PlanType {
  FREE = 'Free Plan',
  PRO = 'Pro Plan',
  AGENCY = 'Agency Plan'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ArchitectResponse {
  reply: string;
  spec: AppSpecification;
}
