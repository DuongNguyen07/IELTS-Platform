export type TestMode = 'timed' | 'practice';

export interface TestPart {
  id: string;
  title: string;
  subtitle: string;
  duration: number; 
  checked: boolean;
  enabled: boolean;
}
