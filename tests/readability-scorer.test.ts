import { describe, it, expect, beforeEach } from 'vitest'
import { ReadabilityScorer } from '../src/modules/readability-scorer'

describe('ReadabilityScorer', () => {
  let scorer: ReadabilityScorer

  beforeEach(() => {
    scorer = new ReadabilityScorer()
  })

  describe('analyze', () => {
    it('should calculate basic readability metrics', () => {
      const content = 'This is a simple sentence. This is another simple sentence.'
      const result = scorer.analyze(content)

      expect(result.fleschReadingEase).toBeGreaterThan(0)
      expect(result.fleschKincaidGrade).toBeGreaterThan(0)
      expect(result.averageSentenceLength).toBeGreaterThan(0)
      expect(result.averageWordLength).toBeGreaterThan(0)
    })

    it('should provide grade level', () => {
      const content = 'The quick brown fox jumps over the lazy dog.'
      const result = scorer.analyze(content)

      expect(result.grade).toBeDefined()
      expect(typeof result.grade).toBe('string')
    })

    it('should provide recommendations', () => {
      const content = 'Simple text here.'
      const result = scorer.analyze(content)

      expect(result.recommendation).toBeDefined()
      expect(result.recommendation.length).toBeGreaterThan(0)
    })

    it('should handle complex text', () => {
      const content = `
        Notwithstanding the foregoing provisions, the aforementioned stipulations
        shall remain in perpetuity, irrespective of subsequent modifications
        to the underlying constitutional framework governing such determinations.
      `
      const result = scorer.analyze(content)

      expect(result.fleschReadingEase).toBeLessThan(60)
      expect(result.fleschKincaidGrade).toBeGreaterThan(10)
    })

    it('should handle simple text', () => {
      const content = 'I like cats. Cats are nice. They are soft and warm.'
      const result = scorer.analyze(content)

      expect(result.fleschReadingEase).toBeGreaterThan(70)
      expect(result.fleschKincaidGrade).toBeLessThan(5)
    })
  })

  describe('edge cases', () => {
    it('should handle single sentence', () => {
      const content = 'This is one sentence.'
      const result = scorer.analyze(content)

      expect(result.averageSentenceLength).toBeGreaterThan(0)
    })

    it('should handle single word', () => {
      const content = 'Hello.'
      const result = scorer.analyze(content)

      expect(result.averageWordLength).toBeGreaterThan(0)
    })

    it('should handle empty string gracefully', () => {
      const content = ''
      const result = scorer.analyze(content)

      expect(result).toBeDefined()
      expect(result.averageSentenceLength).toBeGreaterThanOrEqual(0)
    })
  })

  describe('metrics calculation', () => {
    it('should calculate Flesch Reading Ease correctly', () => {
      const content = 'The cat sat on the mat. The dog ran in the park.'
      const result = scorer.analyze(content)

      expect(result.fleschReadingEase).toBeGreaterThan(0)
      // Note: FRE can exceed 100 for very simple text, which is acceptable
    })

    it('should calculate Flesch-Kincaid Grade correctly', () => {
      const content = 'Simple words make text easy to read.'
      const result = scorer.analyze(content)

      expect(result.fleschKincaidGrade).toBeGreaterThan(0)
    })

    it('should calculate average sentence length', () => {
      const content = 'Short. A bit longer now. This is the longest sentence here.'
      const result = scorer.analyze(content)

      expect(result.averageSentenceLength).toBeGreaterThan(0)
    })
  })
})
