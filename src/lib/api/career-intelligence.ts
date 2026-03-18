import { supabase } from '@/integrations/supabase/client';

export interface CompanyInsight {
  name: string;
  industry: string;
  openPositions?: string;
  keyTechnologies?: string[];
  avgExperience?: string;
  jobUrl?: string | null;
}

export interface SalaryRange {
  region: string;
  range: string;
  currency?: string;
}

export interface HiringTrends {
  topCountries: string[];
  topCities: string[];
  demandScore: number;
  growthRate: string;
}

export interface ExperienceLevel {
  years: string;
  avgSalary: string;
}

export interface JobLink {
  company: string;
  role: string;
  url: string;
}

export interface CareerIntelligence {
  role: string;
  summary: string;
  companies: CompanyInsight[];
  topSkills: string[];
  emergingSkills: string[];
  decliningSkills: string[];
  salaryRanges: SalaryRange[];
  hiringTrends: HiringTrends;
  experienceLevels: {
    junior: ExperienceLevel;
    mid: ExperienceLevel;
    senior: ExperienceLevel;
  };
  jobLinks: JobLink[];
  dataConfidence: string;
  sourcesAnalyzed: number;
}

export async function fetchCareerIntelligence(role: string): Promise<CareerIntelligence> {
  const { data, error } = await supabase.functions.invoke('career-intelligence', {
    body: { role },
  });

  if (error) {
    throw new Error(error.message || 'Failed to fetch career intelligence');
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Analysis failed');
  }

  return data.data;
}
