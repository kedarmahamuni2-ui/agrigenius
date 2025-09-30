
export enum Tab {
  CropDoctor = 'CropDoctor',
  FarmingAssistant = 'FarmingAssistant',
  MarketWatch = 'MarketWatch',
}

export interface DiagnosisResult {
  is_healthy: boolean;
  disease: string;
  description: string;
  causes: string[];
  organic_treatments: string[];
  chemical_treatments: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MarketSource {
  web: {
    uri: string;
    title: string;
  }
}

export interface MarketTrend {
  summary: string;
  sources: MarketSource[];
}
