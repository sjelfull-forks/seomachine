import { describe, it, expect, beforeEach } from 'vitest'
import { SearchIntentAnalyzer } from '../src/modules/search-intent-analyzer'

describe('SearchIntentAnalyzer', () => {
  let analyzer: SearchIntentAnalyzer

  beforeEach(() => {
    analyzer = new SearchIntentAnalyzer()
  })

  describe('analyze', () => {
    it('should detect informational intent', () => {
      const result = analyzer.analyze('how to optimize SEO')

      expect(result.intent).toBe('informational')
      expect(result.confidence).toBeGreaterThan(0)
      expect(result.signals.length).toBeGreaterThan(0)
    })

    it('should detect navigational intent', () => {
      const result = analyzer.analyze('facebook login')

      expect(result.intent).toBe('navigational')
      expect(result.confidence).toBeGreaterThan(0)
    })

    it('should detect transactional intent', () => {
      const result = analyzer.analyze('buy SEO tools online')

      expect(result.intent).toBe('transactional')
      expect(result.confidence).toBeGreaterThan(0)
    })

    it('should detect commercial investigation intent', () => {
      const result = analyzer.analyze('best SEO tools comparison')

      expect(result.intent).toBe('commercial_investigation')
      expect(result.confidence).toBeGreaterThan(0)
    })

    it('should analyze query with SERP features', () => {
      const serpFeatures = ['knowledge_panel', 'people_also_ask']
      const result = analyzer.analyze('what is SEO', serpFeatures)

      expect(result.intent).toBe('informational')
      expect(result.signals.some(s => s.includes('SERP feature'))).toBe(true)
    })

    it('should handle question format', () => {
      const queries = [
        'what is SEO',
        'how does SEO work',
        'why is SEO important',
        'when should I use SEO',
      ]

      for (const query of queries) {
        const result = analyzer.analyze(query)
        expect(result.intent).toBe('informational')
        expect(result.signals.some(s => s.includes('question'))).toBe(true)
      }
    })

    it('should detect proper nouns/brands', () => {
      const result = analyzer.analyze('Google Analytics tutorial')

      expect(result.signals.some(s => s.includes('proper noun'))).toBe(true)
    })

    it('should calculate confidence scores', () => {
      const result = analyzer.analyze('buy best SEO tools')

      expect(result.confidence).toBeGreaterThan(0)
      expect(result.confidence).toBeLessThanOrEqual(1)
    })
  })

  describe('getIntentDescription', () => {
    it('should return description for informational intent', () => {
      const description = analyzer.getIntentDescription('informational')

      expect(description).toBeDefined()
      expect(description.length).toBeGreaterThan(0)
    })

    it('should return description for navigational intent', () => {
      const description = analyzer.getIntentDescription('navigational')

      expect(description).toBeDefined()
      expect(description.length).toBeGreaterThan(0)
    })

    it('should return description for transactional intent', () => {
      const description = analyzer.getIntentDescription('transactional')

      expect(description).toBeDefined()
      expect(description.length).toBeGreaterThan(0)
    })

    it('should return description for commercial investigation intent', () => {
      const description = analyzer.getIntentDescription('commercial_investigation')

      expect(description).toBeDefined()
      expect(description.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty query', () => {
      const result = analyzer.analyze('')

      expect(result.intent).toBeDefined()
      expect(result.confidence).toBeGreaterThanOrEqual(0)
    })

    it('should handle single word query', () => {
      const result = analyzer.analyze('SEO')

      expect(result.intent).toBeDefined()
    })

    it('should be case-insensitive', () => {
      const result1 = analyzer.analyze('HOW TO OPTIMIZE SEO')
      const result2 = analyzer.analyze('how to optimize seo')

      expect(result1.intent).toBe(result2.intent)
    })
  })
})
