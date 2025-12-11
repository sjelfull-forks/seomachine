/**
 * SEO Quality Rater
 *
 * Rates content quality against SEO best practices and guidelines.
 * Provides scoring (0-100) and specific recommendations for improvement.
 */

import type { SEOQualityScore } from '../types/index.ts'

export interface SEOGuidelines {
  titleMinLength?: number
  titleMaxLength?: number
  metaDescriptionMinLength?: number
  metaDescriptionMaxLength?: number
  minWordCount?: number
  maxWordCount?: number
  targetKeywordDensity?: number
}

export class SEOQualityRater {
  private guidelines: Required<SEOGuidelines>

  constructor(customGuidelines?: SEOGuidelines) {
    this.guidelines = {
      titleMinLength: customGuidelines?.titleMinLength ?? 30,
      titleMaxLength: customGuidelines?.titleMaxLength ?? 60,
      metaDescriptionMinLength: customGuidelines?.metaDescriptionMinLength ?? 120,
      metaDescriptionMaxLength: customGuidelines?.metaDescriptionMaxLength ?? 160,
      minWordCount: customGuidelines?.minWordCount ?? 300,
      maxWordCount: customGuidelines?.maxWordCount ?? 5000,
      targetKeywordDensity: customGuidelines?.targetKeywordDensity ?? 1.5,
    }
  }

  rate(
    content: string,
    title?: string,
    metaDescription?: string,
    primaryKeyword?: string
  ): SEOQualityScore {
    const scores = {
      title: this.rateTitle(title, primaryKeyword),
      metaDescription: this.rateMetaDescription(metaDescription, primaryKeyword),
      heading: this.rateHeadings(content, primaryKeyword),
      keyword: this.rateKeywordUsage(content, primaryKeyword),
      content: this.rateContent(content),
      technical: this.rateTechnicalSEO(content),
    }

    const overallScore = Math.round(
      (scores.title.score +
        scores.metaDescription.score +
        scores.heading.score +
        scores.keyword.score +
        scores.content.score +
        scores.technical.score) /
        6
    )

    const recommendations = [
      ...scores.title.recommendations,
      ...scores.metaDescription.recommendations,
      ...scores.heading.recommendations,
      ...scores.keyword.recommendations,
      ...scores.content.recommendations,
      ...scores.technical.recommendations,
    ].filter(r => r.length > 0)

    return {
      overallScore,
      titleScore: scores.title.score,
      metaDescriptionScore: scores.metaDescription.score,
      headingScore: scores.heading.score,
      keywordScore: scores.keyword.score,
      contentScore: scores.content.score,
      technicalScore: scores.technical.score,
      recommendations,
    }
  }

  private rateTitle(
    title?: string,
    keyword?: string
  ): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 0

    if (!title) {
      recommendations.push('Add a title tag')
      return { score: 0, recommendations }
    }

    const length = title.length

    // Length check (30-60 chars is ideal)
    if (length < this.guidelines.titleMinLength) {
      recommendations.push(`Title is too short (${length} chars). Aim for ${this.guidelines.titleMinLength}-${this.guidelines.titleMaxLength}`)
      score += 30
    } else if (length > this.guidelines.titleMaxLength) {
      recommendations.push(`Title is too long (${length} chars). Aim for ${this.guidelines.titleMinLength}-${this.guidelines.titleMaxLength}`)
      score += 70
    } else {
      score += 100
    }

    // Keyword check
    if (keyword) {
      const titleLower = title.toLowerCase()
      const keywordLower = keyword.toLowerCase()

      if (titleLower.includes(keywordLower)) {
        const keywordPos = titleLower.indexOf(keywordLower)

        if (keywordPos < title.length / 3) {
          // Keyword in first third - best
          score = Math.min(score + 20, 100)
        } else {
          recommendations.push('Move primary keyword closer to the beginning of title')
        }
      } else {
        recommendations.push('Include primary keyword in title')
        score = Math.max(score - 30, 0)
      }
    }

    return { score: Math.min(score, 100), recommendations }
  }

  private rateMetaDescription(
    metaDescription?: string,
    keyword?: string
  ): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 0

    if (!metaDescription) {
      recommendations.push('Add a meta description')
      return { score: 0, recommendations }
    }

    const length = metaDescription.length

    if (length < this.guidelines.metaDescriptionMinLength) {
      recommendations.push(
        `Meta description is too short (${length} chars). Aim for ${this.guidelines.metaDescriptionMinLength}-${this.guidelines.metaDescriptionMaxLength}`
      )
      score += 40
    } else if (length > this.guidelines.metaDescriptionMaxLength) {
      recommendations.push(
        `Meta description is too long (${length} chars). Aim for ${this.guidelines.metaDescriptionMinLength}-${this.guidelines.metaDescriptionMaxLength}`
      )
      score += 70
    } else {
      score += 100
    }

    // Keyword check
    if (keyword && !metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      recommendations.push('Include primary keyword in meta description')
      score = Math.max(score - 20, 0)
    }

    return { score: Math.min(score, 100), recommendations }
  }

  private rateHeadings(
    content: string,
    keyword?: string
  ): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 100

    // Check for H1
    const h1Matches = content.match(/^#\s+.+$/gm) || []
    if (h1Matches.length === 0) {
      recommendations.push('Add an H1 heading')
      score -= 40
    } else if (h1Matches.length > 1) {
      recommendations.push('Use only one H1 heading')
      score -= 20
    }

    // Check for H2/H3 structure
    const h2Matches = content.match(/^##\s+.+$/gm) || []
    if (h2Matches.length === 0) {
      recommendations.push('Add H2 headings to structure content')
      score -= 20
    }

    // Check keyword in headings
    if (keyword) {
      const allHeadings = content.match(/^#{1,6}\s+.+$/gm) || []
      const headingsWithKeyword = allHeadings.filter(h =>
        h.toLowerCase().includes(keyword.toLowerCase())
      )

      if (headingsWithKeyword.length === 0) {
        recommendations.push('Include primary keyword in at least one heading')
        score -= 20
      }
    }

    return { score: Math.max(score, 0), recommendations }
  }

  private rateKeywordUsage(
    content: string,
    keyword?: string
  ): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 100

    if (!keyword) {
      return { score, recommendations }
    }

    const words = content.split(/\s+/).filter(w => /\w/.test(w))
    const keywordLower = keyword.toLowerCase()
    const keywordCount = content.toLowerCase().split(keywordLower).length - 1

    const density = (keywordCount / words.length) * 100

    if (density < 0.5) {
      recommendations.push(`Keyword density is low (${density.toFixed(2)}%). Increase usage.`)
      score -= 30
    } else if (density > 3.0) {
      recommendations.push(`Keyword density is high (${density.toFixed(2)}%). Risk of keyword stuffing.`)
      score -= 40
    } else if (density < 1.0 || density > 2.5) {
      recommendations.push(`Keyword density is ${density.toFixed(2)}%. Aim for 1.0-2.5%.`)
      score -= 10
    }

    // Check first 100 words
    const first100 = words.slice(0, 100).join(' ').toLowerCase()
    if (!first100.includes(keywordLower)) {
      recommendations.push('Include primary keyword in the first 100 words')
      score -= 15
    }

    return { score: Math.max(score, 0), recommendations }
  }

  private rateContent(content: string): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 100

    const words = content.split(/\s+/).filter(w => /\w/.test(w))
    const wordCount = words.length

    if (wordCount < this.guidelines.minWordCount) {
      recommendations.push(`Content is too short (${wordCount} words). Aim for at least ${this.guidelines.minWordCount} words.`)
      score -= 40
    } else if (wordCount > this.guidelines.maxWordCount) {
      recommendations.push(`Content is very long (${wordCount} words). Consider splitting into multiple articles.`)
      score -= 10
    }

    // Check for images (markdown syntax)
    const images = content.match(/!\[.*?\]\(.*?\)/g) || []
    if (images.length === 0 && wordCount > 500) {
      recommendations.push('Add images to improve engagement')
      score -= 10
    }

    // Check for links
    const links = content.match(/\[.*?\]\(.*?\)/g) || []
    if (links.length === 0 && wordCount > 300) {
      recommendations.push('Add internal and external links')
      score -= 10
    }

    // Check paragraph length
    const paragraphs = content.split(/\n\n+/)
    const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150)
    if (longParagraphs.length > 0) {
      recommendations.push('Break up long paragraphs for better readability')
      score -= 10
    }

    return { score: Math.max(score, 0), recommendations }
  }

  private rateTechnicalSEO(content: string): { score: number; recommendations: string[] } {
    const recommendations: string[] = []
    let score = 100

    // Check for alt text on images
    const images = content.match(/!\[(.*?)\]\(.*?\)/g) || []
    const imagesWithoutAlt = images.filter(img => {
      const altMatch = img.match(/!\[(.*?)\]/)
      return !altMatch || altMatch[1]?.trim().length === 0
    })

    if (imagesWithoutAlt.length > 0) {
      recommendations.push(`${imagesWithoutAlt.length} image(s) missing alt text`)
      score -= 15
    }

    // Check for broken link patterns (basic check)
    const links = content.match(/\[.*?\]\((.*?)\)/g) || []
    const suspiciousLinks = links.filter(link => {
      const urlMatch = link.match(/\((.*?)\)/)
      return urlMatch && (urlMatch[1]?.includes('localhost') || urlMatch[1] === '#')
    })

    if (suspiciousLinks.length > 0) {
      recommendations.push('Review links for broken or placeholder URLs')
      score -= 10
    }

    return { score: Math.max(score, 0), recommendations }
  }
}
