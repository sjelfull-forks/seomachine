#!/usr/bin/env node
/**
 * Example: SEO Content Analysis
 * 
 * This script demonstrates how to use the SEO Machine modules
 * to analyze content for SEO quality.
 */

import { 
  KeywordAnalyzer, 
  ReadabilityScorer, 
  SEOQualityRater,
  SearchIntentAnalyzer,
  ContentScrubber 
} from '../src/index.ts'

// Sample content for analysis
const sampleContent = `
# How to Optimize SEO for Your Website

SEO optimization is crucial for improving your website's visibility in search engines. 
In this comprehensive guide, we'll explore the best practices for SEO.

## Understanding SEO Basics

Search engine optimization helps your content rank higher in search results. 
Good SEO practices include keyword research, quality content creation, and technical optimization.

## Key SEO Strategies

1. Keyword Research: Identify the right keywords for your content
2. Content Quality: Create valuable, engaging content for your audience
3. Technical SEO: Ensure your website is technically sound
4. Link Building: Build high-quality backlinks to your site

SEO is an ongoing process that requires consistent effort and adaptation to search engine algorithm changes.

![SEO Strategy Diagram](https://example.com/seo-diagram.png)

For more information, check out [Google's SEO Starter Guide](https://developers.google.com/search/docs).
`

console.log('🔍 SEO Machine - Content Analysis Example\n')
console.log('=' .repeat(60))

// 1. Analyze Search Intent
console.log('\n📊 Search Intent Analysis')
console.log('-'.repeat(60))
const intentAnalyzer = new SearchIntentAnalyzer()
const intent = intentAnalyzer.analyze('how to optimize SEO')
console.log(`Query: "how to optimize SEO"`)
console.log(`Intent: ${intent.intent}`)
console.log(`Confidence: ${(intent.confidence * 100).toFixed(1)}%`)
console.log(`Signals: ${intent.signals.slice(0, 3).join(', ')}`)

// 2. Analyze Keywords
console.log('\n📈 Keyword Analysis')
console.log('-'.repeat(60))
const keywordAnalyzer = new KeywordAnalyzer()
const keywordResults = keywordAnalyzer.analyze(
  sampleContent,
  'SEO',
  ['content', 'optimization'],
  1.5
)
console.log(`Primary Keyword: ${keywordResults.primaryKeyword.keyword}`)
console.log(`Density: ${keywordResults.primaryKeyword.density.toFixed(2)}%`)
console.log(`Count: ${keywordResults.primaryKeyword.count}`)
console.log(`Distribution: ${keywordResults.primaryKeyword.distribution}`)
console.log(`Stuffing Risk: ${keywordResults.keywordStuffing.risk}`)
console.log(`LSI Keywords: ${keywordResults.lsiKeywords.slice(0, 5).join(', ')}`)

// 3. Analyze Readability
console.log('\n📖 Readability Analysis')
console.log('-'.repeat(60))
const readabilityScorer = new ReadabilityScorer()
const readability = readabilityScorer.analyze(sampleContent)
console.log(`Flesch Reading Ease: ${readability.fleschReadingEase.toFixed(1)}`)
console.log(`Flesch-Kincaid Grade: ${readability.fleschKincaidGrade.toFixed(1)}`)
console.log(`Grade Level: ${readability.grade}`)
console.log(`Avg Sentence Length: ${readability.averageSentenceLength.toFixed(1)} words`)
console.log(`Recommendation: ${readability.recommendation}`)

// 4. Rate SEO Quality
console.log('\n⭐ SEO Quality Rating')
console.log('-'.repeat(60))
const seoRater = new SEOQualityRater()
const quality = seoRater.rate(
  sampleContent,
  'How to Optimize SEO for Your Website - Complete Guide 2024',
  'Learn the best practices for SEO optimization to improve your website rankings. This comprehensive guide covers keyword research, content quality, and technical SEO.',
  'SEO'
)
console.log(`Overall Score: ${quality.overallScore}/100`)
console.log(`  - Title: ${quality.titleScore}/100`)
console.log(`  - Meta Description: ${quality.metaDescriptionScore}/100`)
console.log(`  - Headings: ${quality.headingScore}/100`)
console.log(`  - Keywords: ${quality.keywordScore}/100`)
console.log(`  - Content: ${quality.contentScore}/100`)
console.log(`  - Technical: ${quality.technicalScore}/100`)

if (quality.recommendations.length > 0) {
  console.log(`\nTop Recommendations:`)
  quality.recommendations.slice(0, 3).forEach((rec, idx) => {
    console.log(`  ${idx + 1}. ${rec}`)
  })
}

// 5. Clean Content
console.log('\n🧹 Content Scrubbing')
console.log('-'.repeat(60))
const scrubber = new ContentScrubber()
const cleanResult = scrubber.scrub(sampleContent)
console.log(`Removed Characters: ${cleanResult.removedCharacters}`)
console.log(`Replacements Made: ${cleanResult.replacements}`)
console.log(`Issues Found: ${cleanResult.issues.length}`)

const watermarks = scrubber.detectWatermarks(sampleContent)
if (watermarks.length > 0) {
  console.log(`Watermarks Detected: ${watermarks.join(', ')}`)
} else {
  console.log(`✓ No watermarks detected - content appears clean`)
}

console.log('\n' + '='.repeat(60))
console.log('✅ Analysis Complete!\n')
