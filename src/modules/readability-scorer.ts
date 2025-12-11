/**
 * Readability Scorer
 *
 * Calculates multiple readability metrics including Flesch Reading Ease,
 * Flesch-Kincaid Grade Level, and other readability indicators.
 */

import type { ReadabilityMetrics } from '../types/index.ts'

export class ReadabilityScorer {
  private targetReadingLevel: [number, number] = [8, 10] // 8th-10th grade
  private targetFleschEase: [number, number] = [60, 70] // Fairly easy to read

  analyze(content: string): ReadabilityMetrics {
    const sentences = this.countSentences(content)
    const words = this.countWords(content)
    const syllables = this.countSyllables(content)

    const avgSentenceLength = words / Math.max(sentences, 1)
    const avgSyllablesPerWord = syllables / Math.max(words, 1)
    const avgWordLength = this.calculateAvgWordLength(content)

    // Flesch Reading Ease: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const fleschReadingEase = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord

    // Flesch-Kincaid Grade Level: 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const fleschKincaidGrade = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59

    // Gunning Fog Index: 0.4 * [(words/sentences) + 100 * (complex_words/words)]
    const complexWords = this.countComplexWords(content)
    const gunningFog = 0.4 * (avgSentenceLength + 100 * (complexWords / Math.max(words, 1)))

    // SMOG Index (simplified): 1.0430 * sqrt(polysyllables * (30/sentences)) + 3.1291
    const polysyllables = this.countPolysyllables(content)
    const smogIndex = 1.043 * Math.sqrt(polysyllables * (30 / Math.max(sentences, 1))) + 3.1291

    const grade = this.getGradeLevel(fleschKincaidGrade)
    const recommendation = this.getRecommendation(fleschReadingEase, fleschKincaidGrade)

    return {
      fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
      gunningFog: Math.round(gunningFog * 10) / 10,
      smogIndex: Math.round(smogIndex * 10) / 10,
      averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      averageWordLength: Math.round(avgWordLength * 10) / 10,
      grade,
      recommendation,
    }
  }

  private countSentences(text: string): number {
    // Split on sentence-ending punctuation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    return Math.max(sentences.length, 1)
  }

  private countWords(text: string): number {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0 && /\w/.test(w))
    return Math.max(words.length, 1)
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(w => /\w/.test(w))
    let totalSyllables = 0

    for (const word of words) {
      totalSyllables += this.syllablesInWord(word)
    }

    return Math.max(totalSyllables, 1)
  }

  private syllablesInWord(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '')
    if (word.length <= 3) return 1

    // Count vowel groups
    let syllables = 0
    let previousWasVowel = false

    for (let i = 0; i < word.length; i++) {
      const isVowel = /[aeiouy]/.test(word[i] || '')
      if (isVowel && !previousWasVowel) {
        syllables++
      }
      previousWasVowel = isVowel
    }

    // Adjust for silent 'e'
    if (word.endsWith('e')) {
      syllables--
    }

    // Ensure at least 1 syllable
    return Math.max(syllables, 1)
  }

  private countComplexWords(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(w => /\w/.test(w))
    let complexCount = 0

    for (const word of words) {
      if (this.syllablesInWord(word) >= 3) {
        complexCount++
      }
    }

    return complexCount
  }

  private countPolysyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/).filter(w => /\w/.test(w))
    let polyCount = 0

    for (const word of words) {
      if (this.syllablesInWord(word) >= 3) {
        polyCount++
      }
    }

    return polyCount
  }

  private calculateAvgWordLength(text: string): number {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0 && /\w/.test(w))
    if (words.length === 0) return 0

    const totalLength = words.reduce((sum, word) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '')
      return sum + cleanWord.length
    }, 0)

    return totalLength / words.length
  }

  private getGradeLevel(grade: number): string {
    if (grade < 6) return 'Elementary'
    if (grade < 9) return 'Middle School'
    if (grade < 13) return 'High School'
    if (grade < 16) return 'College'
    return 'Graduate'
  }

  private getRecommendation(fleschEase: number, gradeLevel: number): string {
    const recommendations: string[] = []

    if (fleschEase < this.targetFleschEase[0]) {
      recommendations.push('Content is difficult to read. Simplify sentences and use simpler words.')
    } else if (fleschEase > this.targetFleschEase[1]) {
      recommendations.push('Content is very easy to read. Consider if this matches your audience.')
    } else {
      recommendations.push('Reading ease is in the target range.')
    }

    if (gradeLevel < this.targetReadingLevel[0]) {
      recommendations.push('Grade level is below target. Content may be too simple.')
    } else if (gradeLevel > this.targetReadingLevel[1]) {
      recommendations.push('Grade level is above target. Simplify language and sentence structure.')
    } else {
      recommendations.push('Grade level is appropriate.')
    }

    return recommendations.join(' ')
  }
}
