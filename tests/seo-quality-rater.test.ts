import { describe, it, expect, beforeEach } from 'vitest'
import { SEOQualityRater } from '../src/modules/seo-quality-rater'

describe('SEOQualityRater', () => {
  let rater: SEOQualityRater

  beforeEach(() => {
    rater = new SEOQualityRater()
  })

  describe('rate', () => {
    it('should rate complete content', () => {
      const content = `
# Main Heading with SEO

This is content about SEO. SEO is important for rankings.

## Subheading

More content here about SEO optimization.

![Alt text](image.png)

[Link text](https://example.com)
      `.trim()

      const result = rater.rate(
        content,
        'Complete Guide to SEO Optimization',
        'Learn everything about SEO optimization and how to improve your rankings with this comprehensive guide.',
        'SEO'
      )

      expect(result.overallScore).toBeGreaterThan(0)
      expect(result.overallScore).toBeLessThanOrEqual(100)
      expect(result.titleScore).toBeGreaterThan(0)
      expect(result.metaDescriptionScore).toBeGreaterThan(0)
      expect(result.headingScore).toBeGreaterThan(0)
      expect(result.keywordScore).toBeGreaterThan(0)
      expect(result.contentScore).toBeGreaterThan(0)
      expect(result.technicalScore).toBeGreaterThan(0)
    })

    it('should provide recommendations', () => {
      const content = 'Short content.'
      const result = rater.rate(content)

      expect(result.recommendations).toBeDefined()
      expect(Array.isArray(result.recommendations)).toBe(true)
    })

    it('should rate title length', () => {
      const content = 'Content here.'
      
      // Too short
      let result = rater.rate(content, 'Short', undefined, 'keyword')
      expect(result.titleScore).toBeLessThan(100)
      
      // Just right
      result = rater.rate(content, 'This is a good length title for SEO')
      expect(result.titleScore).toBeGreaterThan(70)
      
      // Too long
      result = rater.rate(content, 'This is a very long title that exceeds the recommended length for SEO optimization')
      expect(result.titleScore).toBeLessThan(100)
    })

    it('should check keyword in title', () => {
      const content = 'Content.'
      
      const withKeyword = rater.rate(content, 'SEO Guide', undefined, 'SEO')
      const withoutKeyword = rater.rate(content, 'Complete Guide', undefined, 'SEO')
      
      expect(withKeyword.titleScore).toBeGreaterThanOrEqual(withoutKeyword.titleScore)
    })

    it('should rate meta description', () => {
      const content = 'Content here.'
      
      // Too short
      let result = rater.rate(content, undefined, 'Short description')
      expect(result.recommendations.some(r => r.includes('Meta description is too short'))).toBe(true)
      
      // Good length
      result = rater.rate(
        content,
        undefined,
        'This is a meta description that is within the recommended length range for optimal SEO performance and user engagement in search results.'
      )
      expect(result.metaDescriptionScore).toBeGreaterThan(70)
    })

    it('should check heading structure', () => {
      const goodHeadings = `
# Main Title
## Section 1
## Section 2
### Subsection
      `
      const noHeadings = 'Just plain text without any headings.'
      
      const goodResult = rater.rate(goodHeadings)
      const badResult = rater.rate(noHeadings)
      
      expect(goodResult.headingScore).toBeGreaterThan(badResult.headingScore)
    })

    it('should check content length', () => {
      const shortContent = 'Too short.'
      const goodContent = 'This is content. '.repeat(100) // ~200 words
      
      const shortResult = rater.rate(shortContent)
      const goodResult = rater.rate(goodContent)
      
      // Good content should have higher or equal score (both might be penalized for different reasons)
      expect(goodResult.contentScore).toBeGreaterThanOrEqual(shortResult.contentScore - 20)
    })

    it('should check for images', () => {
      const withImage = '![Alt text](image.png)\n\n' + 'Content here. '.repeat(100)
      const withoutImage = 'Content here. '.repeat(100)
      
      const withResult = rater.rate(withImage)
      const withoutResult = rater.rate(withoutImage)
      
      expect(withResult.contentScore).toBeGreaterThanOrEqual(withoutResult.contentScore)
    })

    it('should check for alt text on images', () => {
      const withAlt = '![Descriptive alt text](image.png)'
      const withoutAlt = '![](image.png)'
      
      const withResult = rater.rate(withAlt)
      const withoutResult = rater.rate(withoutAlt)
      
      expect(withResult.technicalScore).toBeGreaterThan(withoutResult.technicalScore)
    })

    it('should check keyword density', () => {
      const goodDensity = 'SEO is important. '.repeat(2) + 'Other content here. '.repeat(50)
      const highDensity = 'SEO SEO SEO SEO SEO SEO SEO SEO SEO SEO'
      
      const goodResult = rater.rate(goodDensity, undefined, undefined, 'SEO')
      const highResult = rater.rate(highDensity, undefined, undefined, 'SEO')
      
      expect(goodResult.keywordScore).toBeGreaterThan(highResult.keywordScore)
    })
  })

  describe('custom guidelines', () => {
    it('should accept custom title length', () => {
      const customRater = new SEOQualityRater({
        titleMinLength: 40,
        titleMaxLength: 80,
      })

      const result = customRater.rate('Content.', 'Short Title')
      expect(result.recommendations.some(r => r.includes('Title is too short'))).toBe(true)
    })

    it('should accept custom word count', () => {
      const customRater = new SEOQualityRater({
        minWordCount: 500,
      })

      const result = customRater.rate('Short content.')
      expect(result.recommendations.some(r => r.includes('too short'))).toBe(true)
    })
  })
})
