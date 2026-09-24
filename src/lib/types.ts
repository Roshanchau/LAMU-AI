export interface AntimicrobialRecord {
  id: string;
  drugName: string;
  drugClass: string;
  species: string;
  speciesCategory: 'Major Livestock' | 'Poultry' | 'Minor Species' | 'Companion Animals';
  route: string;
  indication: string;
  dosageMgKg: number;
  durationDays: number;
  withdrawalPeriodDays: number;
  year: number;
  quarter: number;
  region: string;
  source: string;
  status: 'Approved' | 'Extra-Label' | 'Prohibited';
}

export interface UsageTrend {
  year: number;
  quarter: number;
  label: string;
  cattle: number;
  swine: number;
  poultry: number;
  sheep: number;
  goats: number;
  horses: number;
  dogs: number;
  cats: number;
}

export interface DrugClassDistribution {
  drugClass: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SpeciesBreakdown {
  species: string;
  category: string;
  totalRecords: number;
  uniqueDrugs: number;
  avgWithdrawal: number;
}

export interface RegionalData {
  region: string;
  totalUsage: number;
  topDrug: string;
  topSpecies: string;
}

export interface DashboardStats {
  totalRecords: number;
  uniqueDrugs: number;
  speciesCovered: number;
  dataSources: number;
  avgWithdrawalDays: number;
  extraLabelPercentage: number;
}

export interface CrawlerSource {
  name: string;
  url: string;
  type: 'Regulatory' | 'Academic' | 'Clinical' | 'Repository';
  lastCrawled: string;
  recordsFound: number;
  status: 'Active' | 'Pending' | 'Error';
}

export interface QueryResult {
  answer: string;
  sources: string[];
  confidence: number;
  relatedDrugs: string[];
}
