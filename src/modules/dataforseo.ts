/**
 * DataForSEO API Integration
 *
 * Fetches SERP data, competitor rankings, keyword research, and more.
 */

import type { RankingData } from '../types/index.ts'

export interface DataForSEOConfig {
  login?: string
  password?: string
  baseUrl?: string
}

export interface KeywordIdea {
  keyword: string
  searchVolume: number | null
  cpc: number | null
  competition: number | null
}

export interface Question {
  question: string
  searchVolume: number | null
}

export class DataForSEO {
  private login: string
  private password: string
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config?: DataForSEOConfig) {
    this.login = config?.login || process.env.DATAFORSEO_LOGIN || ''
    this.password = config?.password || process.env.DATAFORSEO_PASSWORD || ''
    this.baseUrl = config?.baseUrl || process.env.DATAFORSEO_BASE_URL || 'https://api.dataforseo.com'

    if (!this.login || !this.password) {
      throw new Error('DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set')
    }

    // Create auth header
    const cred = `${this.login}:${this.password}`
    const encodedCred = btoa(cred)
    this.headers = {
      'Authorization': `Basic ${encodedCred}`,
      'Content-Type': 'application/json',
    }
  }

  private async post(endpoint: string, data: Record<string, unknown>[]): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`DataForSEO API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getRankings(
    domain: string,
    keywords: string[],
    locationCode: number = 2840, // USA
    languageCode: string = 'en'
  ): Promise<RankingData[]> {
    const tasks = keywords.map(keyword => ({
      keyword,
      location_code: locationCode,
      language_code: languageCode,
      device: 'desktop',
      os: 'windows',
    }))

    const response = await this.post('/v3/serp/google/organic/live/advanced', tasks)

    const results: RankingData[] = []
    if (response.status_code === 20000) {
      for (const task of response.tasks) {
        if (task.status_code === 20000) {
          const keyword = task.data.keyword
          const items = task.result[0]?.items || []

          // Find domain position
          let position: number | null = null
          let url: string | null = null
          let searchVolume: number | null = null

          for (let i = 0; i < items.length; i++) {
            if (items[i]?.domain?.includes(domain)) {
              position = i + 1
              url = items[i].url
              break
            }
          }

          // Get search volume if available
          if (task.result[0]?.keyword_data) {
            searchVolume = task.result[0].keyword_data.keyword_info?.search_volume || null
          }

          results.push({
            keyword,
            domain,
            position,
            url,
            searchVolume,
            cpc: null,
            competition: null,
            topResults: items.slice(0, 10).map((item: any, idx: number) => ({
              position: idx + 1,
              url: item.url,
              domain: item.domain,
              title: item.title,
              description: item.description,
            })),
          })
        }
      }
    }

    return results
  }

  async getKeywordIdeas(seedKeyword: string, limit: number = 100): Promise<KeywordIdea[]> {
    const tasks = [
      {
        keyword: seedKeyword,
        location_code: 2840,
        language_code: 'en',
        limit,
      },
    ]

    const response = await this.post('/v3/keywords_data/google_ads/keywords_for_keywords/live', tasks)

    const results: KeywordIdea[] = []
    if (response.status_code === 20000) {
      for (const task of response.tasks) {
        if (task.status_code === 20000 && task.result && task.result[0]?.items) {
          for (const item of task.result[0].items) {
            results.push({
              keyword: item.keyword,
              searchVolume: item.keyword_info?.search_volume || null,
              cpc: item.keyword_info?.cpc || null,
              competition: item.keyword_info?.competition || null,
            })
          }
        }
      }
    }

    return results
  }

  async getQuestions(keyword: string, limit: number = 50): Promise<Question[]> {
    const tasks = [
      {
        keyword,
        location_code: 2840,
        language_code: 'en',
        limit,
      },
    ]

    const response = await this.post('/v3/keywords_data/google_ads/questions/live', tasks)

    const results: Question[] = []
    if (response.status_code === 20000) {
      for (const task of response.tasks) {
        if (task.status_code === 20000 && task.result && task.result[0]?.items) {
          for (const item of task.result[0].items) {
            results.push({
              question: item.keyword,
              searchVolume: item.keyword_info?.search_volume || null,
            })
          }
        }
      }
    }

    return results
  }

  async getSerpFeatures(keyword: string, locationCode: number = 2840): Promise<string[]> {
    const tasks = [
      {
        keyword,
        location_code: locationCode,
        language_code: 'en',
        device: 'desktop',
      },
    ]

    const response = await this.post('/v3/serp/google/organic/live/advanced', tasks)

    const features: string[] = []
    if (response.status_code === 20000) {
      for (const task of response.tasks) {
        if (task.status_code === 20000 && task.result && task.result[0]) {
          const serpData = task.result[0]
          if (serpData.items) {
            for (const item of serpData.items) {
              if (item.type && !features.includes(item.type)) {
                features.push(item.type)
              }
            }
          }
        }
      }
    }

    return features
  }
}
