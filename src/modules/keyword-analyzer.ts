/**
 * Keyword Analyzer
 *
 * Calculates keyword density, analyzes distribution, and performs semantic clustering
 * to identify keyword usage patterns and topic clusters within content.
 */

import type { KeywordAnalysis } from '../types/index.ts'

export interface KeywordAnalyzerResult {
  wordCount: number
  primaryKeyword: KeywordAnalysis & { keyword: string }
  secondaryKeywords: KeywordAnalysis[]
  keywordStuffing: {
    risk: 'low' | 'medium' | 'high'
    score: number
    message: string
  }
  clusters: Array<{
    id: number
    keywords: string[]
    theme: string
  }>
  distributionHeatmap: Record<string, number>
  lsiKeywords: string[]
}

export class KeywordAnalyzer {
  private stopWords: Set<string>

  constructor() {
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'will', 'with', 'you', 'your', 'this', 'their', 'but',
      'or', 'not', 'can', 'have', 'all', 'when', 'there', 'been', 'if',
      'more', 'so', 'about', 'what', 'which', 'who', 'would', 'could',
    ])
  }

  analyze(
    content: string,
    primaryKeyword: string,
    secondaryKeywords: string[] = [],
    targetDensity: number = 1.5
  ): KeywordAnalyzerResult {
    const wordCount = this.countWords(content)
    const sections = this.extractSections(content)

    // Analyze primary keyword
    const primaryAnalysis = this.analyzeKeyword(
      content,
      primaryKeyword,
      wordCount,
      sections,
      targetDensity
    )

    // Analyze secondary keywords
    const secondaryAnalysis = secondaryKeywords.map(keyword =>
      this.analyzeKeyword(
        content,
        keyword,
        wordCount,
        sections,
        targetDensity * 0.5 // Lower target for secondary
      )
    )

    // Detect keyword stuffing
    const stuffingRisk = this.detectKeywordStuffing(
      content,
      primaryKeyword,
      primaryAnalysis.density
    )

    // Perform topic clustering
    const clusters = this.performClustering(content, sections)

    // Distribution heatmap
    const heatmap = this.createDistributionHeatmap(primaryKeyword, sections)

    // LSI/semantic keyword suggestions
    const lsiKeywords = this.findLsiKeywords(content, primaryKeyword)

    return {
      wordCount,
      primaryKeyword: {
        ...primaryAnalysis,
        keyword: primaryKeyword,
      },
      secondaryKeywords: secondaryAnalysis,
      keywordStuffing: stuffingRisk,
      clusters,
      distributionHeatmap: heatmap,
      lsiKeywords,
    }
  }

  private analyzeKeyword(
    content: string,
    keyword: string,
    wordCount: number,
    sections: string[],
    targetDensity: number
  ): KeywordAnalysis {
    const keywordLower = keyword.toLowerCase()

    // Count occurrences
    const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
    const matches = content.match(regex) || []
    const count = matches.length

    // Find positions
    const positions: number[] = []
    let match
    const searchRegex = new RegExp(regex.source, regex.flags)
    while ((match = searchRegex.exec(content)) !== null) {
      positions.push(match.index)
    }

    // Calculate density
    const density = (count / wordCount) * 100

    // Determine distribution
    const distribution = this.analyzeDistribution(positions, content.length, sections.length)

    // Generate recommendation
    const recommendation = this.generateRecommendation(density, targetDensity, distribution)

    return {
      keyword,
      density,
      count,
      positions,
      distribution,
      recommendation,
    }
  }

  private analyzeDistribution(
    positions: number[],
    contentLength: number,
    sectionCount: number
  ): string {
    if (positions.length === 0) return 'absent'
    if (positions.length === 1) return 'single'

    // Divide content into sections
    const sectionSize = contentLength / sectionCount
    const sectionsWithKeyword = new Set(
      positions.map(pos => Math.floor(pos / sectionSize))
    )

    const coverage = sectionsWithKeyword.size / sectionCount

    if (coverage >= 0.8) return 'excellent'
    if (coverage >= 0.6) return 'good'
    if (coverage >= 0.4) return 'moderate'
    return 'poor'
  }

  private generateRecommendation(
    density: number,
    targetDensity: number,
    distribution: string
  ): string {
    const recommendations: string[] = []

    if (density < targetDensity * 0.7) {
      recommendations.push('Increase keyword usage')
    } else if (density > targetDensity * 1.5) {
      recommendations.push('Reduce keyword usage to avoid stuffing')
    } else {
      recommendations.push('Keyword density is optimal')
    }

    if (distribution === 'poor' || distribution === 'moderate') {
      recommendations.push('Distribute keyword more evenly throughout content')
    }

    return recommendations.join('. ')
  }

  private detectKeywordStuffing(
    content: string,
    keyword: string,
    density: number
  ): { risk: 'low' | 'medium' | 'high'; score: number; message: string } {
    const sentences = content.split(/[.!?]+/)
    const keywordLower = keyword.toLowerCase()

    let highDensitySentences = 0
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase()
      const words = sentenceLower.split(/\s+/).length
      const keywordCount = (sentenceLower.match(new RegExp(keywordLower, 'g')) || []).length

      if (words > 0 && (keywordCount / words) > 0.1) {
        highDensitySentences++
      }
    }

    const stuffingRatio = highDensitySentences / Math.max(sentences.length, 1)
    const score = Math.min(stuffingRatio * 100, 100)

    let risk: 'low' | 'medium' | 'high' = 'low'
    let message = 'No keyword stuffing detected'

    if (score > 20 || density > 3.5) {
      risk = 'high'
      message = 'High risk of keyword stuffing detected'
    } else if (score > 10 || density > 2.5) {
      risk = 'medium'
      message = 'Moderate keyword density, monitor for stuffing'
    }

    return { risk, score, message }
  }

  private extractSections(content: string): string[] {
    // Split by headings or paragraphs
    const sections = content.split(/\n{2,}/).filter(s => s.trim().length > 0)
    return sections.length > 0 ? sections : [content]
  }

  private performClustering(_content: string, sections: string[]): Array<{
    id: number
    keywords: string[]
    theme: string
  }> {
    // Simplified clustering - extract top keywords from each section
    const clusters: Array<{ id: number; keywords: string[]; theme: string }> = []

    sections.forEach((section, idx) => {
      const keywords = this.extractTopKeywords(section, 5)
      const theme = keywords.length > 0 ? keywords[0]! : 'general'

      clusters.push({
        id: idx,
        keywords,
        theme,
      })
    })

    return clusters
  }

  private extractTopKeywords(text: string, limit: number): string[] {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3 && !this.stopWords.has(w) && /^[a-z]+$/.test(w))

    const frequency = new Map<string, number>()
    for (const word of words) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
    }

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word)
  }

  private createDistributionHeatmap(keyword: string, sections: string[]): Record<string, number> {
    const heatmap: Record<string, number> = {}
    const keywordLower = keyword.toLowerCase()

    sections.forEach((section, idx) => {
      const sectionLower = section.toLowerCase()
      const count = (sectionLower.match(new RegExp(keywordLower, 'g')) || []).length
      heatmap[`section_${idx + 1}`] = count
    })

    return heatmap
  }

  private findLsiKeywords(content: string, primaryKeyword: string): string[] {
    // Simplified LSI - find related words that appear frequently
    const keywords = this.extractTopKeywords(content, 20)
    return keywords.filter(kw => kw !== primaryKeyword.toLowerCase()).slice(0, 10)
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(w => w.trim().length > 0 && /\w/.test(w)).length
  }
}
