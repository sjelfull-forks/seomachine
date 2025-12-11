/**
 * Search Intent Analyzer
 *
 * Determines the search intent of a query by analyzing SERP features and content patterns.
 * Classifies queries as: Informational, Navigational, Transactional, or Commercial Investigation.
 */

import type { SearchIntentType } from '../types/index.ts'

type IntentType = 'informational' | 'navigational' | 'transactional' | 'commercial_investigation'

interface IntentSignals {
  informational: string[]
  navigational: string[]
  transactional: string[]
  commercial: string[]
}

export class SearchIntentAnalyzer {
  private intentKeywords: IntentSignals

  constructor() {
    this.intentKeywords = {
      informational: [
        'what', 'why', 'how', 'when', 'where', 'who', 'guide', 'tutorial',
        'learn', 'tips', 'examples', 'definition', 'meaning', 'explain',
      ],
      navigational: [
        'login', 'sign in', 'official', 'website', 'homepage', 'portal',
        'dashboard', 'account', 'app',
      ],
      transactional: [
        'buy', 'purchase', 'order', 'shop', 'price', 'deal', 'discount',
        'coupon', 'sale', 'cheap', 'affordable', 'subscription', 'download',
      ],
      commercial: [
        'best', 'top', 'review', 'comparison', 'vs', 'versus', 'alternative',
        'compare', 'recommend', 'rating', 'worth',
      ],
    }
  }

  analyze(query: string, serpFeatures?: string[]): SearchIntentType {
    const queryLower = query.toLowerCase()
    const signals: string[] = []
    const scores: Record<IntentType, number> = {
      informational: 0,
      navigational: 0,
      transactional: 0,
      commercial_investigation: 0,
    }

    // Analyze query keywords
    for (const keyword of this.intentKeywords.informational) {
      if (queryLower.includes(keyword)) {
        scores.informational += 2
        signals.push(`informational keyword: ${keyword}`)
      }
    }

    for (const keyword of this.intentKeywords.navigational) {
      if (queryLower.includes(keyword)) {
        scores.navigational += 3
        signals.push(`navigational keyword: ${keyword}`)
      }
    }

    for (const keyword of this.intentKeywords.transactional) {
      if (queryLower.includes(keyword)) {
        scores.transactional += 2
        signals.push(`transactional keyword: ${keyword}`)
      }
    }

    for (const keyword of this.intentKeywords.commercial) {
      if (queryLower.includes(keyword)) {
        scores.commercial_investigation += 2
        signals.push(`commercial keyword: ${keyword}`)
      }
    }

    // Analyze SERP features if provided
    if (serpFeatures && serpFeatures.length > 0) {
      for (const feature of serpFeatures) {
        const featureLower = feature.toLowerCase()

        if (featureLower.includes('knowledge') || featureLower.includes('people_also_ask')) {
          scores.informational += 1
          signals.push(`SERP feature: ${feature}`)
        }

        if (featureLower.includes('shopping') || featureLower.includes('product')) {
          scores.transactional += 2
          signals.push(`SERP feature: ${feature}`)
        }

        if (featureLower.includes('local')) {
          scores.navigational += 1
          signals.push(`SERP feature: ${feature}`)
        }
      }
    }

    // Question queries are typically informational
    if (queryLower.startsWith('what') || queryLower.startsWith('how') || 
        queryLower.startsWith('why') || queryLower.startsWith('when')) {
      scores.informational += 3
      signals.push('question format')
    }

    // Brand names suggest navigational
    if (this.hasProperNoun(query)) {
      scores.navigational += 1
      signals.push('contains proper noun/brand')
    }

    // Determine primary intent
    let maxScore = 0
    let primaryIntent: IntentType = 'informational'

    for (const [intent, score] of Object.entries(scores) as [IntentType, number][]) {
      if (score > maxScore) {
        maxScore = score
        primaryIntent = intent
      }
    }

    // Calculate confidence (0-1)
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.5

    return {
      intent: primaryIntent,
      confidence,
      signals,
    }
  }

  private hasProperNoun(query: string): boolean {
    // Simple heuristic: words starting with capital letters (excluding first word)
    const words = query.split(' ')
    return words.slice(1).some(word => /^[A-Z]/.test(word))
  }

  getIntentDescription(intent: IntentType): string {
    const descriptions: Record<IntentType, string> = {
      informational: 'User wants to learn or find information about a topic',
      navigational: 'User wants to find a specific website or page',
      transactional: 'User wants to complete an action or purchase',
      commercial_investigation: 'User is researching products/services before purchase',
    }
    return descriptions[intent]
  }
}
