/**
 * Content Scrubber
 *
 * Removes AI-generated content watermarks and telltale signs including:
 * - Invisible Unicode characters (zero-width spaces, format-control characters, etc.)
 * - Em-dashes replaced with contextually appropriate punctuation
 *
 * This module ensures content appears naturally human-written.
 */

export interface ScrubResult {
  cleanedContent: string
  removedCharacters: number
  replacements: number
  issues: string[]
}

export class ContentScrubber {
  private invisibleChars: string[]

  constructor() {
    // Zero-width and invisible Unicode characters
    this.invisibleChars = [
      '\u200B', // Zero-width space
      '\u200C', // Zero-width non-joiner
      '\u200D', // Zero-width joiner
      '\uFEFF', // Zero-width no-break space (BOM)
      '\u202A', // Left-to-right embedding
      '\u202B', // Right-to-left embedding
      '\u202C', // Pop directional formatting
      '\u202D', // Left-to-right override
      '\u202E', // Right-to-left override
      '\u2060', // Word joiner
      '\u2061', // Function application
      '\u2062', // Invisible times
      '\u2063', // Invisible separator
      '\u2064', // Invisible plus
    ]
  }

  scrub(content: string): ScrubResult {
    let cleaned = content
    let removedCount = 0
    let replacementCount = 0
    const issues: string[] = []

    // Remove invisible characters
    for (const char of this.invisibleChars) {
      const regex = new RegExp(char, 'g')
      const matches = cleaned.match(regex)
      if (matches) {
        removedCount += matches.length
        issues.push(`Removed ${matches.length} invisible characters (U+${char.charCodeAt(0).toString(16)})`)
      }
      cleaned = cleaned.replace(regex, '')
    }

    // Replace em-dashes with contextually appropriate punctuation
    // Em-dash between words → en-dash
    cleaned = cleaned.replace(/(\w)\s*\u2014\s*(\w)/g, (_, before, after) => {
      replacementCount++
      return `${before} – ${after}`
    })

    // Em-dash at start of sentence → regular dash
    cleaned = cleaned.replace(/^\u2014\s*/gm, '- ')
    
    // Em-dash used for interruption → two hyphens or period
    cleaned = cleaned.replace(/\u2014/g, '--')

    // Clean up multiple spaces
    const multiSpaceMatches = cleaned.match(/\s{3,}/g)
    if (multiSpaceMatches) {
      replacementCount += multiSpaceMatches.length
      issues.push(`Normalized ${multiSpaceMatches.length} instances of multiple spaces`)
    }
    cleaned = cleaned.replace(/\s{3,}/g, ' ')

    // Clean up multiple consecutive punctuation marks
    cleaned = cleaned.replace(/([.!?]){3,}/g, '$1$1$1') // Max 3 of same punctuation
    cleaned = cleaned.replace(/,{2,}/g, ',') // No double commas

    // Normalize line breaks (max 2 consecutive)
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

    // Detect unusual Unicode ranges that might be watermarks
    const unusualChars = cleaned.match(/[\u2000-\u206F\u2100-\u214F]/g)
    if (unusualChars && unusualChars.length > 0) {
      const uniqueChars = [...new Set(unusualChars)]
      issues.push(`Found ${uniqueChars.length} potentially unusual Unicode characters`)
    }

    return {
      cleanedContent: cleaned.trim(),
      removedCharacters: removedCount,
      replacements: replacementCount,
      issues,
    }
  }

  detectWatermarks(content: string): string[] {
    const watermarks: string[] = []

    // Check for invisible characters
    for (const char of this.invisibleChars) {
      if (content.includes(char)) {
        watermarks.push(`Contains invisible character U+${char.charCodeAt(0).toString(16)}`)
      }
    }

    // Check for excessive em-dashes
    const emDashCount = (content.match(/\u2014/g) || []).length
    if (emDashCount > 5) {
      watermarks.push(`Excessive em-dashes (${emDashCount})`)
    }

    // Check for unusual Unicode ranges
    const unusualRanges = [
      { range: /[\u2000-\u206F]/g, name: 'General Punctuation' },
      { range: /[\u2100-\u214F]/g, name: 'Letterlike Symbols' },
      { range: /[\uFFF0-\uFFFF]/g, name: 'Specials' },
    ]

    for (const { range, name } of unusualRanges) {
      const matches = content.match(range)
      if (matches && matches.length > 2) {
        watermarks.push(`Unusual ${name} Unicode characters (${matches.length})`)
      }
    }

    return watermarks
  }

  validateCleanContent(content: string): { isClean: boolean; issues: string[] } {
    const issues: string[] = []

    // Check for remaining invisible characters
    for (const char of this.invisibleChars) {
      if (content.includes(char)) {
        issues.push(`Still contains invisible character U+${char.charCodeAt(0).toString(16)}`)
      }
    }

    // Check for multiple spaces
    if (/\s{3,}/.test(content)) {
      issues.push('Contains multiple consecutive spaces')
    }

    // Check for unusual line breaks
    if (/\n{3,}/.test(content)) {
      issues.push('Contains more than 2 consecutive line breaks')
    }

    return {
      isClean: issues.length === 0,
      issues,
    }
  }
}
