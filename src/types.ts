export type DashboardTab = 'risk' | 'family' | 'symptom' | 'simulator' | 'recovery';

export interface RiskInputs {
  systolicBp: number;
  totalCholesterol: number;
  age: number;
  smokingStatus: 'Non-Smoker' | 'Former Smoker' | 'Active Smoker';
  gender: 'Female' | 'Male' | 'Other';
}

export interface RiskAnalysisResult {
  score: number; // e.g. 8.4%
  category: 'Low' | 'Borderline' | 'Intermediate' | 'High';
  summary: string;
}

export interface FamilyRelative {
  id: string;
  relation: 'Mother' | 'Father' | 'Maternal Grandparent' | 'Paternal Grandparent' | 'Sibling';
  conditions: string[]; // e.g. ['Heart Attack <55', 'High BP', 'High Cholesterol']
}

export interface SymptomEntry {
  id: string;
  date: string;
  text: string;
  intensity: number;
  isFemaleContext: boolean;
  flagLabel?: string;
  isAtypicalOrRedFlag?: boolean;
  reasoning?: string;
  doctorDiscussionPoint?: string;
}

export interface LifestyleParams {
  sodiumMg: number; // 1000 - 4500
  exerciseMins: number; // 0 - 300
  cigarettesDaily: number; // 0 - 20
}

export interface RecoveryChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
