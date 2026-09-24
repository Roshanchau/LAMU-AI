import { AntimicrobialRecord, UsageTrend, DrugClassDistribution, SpeciesBreakdown, RegionalData, DashboardStats, CrawlerSource } from '@/lib/types';

// ========== ANTIMICROBIAL RECORDS ==========
export const antimicrobialRecords: AntimicrobialRecord[] = [
  // CATTLE
  { id: 'AMR-001', drugName: 'Ceftiofur', drugClass: 'Cephalosporins', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Bovine Respiratory Disease', dosageMgKg: 2.2, durationDays: 5, withdrawalPeriodDays: 13, year: 2024, quarter: 1, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-002', drugName: 'Enrofloxacin', drugClass: 'Fluoroquinolones', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Subcutaneous', indication: 'Bovine Respiratory Disease', dosageMgKg: 7.5, durationDays: 3, withdrawalPeriodDays: 28, year: 2024, quarter: 1, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-003', drugName: 'Oxytetracycline', drugClass: 'Tetracyclines', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intravenous', indication: 'Anaplasmosis', dosageMgKg: 11.0, durationDays: 5, withdrawalPeriodDays: 28, year: 2024, quarter: 2, region: 'Southwest', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-004', drugName: 'Tulathromycin', drugClass: 'Macrolides', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Subcutaneous', indication: 'Bovine Respiratory Disease', dosageMgKg: 2.5, durationDays: 1, withdrawalPeriodDays: 18, year: 2024, quarter: 2, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-005', drugName: 'Florfenicol', drugClass: 'Amphenicols', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Bovine Respiratory Disease', dosageMgKg: 20.0, durationDays: 2, withdrawalPeriodDays: 38, year: 2024, quarter: 3, region: 'Northeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-006', drugName: 'Penicillin G', drugClass: 'Penicillins', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Foot Rot', dosageMgKg: 6.6, durationDays: 5, withdrawalPeriodDays: 10, year: 2024, quarter: 3, region: 'Midwest', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-007', drugName: 'Sulfadimethoxine', drugClass: 'Sulfonamides', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Oral', indication: 'Coccidiosis', dosageMgKg: 55.0, durationDays: 5, withdrawalPeriodDays: 7, year: 2023, quarter: 4, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-008', drugName: 'Gentamicin', drugClass: 'Aminoglycosides', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intrauterine', indication: 'Metritis', dosageMgKg: 5.0, durationDays: 3, withdrawalPeriodDays: 60, year: 2023, quarter: 3, region: 'West', source: 'VMTH', status: 'Extra-Label' },
  // SWINE
  { id: 'AMR-009', drugName: 'Tylosin', drugClass: 'Macrolides', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Oral (Water)', indication: 'Swine Dysentery', dosageMgKg: 4.4, durationDays: 5, withdrawalPeriodDays: 2, year: 2024, quarter: 1, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-010', drugName: 'Lincomycin', drugClass: 'Lincosamides', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Oral (Feed)', indication: 'Mycoplasma Pneumonia', dosageMgKg: 11.0, durationDays: 21, withdrawalPeriodDays: 6, year: 2024, quarter: 2, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-011', drugName: 'Tiamulin', drugClass: 'Pleuromutilins', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Oral (Water)', indication: 'Swine Dysentery', dosageMgKg: 8.8, durationDays: 5, withdrawalPeriodDays: 3, year: 2024, quarter: 2, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-012', drugName: 'Ceftiofur', drugClass: 'Cephalosporins', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Streptococcus suis', dosageMgKg: 5.0, durationDays: 3, withdrawalPeriodDays: 14, year: 2024, quarter: 3, region: 'Northeast', source: 'VMTH', status: 'Approved' },
  // POULTRY
  { id: 'AMR-013', drugName: 'Chlortetracycline', drugClass: 'Tetracyclines', species: 'Broiler Chickens', speciesCategory: 'Poultry', route: 'Oral (Feed)', indication: 'Chronic Respiratory Disease', dosageMgKg: 22.0, durationDays: 7, withdrawalPeriodDays: 1, year: 2024, quarter: 1, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-014', drugName: 'Sulfadimethoxine', drugClass: 'Sulfonamides', species: 'Broiler Chickens', speciesCategory: 'Poultry', route: 'Oral (Water)', indication: 'Coccidiosis', dosageMgKg: 50.0, durationDays: 6, withdrawalPeriodDays: 5, year: 2024, quarter: 2, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-015', drugName: 'Erythromycin', drugClass: 'Macrolides', species: 'Layer Hens', speciesCategory: 'Poultry', route: 'Oral (Water)', indication: 'Mycoplasma gallisepticum', dosageMgKg: 15.0, durationDays: 5, withdrawalPeriodDays: 2, year: 2024, quarter: 2, region: 'Southeast', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-016', drugName: 'Gentamicin', drugClass: 'Aminoglycosides', species: 'Turkeys', speciesCategory: 'Poultry', route: 'Subcutaneous', indication: 'E. coli Septicemia', dosageMgKg: 10.0, durationDays: 3, withdrawalPeriodDays: 35, year: 2024, quarter: 3, region: 'Midwest', source: 'FARAD', status: 'Extra-Label' },
  // SHEEP & GOATS (Minor Species)
  { id: 'AMR-017', drugName: 'Penicillin G', drugClass: 'Penicillins', species: 'Sheep', speciesCategory: 'Minor Species', route: 'Intramuscular', indication: 'Foot Rot', dosageMgKg: 22.0, durationDays: 5, withdrawalPeriodDays: 9, year: 2024, quarter: 1, region: 'West', source: 'FARAD', status: 'Extra-Label' },
  { id: 'AMR-018', drugName: 'Oxytetracycline', drugClass: 'Tetracyclines', species: 'Goats', speciesCategory: 'Minor Species', route: 'Intramuscular', indication: 'Caseous Lymphadenitis', dosageMgKg: 10.0, durationDays: 3, withdrawalPeriodDays: 35, year: 2024, quarter: 2, region: 'Southeast', source: 'VMTH', status: 'Extra-Label' },
  { id: 'AMR-019', drugName: 'Ceftiofur', drugClass: 'Cephalosporins', species: 'Goats', speciesCategory: 'Minor Species', route: 'Subcutaneous', indication: 'Respiratory Disease', dosageMgKg: 2.2, durationDays: 5, withdrawalPeriodDays: 21, year: 2024, quarter: 3, region: 'Midwest', source: 'FARAD', status: 'Extra-Label' },
  { id: 'AMR-020', drugName: 'Florfenicol', drugClass: 'Amphenicols', species: 'Sheep', speciesCategory: 'Minor Species', route: 'Intramuscular', indication: 'Respiratory Disease', dosageMgKg: 20.0, durationDays: 2, withdrawalPeriodDays: 42, year: 2023, quarter: 4, region: 'West', source: 'VMTH', status: 'Extra-Label' },
  // HORSES
  { id: 'AMR-021', drugName: 'Trimethoprim-Sulfa', drugClass: 'Sulfonamides', species: 'Horses', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Skin Infections', dosageMgKg: 30.0, durationDays: 10, withdrawalPeriodDays: 0, year: 2024, quarter: 1, region: 'Northeast', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-022', drugName: 'Metronidazole', drugClass: 'Nitroimidazoles', species: 'Horses', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Clostridioides difficile', dosageMgKg: 15.0, durationDays: 7, withdrawalPeriodDays: 0, year: 2024, quarter: 2, region: 'Southeast', source: 'VMTH', status: 'Extra-Label' },
  { id: 'AMR-023', drugName: 'Enrofloxacin', drugClass: 'Fluoroquinolones', species: 'Horses', speciesCategory: 'Companion Animals', route: 'Intravenous', indication: 'Septicemia', dosageMgKg: 5.0, durationDays: 7, withdrawalPeriodDays: 0, year: 2024, quarter: 3, region: 'West', source: 'VMTH', status: 'Extra-Label' },
  // DOGS
  { id: 'AMR-024', drugName: 'Amoxicillin-Clavulanate', drugClass: 'Penicillins', species: 'Dogs', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Urinary Tract Infection', dosageMgKg: 13.75, durationDays: 14, withdrawalPeriodDays: 0, year: 2024, quarter: 1, region: 'Midwest', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-025', drugName: 'Cephalexin', drugClass: 'Cephalosporins', species: 'Dogs', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Pyoderma', dosageMgKg: 22.0, durationDays: 21, withdrawalPeriodDays: 0, year: 2024, quarter: 2, region: 'Northeast', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-026', drugName: 'Doxycycline', drugClass: 'Tetracyclines', species: 'Dogs', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Lyme Disease', dosageMgKg: 5.0, durationDays: 28, withdrawalPeriodDays: 0, year: 2024, quarter: 2, region: 'Northeast', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-027', drugName: 'Marbofloxacin', drugClass: 'Fluoroquinolones', species: 'Dogs', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Deep Pyoderma', dosageMgKg: 2.75, durationDays: 28, withdrawalPeriodDays: 0, year: 2024, quarter: 3, region: 'Southeast', source: 'VMTH', status: 'Approved' },
  // CATS
  { id: 'AMR-028', drugName: 'Amoxicillin', drugClass: 'Penicillins', species: 'Cats', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Upper Respiratory Infection', dosageMgKg: 11.0, durationDays: 10, withdrawalPeriodDays: 0, year: 2024, quarter: 1, region: 'West', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-029', drugName: 'Clindamycin', drugClass: 'Lincosamides', species: 'Cats', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Dental Abscess', dosageMgKg: 11.0, durationDays: 14, withdrawalPeriodDays: 0, year: 2024, quarter: 2, region: 'Midwest', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-030', drugName: 'Azithromycin', drugClass: 'Macrolides', species: 'Cats', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Bartonella henselae', dosageMgKg: 5.0, durationDays: 21, withdrawalPeriodDays: 0, year: 2024, quarter: 3, region: 'Southeast', source: 'VMTH', status: 'Extra-Label' },
  // MORE HISTORICAL DATA (2023)
  { id: 'AMR-031', drugName: 'Ceftiofur', drugClass: 'Cephalosporins', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Bovine Respiratory Disease', dosageMgKg: 2.2, durationDays: 5, withdrawalPeriodDays: 13, year: 2023, quarter: 1, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-032', drugName: 'Tulathromycin', drugClass: 'Macrolides', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Subcutaneous', indication: 'Bovine Respiratory Disease', dosageMgKg: 2.5, durationDays: 1, withdrawalPeriodDays: 18, year: 2023, quarter: 2, region: 'Southwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-033', drugName: 'Tylosin', drugClass: 'Macrolides', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Oral (Feed)', indication: 'Ileitis', dosageMgKg: 4.4, durationDays: 21, withdrawalPeriodDays: 2, year: 2023, quarter: 1, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-034', drugName: 'Chlortetracycline', drugClass: 'Tetracyclines', species: 'Swine', speciesCategory: 'Major Livestock', route: 'Oral (Feed)', indication: 'Bacterial Enteritis', dosageMgKg: 22.0, durationDays: 14, withdrawalPeriodDays: 1, year: 2023, quarter: 2, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-035', drugName: 'Enrofloxacin', drugClass: 'Fluoroquinolones', species: 'Dogs', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Complicated UTI', dosageMgKg: 10.0, durationDays: 14, withdrawalPeriodDays: 0, year: 2023, quarter: 3, region: 'West', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-036', drugName: 'Doxycycline', drugClass: 'Tetracyclines', species: 'Cats', speciesCategory: 'Companion Animals', route: 'Oral', indication: 'Chlamydia felis', dosageMgKg: 5.0, durationDays: 28, withdrawalPeriodDays: 0, year: 2023, quarter: 4, region: 'Northeast', source: 'VMTH', status: 'Approved' },
  // 2022 DATA
  { id: 'AMR-037', drugName: 'Tilmicosin', drugClass: 'Macrolides', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Subcutaneous', indication: 'Bovine Respiratory Disease', dosageMgKg: 10.0, durationDays: 1, withdrawalPeriodDays: 28, year: 2022, quarter: 1, region: 'Midwest', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-038', drugName: 'Ampicillin', drugClass: 'Penicillins', species: 'Cattle', speciesCategory: 'Major Livestock', route: 'Intramuscular', indication: 'Neonatal Septicemia', dosageMgKg: 11.0, durationDays: 5, withdrawalPeriodDays: 6, year: 2022, quarter: 2, region: 'Southeast', source: 'VMTH', status: 'Approved' },
  { id: 'AMR-039', drugName: 'Spectinomycin', drugClass: 'Aminoglycosides', species: 'Broiler Chickens', speciesCategory: 'Poultry', route: 'Subcutaneous', indication: 'E. coli Infection', dosageMgKg: 10.0, durationDays: 3, withdrawalPeriodDays: 5, year: 2022, quarter: 3, region: 'Southeast', source: 'FARAD', status: 'Approved' },
  { id: 'AMR-040', drugName: 'Penicillin G', drugClass: 'Penicillins', species: 'Goats', speciesCategory: 'Minor Species', route: 'Intramuscular', indication: 'Listeriosis', dosageMgKg: 22.0, durationDays: 14, withdrawalPeriodDays: 30, year: 2022, quarter: 4, region: 'Northeast', source: 'VMTH', status: 'Extra-Label' },
];

// ========== USAGE TRENDS (Quarterly from 2022-2024) ==========
export const usageTrends: UsageTrend[] = [
  { year: 2022, quarter: 1, label: 'Q1 2022', cattle: 245, swine: 178, poultry: 312, sheep: 34, goats: 28, horses: 56, dogs: 189, cats: 134 },
  { year: 2022, quarter: 2, label: 'Q2 2022', cattle: 267, swine: 192, poultry: 298, sheep: 41, goats: 32, horses: 62, dogs: 201, cats: 142 },
  { year: 2022, quarter: 3, label: 'Q3 2022', cattle: 289, swine: 184, poultry: 324, sheep: 38, goats: 29, horses: 58, dogs: 215, cats: 151 },
  { year: 2022, quarter: 4, label: 'Q4 2022', cattle: 231, swine: 167, poultry: 278, sheep: 31, goats: 25, horses: 49, dogs: 178, cats: 126 },
  { year: 2023, quarter: 1, label: 'Q1 2023', cattle: 278, swine: 198, poultry: 341, sheep: 42, goats: 35, horses: 64, dogs: 224, cats: 158 },
  { year: 2023, quarter: 2, label: 'Q2 2023', cattle: 312, swine: 215, poultry: 356, sheep: 48, goats: 39, horses: 71, dogs: 238, cats: 167 },
  { year: 2023, quarter: 3, label: 'Q3 2023', cattle: 298, swine: 207, poultry: 367, sheep: 45, goats: 37, horses: 67, dogs: 245, cats: 172 },
  { year: 2023, quarter: 4, label: 'Q4 2023', cattle: 265, swine: 189, poultry: 312, sheep: 37, goats: 31, horses: 54, dogs: 212, cats: 148 },
  { year: 2024, quarter: 1, label: 'Q1 2024', cattle: 321, swine: 234, poultry: 389, sheep: 52, goats: 43, horses: 78, dogs: 267, cats: 187 },
  { year: 2024, quarter: 2, label: 'Q2 2024', cattle: 345, swine: 248, poultry: 412, sheep: 58, goats: 47, horses: 83, dogs: 289, cats: 198 },
  { year: 2024, quarter: 3, label: 'Q3 2024', cattle: 334, swine: 241, poultry: 398, sheep: 54, goats: 44, horses: 79, dogs: 278, cats: 192 },
];

// ========== DRUG CLASS DISTRIBUTION ==========
export const drugClassDistribution: DrugClassDistribution[] = [
  { drugClass: 'Tetracyclines', count: 487, percentage: 26.3, color: '#3b82f6' },
  { drugClass: 'Penicillins', count: 398, percentage: 21.5, color: '#22c55e' },
  { drugClass: 'Macrolides', count: 312, percentage: 16.8, color: '#f59e0b' },
  { drugClass: 'Cephalosporins', count: 234, percentage: 12.6, color: '#ef4444' },
  { drugClass: 'Sulfonamides', count: 178, percentage: 9.6, color: '#8b5cf6' },
  { drugClass: 'Fluoroquinolones', count: 112, percentage: 6.0, color: '#06b6d4' },
  { drugClass: 'Aminoglycosides', count: 67, percentage: 3.6, color: '#ec4899' },
  { drugClass: 'Others', count: 66, percentage: 3.6, color: '#6b7280' },
];

// ========== SPECIES BREAKDOWN ==========
export const speciesBreakdown: SpeciesBreakdown[] = [
  { species: 'Cattle', category: 'Major Livestock', totalRecords: 892, uniqueDrugs: 24, avgWithdrawal: 21.4 },
  { species: 'Swine', category: 'Major Livestock', totalRecords: 634, uniqueDrugs: 18, avgWithdrawal: 8.2 },
  { species: 'Broiler Chickens', category: 'Poultry', totalRecords: 567, uniqueDrugs: 12, avgWithdrawal: 3.8 },
  { species: 'Layer Hens', category: 'Poultry', totalRecords: 345, uniqueDrugs: 8, avgWithdrawal: 4.2 },
  { species: 'Turkeys', category: 'Poultry', totalRecords: 289, uniqueDrugs: 10, avgWithdrawal: 5.6 },
  { species: 'Dogs', category: 'Companion Animals', totalRecords: 456, uniqueDrugs: 22, avgWithdrawal: 0 },
  { species: 'Cats', category: 'Companion Animals', totalRecords: 312, uniqueDrugs: 16, avgWithdrawal: 0 },
  { species: 'Horses', category: 'Companion Animals', totalRecords: 234, uniqueDrugs: 15, avgWithdrawal: 0 },
  { species: 'Sheep', category: 'Minor Species', totalRecords: 145, uniqueDrugs: 9, avgWithdrawal: 28.6 },
  { species: 'Goats', category: 'Minor Species', totalRecords: 134, uniqueDrugs: 11, avgWithdrawal: 32.1 },
];

// ========== REGIONAL DATA ==========
export const regionalData: RegionalData[] = [
  { region: 'Midwest', totalUsage: 1245, topDrug: 'Ceftiofur', topSpecies: 'Cattle' },
  { region: 'Southeast', totalUsage: 987, topDrug: 'Chlortetracycline', topSpecies: 'Broiler Chickens' },
  { region: 'Northeast', totalUsage: 654, topDrug: 'Cephalexin', topSpecies: 'Dogs' },
  { region: 'West', totalUsage: 543, topDrug: 'Penicillin G', topSpecies: 'Sheep' },
  { region: 'Southwest', totalUsage: 425, topDrug: 'Oxytetracycline', topSpecies: 'Cattle' },
];

// ========== DASHBOARD STATS ==========
export const dashboardStats: DashboardStats = {
  totalRecords: 4008,
  uniqueDrugs: 42,
  speciesCovered: 10,
  dataSources: 4,
  avgWithdrawalDays: 14.8,
  extraLabelPercentage: 23.4,
};

// ========== CRAWLER SOURCES ==========
export const crawlerSources: CrawlerSource[] = [
  { name: 'USDA NAL Project (Grant #1U01FD008416-01)', url: 'https://www.nal.usda.gov/research-tools/food-safety-research-projects/bridging-critical-data-gaps-veterinary-medicine-artificial-intelligence-and-advanced-large-language', type: 'Regulatory', lastCrawled: '2024-09-24T15:20:00Z', recordsFound: 31, status: 'Active' },
  { name: 'FARAD Databank (Cornell/KSU)', url: 'https://www.farad.org/digest/cephalosporin', type: 'Regulatory', lastCrawled: '2024-09-15T10:30:00Z', recordsFound: 2456, status: 'Active' },
  { name: 'FDA CVM Animal Drug Safety', url: 'https://www.fda.gov/animal-veterinary/cvm-updates/antimicrobial-monitoring', type: 'Regulatory', lastCrawled: '2024-09-14T08:15:00Z', recordsFound: 892, status: 'Active' },
  { name: 'EMA CVMP Antimicrobial Advice', url: 'https://www.ema.europa.eu/veterinary-regulatory/overview/antimicrobial-advice', type: 'Regulatory', lastCrawled: '2024-09-13T14:45:00Z', recordsFound: 345, status: 'Active' },
  { name: 'NCBI PubMed Central Resistance', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC_LAMU_VET', type: 'Academic', lastCrawled: '2024-09-11T16:30:00Z', recordsFound: 234, status: 'Active' },
  { name: 'Cornell CVM Pharmacology Digest', url: 'https://www.vet.cornell.edu/animal-health-diagnostic-center/farad-data', type: 'Clinical', lastCrawled: '2024-09-12T09:00:00Z', recordsFound: 567, status: 'Active' },
  { name: 'AVMA Veterinary Journals', url: 'https://avmajournals.avma.org', type: 'Academic', lastCrawled: '2024-09-10T11:00:00Z', recordsFound: 178, status: 'Pending' },
  { name: 'WHO AMR Surveillance', url: 'https://www.who.int/health-topics/antimicrobial-resistance', type: 'Regulatory', lastCrawled: '2024-09-08T13:15:00Z', recordsFound: 89, status: 'Active' },
];

// ========== PREDEFINED AI RESPONSES ==========
export const predefinedResponses: Record<string, { answer: string; sources: string[]; confidence: number; relatedDrugs: string[] }> = {
  'withdrawal': {
    answer: 'Based on the FARAD database and FDA regulations, withdrawal periods vary significantly by drug, species, and route of administration. For cattle, cephalosporins like Ceftiofur have a withdrawal period of 13 days (meat), while fluoroquinolones like Enrofloxacin require 28 days. Aminoglycosides used extra-label (e.g., Gentamicin intrauterine) may require up to 60 days. For swine, most approved drugs have relatively short withdrawal periods (1-14 days). Minor species often have extended withdrawal times due to limited pharmacokinetic data.',
    sources: ['FARAD Database', 'FDA Green Book', 'USDA APHIS'],
    confidence: 0.94,
    relatedDrugs: ['Ceftiofur', 'Enrofloxacin', 'Gentamicin', 'Oxytetracycline'],
  },
  'resistance': {
    answer: 'Antimicrobial resistance trends from 2022-2024 show increasing concern in several drug classes. Tetracycline resistance has been detected in 34% of E. coli isolates from cattle. Fluoroquinolone resistance remains relatively low in food animals (< 5%) due to restricted use. The highest resistance rates are seen in Enterococcus spp. from poultry, particularly to macrolides (28%) and tetracyclines (41%). LAMU-AI tracks these patterns by integrating data from FARAD case reports and NARMS surveillance data.',
    sources: ['FARAD Database', 'NARMS', 'PubMed Central'],
    confidence: 0.87,
    relatedDrugs: ['Oxytetracycline', 'Enrofloxacin', 'Tylosin', 'Chlortetracycline'],
  },
  'cattle': {
    answer: 'Cattle represent the largest segment of antimicrobial usage in our database with 892 records across 24 unique drugs. The most commonly used drug class is Cephalosporins (primarily Ceftiofur for BRD), followed by Macrolides (Tulathromycin, Tilmicosin) and Tetracyclines (Oxytetracycline). Usage peaks in Q2-Q3 coinciding with feedlot placement and respiratory disease season. The Midwest region accounts for 42% of all cattle antimicrobial records, reflecting the concentration of feedlot operations.',
    sources: ['FARAD Database', 'VetMed Teaching Hospitals'],
    confidence: 0.92,
    relatedDrugs: ['Ceftiofur', 'Tulathromycin', 'Oxytetracycline', 'Florfenicol'],
  },
  'companion': {
    answer: 'Companion animal antimicrobial usage encompasses dogs (456 records), cats (312 records), and horses (234 records). Dogs primarily receive Amoxicillin-Clavulanate for UTIs and Cephalexin for skin infections. Cats commonly receive Amoxicillin for upper respiratory infections and Clindamycin for dental disease. Horses frequently receive Trimethoprim-Sulfa for skin infections. Unlike food animals, withdrawal periods are not applicable. Extra-label use is more common (31%) due to limited FDA-approved veterinary products for companion species.',
    sources: ['VetMed Teaching Hospitals', 'AVMA Journals'],
    confidence: 0.89,
    relatedDrugs: ['Amoxicillin-Clavulanate', 'Cephalexin', 'Clindamycin', 'Trimethoprim-Sulfa'],
  },
  'default': {
    answer: 'Based on the LAMU-AI database analysis, antimicrobial usage across livestock, poultry, and companion animals shows diverse patterns. The total database contains 4,008 records spanning 42 unique drugs across 10 species. Key findings include: (1) Tetracyclines remain the most widely used class at 26.3%, (2) Extra-label use accounts for 23.4% of all prescriptions, (3) Usage has increased 12% year-over-year from 2022 to 2024, and (4) The Midwest region has the highest antimicrobial utilization rate. For more specific information, try asking about withdrawal periods, resistance trends, specific species, or drug classes.',
    sources: ['FARAD Database', 'FDA Green Book', 'VetMed Teaching Hospitals'],
    confidence: 0.82,
    relatedDrugs: ['Ceftiofur', 'Oxytetracycline', 'Tylosin', 'Amoxicillin'],
  },
};

// ========== AI/LLM ANALYTICS DATA ==========

export interface NEREntity {
  text: string;
  label: 'DRUG' | 'SPECIES' | 'DISEASE' | 'ROUTE' | 'DOSAGE' | 'DURATION' | 'ORGANIZATION';
  start: number;
  end: number;
  confidence: number;
}

export interface EmbeddingCluster {
  id: string;
  x: number;
  y: number;
  label: string;
  category: string;
  size: number;
}

export interface ModelMetric {
  model: string;
  accuracy: number;
  f1Score: number;
  precision: number;
  recall: number;
  latencyMs: number;
  tokensPerSec: number;
  costPer1kTokens: number;
}

export interface RAGStep {
  step: number;
  name: string;
  description: string;
  status: 'completed' | 'processing' | 'pending';
  duration?: number;
  details?: string;
}

export interface ProcessedDocument {
  id: string;
  title: string;
  source: string;
  chunks: number;
  tokens: number;
  embeddings: number;
  processedAt: string;
  relevanceScore: number;
}

export interface LLMUsageMetrics {
  totalQueries: number;
  avgResponseTime: number;
  totalTokensProcessed: number;
  documentsIndexed: number;
  embeddingsGenerated: number;
  ragRetrievals: number;
  nerEntitiesExtracted: number;
  accuracyRate: number;
}

// NER sample annotations on a veterinary text
export const sampleNERText = `A 450kg Holstein dairy cow presenting with clinical signs of bovine respiratory disease was treated with Ceftiofur crystalline free acid at 6.6 mg/kg administered subcutaneously in the base of the ear. Treatment duration was 1 injection with a withdrawal period of 13 days for meat. The attending veterinarian at the Cornell University College of Veterinary Medicine also prescribed Flunixin meglumine at 2.2 mg/kg IV for 3 days as adjunct anti-inflammatory therapy. Follow-up culture revealed Mannheimia haemolytica susceptible to the prescribed antimicrobial.`;

export const sampleNEREntities: NEREntity[] = [
  { text: 'Holstein dairy cow', label: 'SPECIES', start: 10, end: 28, confidence: 0.97 },
  { text: 'bovine respiratory disease', label: 'DISEASE', start: 62, end: 88, confidence: 0.99 },
  { text: 'Ceftiofur crystalline free acid', label: 'DRUG', start: 112, end: 143, confidence: 0.98 },
  { text: '6.6 mg/kg', label: 'DOSAGE', start: 147, end: 156, confidence: 0.96 },
  { text: 'subcutaneously', label: 'ROUTE', start: 170, end: 184, confidence: 0.95 },
  { text: '13 days', label: 'DURATION', start: 245, end: 252, confidence: 0.94 },
  { text: 'Cornell University College of Veterinary Medicine', label: 'ORGANIZATION', start: 298, end: 348, confidence: 0.92 },
  { text: 'Flunixin meglumine', label: 'DRUG', start: 365, end: 383, confidence: 0.97 },
  { text: '2.2 mg/kg', label: 'DOSAGE', start: 387, end: 396, confidence: 0.95 },
  { text: 'IV', label: 'ROUTE', start: 397, end: 399, confidence: 0.93 },
  { text: '3 days', label: 'DURATION', start: 404, end: 410, confidence: 0.96 },
  { text: 'Mannheimia haemolytica', label: 'DISEASE', start: 464, end: 486, confidence: 0.91 },
];

// Embedding clusters (simulated t-SNE/UMAP projection)
export const embeddingClusters: EmbeddingCluster[] = [
  // Tetracycline cluster
  { id: 'e1', x: 12, y: 65, label: 'Oxytetracycline', category: 'Tetracyclines', size: 8 },
  { id: 'e2', x: 15, y: 70, label: 'Chlortetracycline', category: 'Tetracyclines', size: 7 },
  { id: 'e3', x: 10, y: 72, label: 'Doxycycline', category: 'Tetracyclines', size: 6 },
  { id: 'e4', x: 18, y: 68, label: 'Tetracycline', category: 'Tetracyclines', size: 5 },
  // Cephalosporin cluster
  { id: 'e5', x: 55, y: 20, label: 'Ceftiofur', category: 'Cephalosporins', size: 9 },
  { id: 'e6', x: 58, y: 25, label: 'Cephalexin', category: 'Cephalosporins', size: 7 },
  { id: 'e7', x: 52, y: 22, label: 'Cefpodoxime', category: 'Cephalosporins', size: 4 },
  // Macrolide cluster
  { id: 'e8', x: 75, y: 55, label: 'Tulathromycin', category: 'Macrolides', size: 8 },
  { id: 'e9', x: 78, y: 60, label: 'Tylosin', category: 'Macrolides', size: 7 },
  { id: 'e10', x: 72, y: 58, label: 'Tilmicosin', category: 'Macrolides', size: 6 },
  { id: 'e11', x: 80, y: 52, label: 'Erythromycin', category: 'Macrolides', size: 5 },
  { id: 'e12', x: 76, y: 63, label: 'Azithromycin', category: 'Macrolides', size: 5 },
  // Fluoroquinolone cluster
  { id: 'e13', x: 35, y: 85, label: 'Enrofloxacin', category: 'Fluoroquinolones', size: 7 },
  { id: 'e14', x: 38, y: 88, label: 'Marbofloxacin', category: 'Fluoroquinolones', size: 5 },
  { id: 'e15', x: 32, y: 82, label: 'Ciprofloxacin', category: 'Fluoroquinolones', size: 4 },
  // Penicillin cluster
  { id: 'e16', x: 85, y: 15, label: 'Amoxicillin', category: 'Penicillins', size: 8 },
  { id: 'e17', x: 88, y: 12, label: 'Ampicillin', category: 'Penicillins', size: 6 },
  { id: 'e18', x: 82, y: 18, label: 'Penicillin G', category: 'Penicillins', size: 7 },
  // Aminoglycoside cluster
  { id: 'e19', x: 45, y: 45, label: 'Gentamicin', category: 'Aminoglycosides', size: 6 },
  { id: 'e20', x: 48, y: 42, label: 'Spectinomycin', category: 'Aminoglycosides', size: 5 },
];

// Model comparison metrics
export const modelMetrics: ModelMetric[] = [
  { model: 'Default Response (Vector Synthesis)', accuracy: 0.912, f1Score: 0.905, precision: 0.920, recall: 0.890, latencyMs: 45, tokensPerSec: 2500, costPer1kTokens: 0.000 },
  { model: 'Groq (Llama 3.1 8B Instant)', accuracy: 0.943, f1Score: 0.938, precision: 0.951, recall: 0.926, latencyMs: 140, tokensPerSec: 1850, costPer1kTokens: 0.000 },
  { model: 'Google Gemini 1.5 Flash', accuracy: 0.939, f1Score: 0.933, precision: 0.942, recall: 0.925, latencyMs: 410, tokensPerSec: 850, costPer1kTokens: 0.000 },
  { model: 'OpenRouter (Llama 3.3 70B:free)', accuracy: 0.935, f1Score: 0.930, precision: 0.940, recall: 0.920, latencyMs: 520, tokensPerSec: 620, costPer1kTokens: 0.000 },
  { model: 'GPT-4o', accuracy: 0.921, f1Score: 0.915, precision: 0.928, recall: 0.903, latencyMs: 890, tokensPerSec: 420, costPer1kTokens: 0.015 },
  { model: 'PubMedBERT Baseline', accuracy: 0.872, f1Score: 0.865, precision: 0.878, recall: 0.853, latencyMs: 180, tokensPerSec: 1800, costPer1kTokens: 0.001 },
];

// RAG Pipeline steps
export const ragPipelineSteps: RAGStep[] = [
  { step: 1, name: 'Query Analysis', description: 'Parse natural language query, extract intent and clinical entities', status: 'completed', duration: 45, details: 'Identified: drug query + species filter + temporal range' },
  { step: 2, name: 'Embedding Generation', description: 'Convert query to dense vector using 768-dim embedding model', status: 'completed', duration: 32, details: '768-dim dense embedding generated' },
  { step: 3, name: 'Vector Retrieval', description: 'Search MongoDB vector store ($vectorSearch) for top-k relevant chunks', status: 'completed', duration: 18, details: 'Retrieved top-k chunks from MongoDB vector store (cosine similarity > 0.80)' },
  { step: 4, name: 'Context Assembly', description: 'Rank and assemble retrieved chunks into coherent context window', status: 'completed', duration: 12, details: 'Selected top 5 chunks assembled with metadata' },
  { step: 5, name: 'LLM Generation', description: 'Generate response using active LLM provider or default extractive synthesis', status: 'completed', duration: 320, details: 'Contextually grounded response generation' },
  { step: 6, name: 'Citation Extraction', description: 'Extract and verify source citations from generated response', status: 'completed', duration: 25, details: 'Verified citations from FARAD, FDA Green Book, and VMTH records' },
  { step: 7, name: 'Response Validation', description: 'Validate factual accuracy against known drug data and regulations', status: 'completed', duration: 56, details: 'Cross-referenced with database records: 94.3% confidence score' },
];

// Processed documents for RAG
export const processedDocuments: ProcessedDocument[] = [
  { id: 'DOC-001', title: 'FARAD Digest: Cephalosporin Withdrawal Intervals', source: 'FARAD', chunks: 24, tokens: 8450, embeddings: 24, processedAt: '2024-09-15T10:30:00Z', relevanceScore: 0.95 },
  { id: 'DOC-002', title: 'FDA CVM Guidance #263: Duration of Use', source: 'FDA', chunks: 18, tokens: 6200, embeddings: 18, processedAt: '2024-09-14T08:15:00Z', relevanceScore: 0.91 },
  { id: 'DOC-003', title: 'NARMS 2023 Annual Report: Resistance Trends', source: 'USDA', chunks: 42, tokens: 15600, embeddings: 42, processedAt: '2024-09-13T14:45:00Z', relevanceScore: 0.88 },
  { id: 'DOC-004', title: 'Extra-Label Drug Use in Minor Species: AMDUCA Compliance', source: 'FARAD', chunks: 15, tokens: 5100, embeddings: 15, processedAt: '2024-09-12T09:00:00Z', relevanceScore: 0.87 },
  { id: 'DOC-005', title: 'Bovine Respiratory Disease Complex: Treatment Protocols', source: 'VMTH', chunks: 31, tokens: 11200, embeddings: 31, processedAt: '2024-09-11T16:30:00Z', relevanceScore: 0.93 },
  { id: 'DOC-006', title: 'Antimicrobial Stewardship in Companion Animals: ISCAID Guidelines', source: 'Academic', chunks: 28, tokens: 9800, embeddings: 28, processedAt: '2024-09-10T11:00:00Z', relevanceScore: 0.85 },
  { id: 'DOC-007', title: 'Pharmacokinetics of Tetracyclines in Food Animals', source: 'PubMed', chunks: 22, tokens: 7600, embeddings: 22, processedAt: '2024-09-09T07:45:00Z', relevanceScore: 0.82 },
  { id: 'DOC-008', title: 'WHO List of Critically Important Antimicrobials 2024', source: 'WHO', chunks: 12, tokens: 4100, embeddings: 12, processedAt: '2024-09-08T13:15:00Z', relevanceScore: 0.79 },
];

// LLM Usage metrics
export const llmUsageMetrics: LLMUsageMetrics = {
  totalQueries: 12847,
  avgResponseTime: 1.24,
  totalTokensProcessed: 4562000,
  documentsIndexed: 4884,
  embeddingsGenerated: 156420,
  ragRetrievals: 38291,
  nerEntitiesExtracted: 89456,
  accuracyRate: 94.3,
};

// Fine-tuning training history
export const trainingHistory = [
  { epoch: 1, trainLoss: 2.45, valLoss: 2.52, accuracy: 0.412 },
  { epoch: 2, trainLoss: 1.89, valLoss: 1.98, accuracy: 0.567 },
  { epoch: 3, trainLoss: 1.42, valLoss: 1.56, accuracy: 0.689 },
  { epoch: 4, trainLoss: 1.08, valLoss: 1.24, accuracy: 0.762 },
  { epoch: 5, trainLoss: 0.82, valLoss: 1.01, accuracy: 0.821 },
  { epoch: 6, trainLoss: 0.64, valLoss: 0.85, accuracy: 0.863 },
  { epoch: 7, trainLoss: 0.49, valLoss: 0.72, accuracy: 0.892 },
  { epoch: 8, trainLoss: 0.38, valLoss: 0.63, accuracy: 0.912 },
  { epoch: 9, trainLoss: 0.31, valLoss: 0.58, accuracy: 0.928 },
  { epoch: 10, trainLoss: 0.25, valLoss: 0.54, accuracy: 0.938 },
  { epoch: 11, trainLoss: 0.21, valLoss: 0.52, accuracy: 0.941 },
  { epoch: 12, trainLoss: 0.18, valLoss: 0.51, accuracy: 0.943 },
];
