import { describe, it, expect, beforeEach } from 'vitest'
import { KeywordAnalyzer } from '../src/modules/keyword-analyzer'

describe('KeywordAnalyzer', () => {
  let analyzer: KeywordAnalyzer

  beforeEach(() => {
    analyzer = new KeywordAnalyzer()
  })

  describe('analyze', () => {
    it('should analyze basic keyword density', () => {
      const content = 'SEO is important. SEO helps rankings. Good SEO practices matter.'
      const result = analyzer.analyze(content, 'SEO', [], 2.0)

      expect(result.wordCount).toBeGreaterThan(0)
      expect(result.primaryKeyword.keyword).toBe('SEO')
      expect(result.primaryKeyword.count).toBe(3)
      expect(result.primaryKeyword.density).toBeGreaterThan(0)
    })

    it('should analyze secondary keywords', () => {
      const content = 'SEO optimization and content marketing are important for rankings.'
      const result = analyzer.analyze(content, 'SEO', ['content marketing', 'rankings'])

      expect(result.secondaryKeywords.length).toBe(2)
      expect(result.secondaryKeywords[0]?.keyword).toBe('content marketing')
    })

    it('should detect keyword stuffing risk', () => {
      const content = 'SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO'
      const result = analyzer.analyze(content, 'SEO')

      expect(result.keywordStuffing.risk).toBe('high')
      expect(result.keywordStuffing.score).toBeGreaterThan(0)
    })

    it('should analyze keyword distribution', () => {
      const content = `
        # Introduction with SEO
        This is about SEO and content.
        
        # Middle section
        More content here about SEO.
        
        # Conclusion
        Final thoughts on SEO.
      `
      const result = analyzer.analyze(content, 'SEO')

      expect(result.distributionHeatmap).toBeDefined()
      expect(Object.keys(result.distributionHeatmap).length).toBeGreaterThan(0)
    })

    it('should generate LSI keywords', () => {
      const content = 'SEO optimization requires good content marketing and keyword research.'
      const result = analyzer.analyze(content, 'SEO')

      expect(result.lsiKeywords).toBeDefined()
      expect(Array.isArray(result.lsiKeywords)).toBe(true)
    })

    it('should provide recommendations', () => {
      const content = 'This is some content without the target keyword.'
      const result = analyzer.analyze(content, 'SEO')

      expect(result.primaryKeyword.recommendation).toBeDefined()
      expect(result.primaryKeyword.recommendation.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty content', () => {
      const result = analyzer.analyze('', 'keyword')

      expect(result.wordCount).toBe(0)
      expect(result.primaryKeyword.count).toBe(0)
    })

    it('should handle content without keyword', () => {
      const content = 'This content does not contain the target phrase.'
      const result = analyzer.analyze(content, 'unicorn magic')

      expect(result.primaryKeyword.count).toBe(0)
      expect(result.primaryKeyword.density).toBe(0)
    })

    it('should be case-insensitive', () => {
      const content = 'seo SEO Seo SeO'
      const result = analyzer.analyze(content, 'seo')

      expect(result.primaryKeyword.count).toBe(4)
    })
  })
})
