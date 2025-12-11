/**
 * Common types used across the SEO Machine modules
 */

export interface KeywordAnalysis {
  keyword: string
  density: number
  count: number
  positions: number[]
  distribution: string
  recommendation: string
}

export interface RankingData {
  keyword: string
  domain: string
  position: number | null
  url: string | null
  searchVolume: number | null
  cpc: number | null
  competition: number | null
  topResults?: TopResult[]
}

export interface TopResult {
  position: number
  url: string
  domain: string
  title: string
  description?: string
}

export interface ReadabilityMetrics {
  fleschReadingEase: number
  fleschKincaidGrade: number
  gunningFog: number
  smogIndex: number
  averageSentenceLength: number
  averageWordLength: number
  grade: string
  recommendation: string
}

export interface SEOQualityScore {
  overallScore: number
  titleScore: number
  metaDescriptionScore: number
  headingScore: number
  keywordScore: number
  contentScore: number
  technicalScore: number
  recommendations: string[]
}

export interface SearchIntentType {
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial_investigation'
  confidence: number
  signals: string[]
}

export interface ContentAnalysis {
  wordCount: number
  paragraphCount: number
  sentenceCount: number
  averageSentenceLength: number
  averageParagraphLength: number
  readability: ReadabilityMetrics
  keywordDensity: Record<string, KeywordAnalysis>
  seoQuality: SEOQualityScore
  searchIntent?: SearchIntentType
}

export interface QuickWin {
  keyword: string
  position: number
  impressions: number
  clicks: number
  ctr: number
  commercialIntent: number
  commercialIntentCategory: string
  opportunityScore: number
  priority: 'high' | 'medium' | 'low'
}
