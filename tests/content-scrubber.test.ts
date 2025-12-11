import { describe, it, expect } from 'vitest'
import { ContentScrubber } from '../src/modules/content-scrubber'

describe('ContentScrubber', () => {
  let scrubber: ContentScrubber

  beforeEach(() => {
    scrubber = new ContentScrubber()
  })

  describe('scrub', () => {
    it('should remove zero-width spaces', () => {
      const content = 'Hello\u200BWorld'
      const result = scrubber.scrub(content)

      expect(result.cleanedContent).toBe('HelloWorld')
      expect(result.removedCharacters).toBeGreaterThan(0)
    })

    it('should normalize multiple spaces', () => {
      const content = 'Hello    World'
      const result = scrubber.scrub(content)

      expect(result.cleanedContent).toBe('Hello World')
      expect(result.replacements).toBeGreaterThan(0)
    })

    it('should handle em-dashes', () => {
      const content = 'Hello\u2014World'
      const result = scrubber.scrub(content)

      expect(result.cleanedContent).toContain('Hello')
      expect(result.cleanedContent).toContain('World')
    })

    it('should normalize line breaks', () => {
      const content = 'Hello\n\n\n\nWorld'
      const result = scrubber.scrub(content)

      // After trim and normalization
      expect(result.cleanedContent).toContain('Hello')
      expect(result.cleanedContent).toContain('World')
      expect(result.cleanedContent.match(/\n{3,}/)).toBeNull()
    })

    it('should handle clean content', () => {
      const content = 'This is clean content.'
      const result = scrubber.scrub(content)

      expect(result.cleanedContent).toBe(content)
      expect(result.removedCharacters).toBe(0)
    })
  })

  describe('detectWatermarks', () => {
    it('should detect invisible characters', () => {
      const content = 'Hello\u200BWorld'
      const watermarks = scrubber.detectWatermarks(content)

      expect(watermarks.length).toBeGreaterThan(0)
      expect(watermarks.some(w => w.includes('invisible'))).toBe(true)
    })

    it('should detect excessive em-dashes', () => {
      const content = 'A\u2014B\u2014C\u2014D\u2014E\u2014F\u2014G'
      const watermarks = scrubber.detectWatermarks(content)

      // Should detect excessive em-dashes (threshold is > 5)
      expect(watermarks.length).toBeGreaterThan(0)
      expect(watermarks.some(w => w.includes('em-dash'))).toBe(true)
    })

    it('should return empty array for clean content', () => {
      const content = 'This is completely clean content without any watermarks.'
      const watermarks = scrubber.detectWatermarks(content)

      expect(watermarks.length).toBe(0)
    })
  })

  describe('validateCleanContent', () => {
    it('should validate clean content', () => {
      const content = 'This is clean content.'
      const result = scrubber.validateCleanContent(content)

      expect(result.isClean).toBe(true)
      expect(result.issues.length).toBe(0)
    })

    it('should detect remaining invisible characters', () => {
      const content = 'Hello\u200BWorld'
      const result = scrubber.validateCleanContent(content)

      expect(result.isClean).toBe(false)
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it('should detect multiple spaces', () => {
      const content = 'Hello    World'
      const result = scrubber.validateCleanContent(content)

      expect(result.isClean).toBe(false)
      expect(result.issues.some(i => i.includes('spaces'))).toBe(true)
    })
  })
})
